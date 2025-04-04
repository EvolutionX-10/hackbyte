import os
import csv
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from model import CTTS  # Your custom model

# 🛠 Hyperparameters
SEQ_LENGTH = 300
BATCH_SIZE = 32
EPOCHS = 100
LEARNING_RATE = 0.00001
DATA_DIR = "data"
MODEL_DIR = "models"

# 🔹 Device
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")


def load_and_prepare_data(filepath):
    df = pd.read_csv(filepath)
    FEATURES = [feature for feature in df.columns]
    df = df[FEATURES]
    return df, FEATURES


def normalize_data(df):
    scaler = MinMaxScaler()
    normalized = scaler.fit_transform(df.astype(float))
    return normalized, scaler


def create_sequences(data, seq_length):
    sequences, targets = [], []
    for i in range(len(data) - seq_length):
        sequences.append(data[i:i + seq_length])
        targets.append(data[i + seq_length, 0])  # Predict next "Price"
    return np.array(sequences), np.array(targets)


def prepare_tensors(X, y):
    X_tensor = torch.tensor(X, dtype=torch.float32).to(device)
    y_tensor = torch.tensor(y, dtype=torch.float32).unsqueeze(1).to(device)

    if torch.isnan(X_tensor).any() or torch.isnan(y_tensor).any():
        raise ValueError("ERROR: Training data contains NaN values!")

    return X_tensor, y_tensor


def train_model(model, X_train, y_train, criterion, optimizer, epochs, ticker):
    for epoch in range(epochs):
        model.train()
        optimizer.zero_grad()
        predictions = model(X_train)

        if torch.isnan(predictions).any():
            raise ValueError(f"ERROR: Model output contains NaN values for {ticker}!")

        loss = criterion(predictions, y_train)
        if torch.isnan(loss):
            raise ValueError(f"ERROR: Loss is NaN for {ticker}! Check dataset or reduce learning rate.")

        loss.backward()
        optimizer.step()
        print(f"[{ticker}] Epoch {epoch + 1}/{epochs}, Loss: {loss.item():.6f}")

    return model


def save_model(model, ticker, path_dir=MODEL_DIR):
    os.makedirs(path_dir, exist_ok=True)
    path = os.path.join(path_dir, f"model_{ticker}.pth")
    torch.save(model.state_dict(), path)
    print(f"✅ Model for {ticker} saved to {path}")


def train_for_ticker(ticker):
    print(f"\n🚀 Training model for: {ticker}")
    filepath = os.path.join(DATA_DIR, f"Data_{ticker}.csv")

    try:
        df, features = load_and_prepare_data(filepath)
        data, scaler = normalize_data(df)
        X_np, y_np = create_sequences(data, SEQ_LENGTH)
        X_tensor, y_tensor = prepare_tensors(X_np, y_np)
        X_train, _, y_train, _ = train_test_split(X_tensor, y_tensor, test_size=0.4, random_state=42, shuffle=True)

        model = CTTS(input_dim=len(features)).to(device)
        criterion = nn.MSELoss()
        optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

        trained_model = train_model(model, X_train, y_train, criterion, optimizer, EPOCHS, ticker)
        save_model(trained_model, ticker)

    except Exception as e:
        print(f"❌ Failed to train model for {ticker}: {e}")


def main():
    tickers = ["RELIANCE.NS", "ITC.NS", "INFY.NS"]  # Add your tickers here

    for ticker in tickers:
        train_for_ticker(ticker)


if __name__ == "__main__":
    main()
