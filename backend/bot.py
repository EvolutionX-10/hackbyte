import os
import torch
import numpy as np
from model import CTTS 
from test import load_and_prepare_data
from sklearn.preprocessing import MinMaxScaler
import warnings
warnings.filterwarnings("ignore")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def normalize_data(df):
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df.astype(float))
    return scaled_data, scaler

def load_model(path, input_dim):
    model = CTTS(input_dim=input_dim).to(device)
    model.load_state_dict(torch.load(path))
    model.eval()
    return model

def predict_price(ticker, steps_ahead=1, seq_length=300, model_dir="models", data_dir="data"):
    print(f"\nPredicting {steps_ahead} future step(s) for: {ticker}")

    filepath = os.path.join(data_dir, f"Data_{ticker}.csv")
    model_path = os.path.join(model_dir, f"model.pth") # "model_{ticker}.pth"

    try:
        # Load and normalize data
        df, features = load_and_prepare_data(filepath)
        data, scaler = normalize_data(df)

        if len(data) < seq_length:
            raise ValueError("Not enough data to form a prediction window.")

        input_dim = len(features)
        model = load_model(model_path, input_dim=input_dim)

        # Start with the last known sequence
        last_sequence = data[-seq_length:]
        model_input = torch.tensor(last_sequence, dtype=torch.float32).unsqueeze(0).to(device)

        predictions = []

        model.eval()
        for _ in range(steps_ahead):
            with torch.no_grad():
                output = model(model_input).cpu().numpy()[0][0]

            predictions.append(output)

            # Prepare next input by sliding the window and adding new predicted value
            last_sequence = np.vstack([last_sequence[1:], last_sequence[-1]])  # copy last row
            last_sequence[-1, 0] = output  # update target feature only
            model_input = torch.tensor(last_sequence, dtype=torch.float32).unsqueeze(0).to(device)

        # Inverse transform predictions
        dummy_array = np.zeros((steps_ahead, len(features)))
        dummy_array[:, 0] = predictions
        future_actuals = scaler.inverse_transform(dummy_array)[:, 0]

        print(f"\n Future Predictions ({ticker}):")
        for i, value in enumerate(future_actuals, 1):
            print(f"Step {i}: {value:.2f}")

        return future_actuals

    except Exception as e:
        print(f" Future prediction failed for {ticker}: {e}")
        return None
    
    
def main():
    tickers = ["RELIANCE.NS", "INFY.NS", "ITC.NS"]
    for ticker in tickers:
        predict_price(ticker)

if __name__ == "__main__":
    main()