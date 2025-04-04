import csv
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from model import CTTS  # Import model

# 🛠 Hyperparameters
SEQ_LENGTH = 300  # Predict based on last 5 hours of minute data
BATCH_SIZE = 32
EPOCHS = 15
LEARNING_RATE = 0.0005

# 🔹 Load dataset
df = pd.read_csv("data/Data_RELAINCE.NS.csv")

# 🔹 Drop the non-numeric column: "Datetime"
df.drop(columns=["Datetime"], inplace=True)

# 🔹 Ensure correct feature order
FEATURES = ["Price", "Close", "High", "Low", "Open", "Volume", "SMA_10", "EMA_10", "ROC", "RSI"]
df = df[FEATURES]

# Preprocess dataframe
data = []
prev_rsi = None
with open('data/Data_RELAINCE.NS.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    headers = next(reader)  # Read header

    for row in reader:
        rsi_value = row[9].strip()

        # Handle NaN or empty RSI values
        if rsi_value == '' or rsi_value.lower() == 'nan':
            row[9] = prev_rsi if prev_rsi is not None else '0.0'
        else:
            prev_rsi = row[9]

        data.append(row[9])

# Ensure the length of data matches the number of rows in the DataFrame
if len(data) < len(df):
    data.extend([prev_rsi] * (len(df) - len(data)))

last_col = df.columns[-1]
df.loc[df[last_col].isna(), last_col] = data[:len(df)]

if df.isnull().values.any():
    raise ValueError("ERROR: Data contains NaN values after filling. Check CSV!")

# 🔹 Normalize numeric data
scaler = MinMaxScaler()
data = scaler.fit_transform(df.astype(float))  # ✅ Ensures all values are numeric

# 🔹 Prepare sequences for time series prediction
def create_sequences(data, seq_length):
    sequences, targets = [], []
    for i in range(len(data) - seq_length):
        sequences.append(data[i:i+seq_length])
        targets.append(data[i+seq_length, 0])  # Predict next "Price"
    return np.array(sequences), np.array(targets)

X, y = create_sequences(data, SEQ_LENGTH)

# 🔹 Convert to PyTorch tensors
X = torch.tensor(X, dtype=torch.float32)
y = torch.tensor(y, dtype=torch.float32).unsqueeze(1)  # Add target dimension

# 🔹 Check for NaN values in tensors
if torch.isnan(X).any() or torch.isnan(y).any():
    raise ValueError("ERROR: Training data contains NaN values!")

# 🔹 Train/Test split (70-30)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, shuffle=True)

# 🔹 Initialize Model
model = CTTS(input_dim=len(FEATURES))
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# 🔹 Training loop
for epoch in range(EPOCHS):
    optimizer.zero_grad()
    predictions = model(X_train)
    
    # 🔹 Check for NaN in predictions before computing loss
    if torch.isnan(predictions).any():
        raise ValueError("ERROR: Model output contains NaN values!")

    loss = criterion(predictions, y_train)

    # 🔹 Ensure loss is not NaN
    if torch.isnan(loss):
        raise ValueError("ERROR: Loss is NaN! Check dataset or reduce learning rate.")

    loss.backward()
    optimizer.step()
    print(f"Epoch {epoch}, Loss: {loss.item()}")

# 🔹 Save trained model
torch.save(model.state_dict(), "models/model.pth")
print("Model trained and saved!")