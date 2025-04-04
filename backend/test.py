import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
from model import CTTS  # Custom model class
import os

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")


def load_and_prepare_data(filepath):
    df = pd.read_csv(filepath)
    df.drop(columns=['Datetime'], inplace=True)
    FEATURES = df.columns.tolist()
    df = df[FEATURES]
    return df, FEATURES


def normalize_data(df):
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df.astype(float))
    return scaled_data, scaler


def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i + seq_length])
        y.append(data[i + seq_length, 0])
    return np.array(X), np.array(y)


def prepare_tensors(X, y):
    X_tensor = torch.tensor(X, dtype=torch.float32).to(device)
    y_tensor = torch.tensor(y, dtype=torch.float32).unsqueeze(1).to(device)
    return X_tensor, y_tensor


def load_model(path, input_dim):
    model = CTTS(input_dim=input_dim).to(device)
    model.load_state_dict(torch.load(path))
    model.eval()
    return model


def evaluate_model(model, X, y):
    with torch.no_grad():
        predictions = model(X).cpu().numpy()
    actuals = y.cpu().numpy()

    mse = mean_squared_error(actuals, predictions)
    r2 = r2_score(actuals, predictions)
    accuracy = (1 - mse) * 100

    return predictions, actuals, mse, r2, accuracy


def show_sample_predictions(y_true, y_pred, scaler, features, sample_size=5):
    print("\nSample Predictions:")
    for i in range(min(sample_size, len(y_pred))):
        dummy_actual = np.zeros((1, len(features)))
        dummy_pred = np.zeros((1, len(features)))

        dummy_actual[0, 0] = y_true[i][0]
        dummy_pred[0, 0] = y_pred[i][0]

        actual = scaler.inverse_transform(dummy_actual)[0][0]
        predicted = scaler.inverse_transform(dummy_pred)[0][0]

        print(f"Actual: {actual:.2f} | Predicted: {predicted:.2f}")


def run_evaluation(ticker, model_dir="models", data_dir="data", seq_length=300):
    print(f"\n📈 Evaluating model for: {ticker}")
    filepath = os.path.join(data_dir, f"Data_{ticker}.csv")
    model_path = os.path.join(model_dir, f"model_{ticker}.pth")

    try:
        df, features = load_and_prepare_data(filepath)
        data, scaler = normalize_data(df)
        X_np, y_np = create_sequences(data, seq_length)
        X_tensor, y_tensor = prepare_tensors(X_np, y_np)

        model = load_model(model_path, input_dim=len(features))
        y_pred, y_true, mse, r2, accuracy = evaluate_model(model, X_tensor, y_tensor)

        print(f"✅ Mean Squared Error (MSE): {mse:.6f}")
        print(f"✅ R-squared (R2) Score: {r2:.6f}")
        print(f"✅ Accuracy: {accuracy:.2f}%")

        show_sample_predictions(y_true, y_pred, scaler, features)

    except Exception as e:
        print(f"❌ Evaluation failed for {ticker}: {e}")


def main():
    tickers = ["ITC.NS", "RELIANCE.NS", "INFY.NS"]  # Add more as needed
    for ticker in tickers:
        run_evaluation(ticker)


if __name__ == "__main__":
    main()
