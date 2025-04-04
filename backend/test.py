import csv
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
from model import CTTS  # Import trained model

# 🔹 Load dataset
df = pd.read_csv("data/Data_RELAINCE.NS.csv")
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

# 🔹 Normalize data
scaler = MinMaxScaler()
data = scaler.fit_transform(df.astype(float))

# 🔹 Prepare sequences
def create_sequences(data, seq_length):
    sequences, targets = [], []
    for i in range(len(data) - seq_length):
        sequences.append(data[i:i+seq_length])
        targets.append(data[i+seq_length, 0])  # Predict next "Price"
    return np.array(sequences), np.array(targets)

SEQ_LENGTH = 300  # Same as training
X, y = create_sequences(data, SEQ_LENGTH)
X = torch.tensor(X, dtype=torch.float32)
y = torch.tensor(y, dtype=torch.float32).unsqueeze(1)

# 🔹 Load trained model
model = CTTS(input_dim=len(FEATURES))
model.load_state_dict(torch.load("models/model.pth"))
model.eval()

# 🔹 Make predictions
y_pred = model(X).detach().numpy()
y_test_np = y.numpy()

# 🔹 Calculate accuracy metrics
mse = mean_squared_error(y_test_np, y_pred)
r2 = r2_score(y_test_np, y_pred)
accuracy = (1 - mse) * 100  # Simple accuracy metric based on error reduction

# 🔹 Print results
print(f"Mean Squared Error (MSE): {mse:.6f}")
print(f"R-squared (R2) Score: {r2:.6f}")
print(f"Accuracy: {accuracy:.2f}%")

# 🔹 Show some predictions
print("\nSample Predictions:")
sample_size = min(5, len(y_pred))

for i in range(sample_size):
    # Create zero-filled arrays with correct shape (1, 10) to inverse transform only the first column
    dummy_array_actual = np.zeros((1, 10))
    dummy_array_pred = np.zeros((1, 10))
    
    # Assign actual and predicted price values to the first column
    dummy_array_actual[0, 0] = y_test_np[i][0]
    dummy_array_pred[0, 0] = y_pred[i][0]
    
    # Apply inverse transformation and extract the first column
    actual = scaler.inverse_transform(dummy_array_actual)[0][0]
    predicted = scaler.inverse_transform(dummy_array_pred)[0][0]
    
    print(f"Actual: {actual:.2f} | Predicted: {predicted:.2f}")