import os
import torch
import numpy as np
from model import CTTS 
from sklearn.preprocessing import MinMaxScaler
import warnings
import pandas as pd
import time
warnings.filterwarnings("ignore")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_and_prepare_data(filepath):
    df = pd.read_csv(filepath)
    df.drop(columns=['Date'], inplace=True)
    FEATURES = df.columns.tolist()
    df = df[FEATURES]
    return df, FEATURES

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

        # print(f"\n Future Predictions ({ticker}):")
        # for i, value in enumerate(future_actuals, 1):
        #     print(f"Step {i}: {value:.2f}")

        return future_actuals

    except Exception as e:
        print(f" Future prediction failed for {ticker}: {e}")
        return None


import google.generativeai as genai

# Setup Gemini
genai.configure(api_key="AIzaSyC8TrtizS97mIfgFasT0UQV2OkqROIgX8A")

model = genai.GenerativeModel("gemini-2.0-flash")

def get_reason_from_gemini(stock, action, current_price, predicted_future, history):
    prompt = f"""
You are an expert trading bot. Analyze the following stock data and explain why taking the action '{action}' on {stock} is a good move.

Current price: {current_price}
Recent actual prices: {history[-5:]}
Predicted future prices: {predicted_future}

Try to include patterns, trends, or candlestick behavior (if visible), and keep it to one sentence.
"""
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return "No reason generated (API error)."

def simulate_trading_with_gemini(stock_data, initial_balance=10000, lookahead=5, threshold=0.02):
    balance = initial_balance
    positions = {}
    trade_log = []

    n_days = len(next(iter(stock_data.values()))[0])

    for day in range(n_days - 1):
        for stock, (actual, predicted) in stock_data.items():
            current_price = actual[day]
            past_data = actual[:day+1]
            future_prices = predicted[day + 1: day + 1 + lookahead]
            avg_future = sum(future_prices) / len(future_prices) if future_prices else current_price

            position = positions.get(stock)
            action = None

            if position is None:
                if avg_future > current_price * (1 + threshold):
                    shares = int(balance // current_price)
                    if shares > 0:
                        balance -= shares * current_price
                        positions[stock] = {"type": "long", "shares": shares, "entry_price": current_price}
                        action = "BUY"
                elif avg_future < current_price * (1 - threshold):
                    shares = int(balance // current_price)
                    if shares > 0:
                        balance += shares * current_price
                        positions[stock] = {"type": "short", "shares": shares, "entry_price": current_price}
                        action = "SHORT"
            elif position["type"] == "long":
                if avg_future < current_price:
                    balance += position["shares"] * current_price
                    positions.pop(stock)
                    action = "SELL"
                else:
                    action = "HOLD"
            elif position["type"] == "short":
                if avg_future > current_price:
                    profit = position["shares"] * (position["entry_price"] - current_price)
                    balance += profit
                    positions.pop(stock)
                    action = "COVER"
                else:
                    action = "HOLD"

            # Log if action taken or holding a position
            if action and (position or action in ["BUY", "SHORT"]):
                reason = get_reason_from_gemini(stock, action, current_price, future_prices, past_data)
                trade_log.append((day, stock, action, current_price, balance, reason))
                time.sleep(3)

    # Final day liquidation
    for stock, pos in positions.items():
        final_price = stock_data[stock][0][-1]
        if pos["type"] == "long":
            balance += pos["shares"] * final_price
            trade_log.append((n_days - 1, stock, "FINAL SELL", final_price, balance, "Final liquidation of long position."))
        elif pos["type"] == "short":
            profit = pos["shares"] * (pos["entry_price"] - final_price)
            balance += profit
            trade_log.append((n_days - 1, stock, "FINAL COVER", final_price, balance, "Final liquidation of short position."))

    profit = balance - initial_balance
    return balance, profit, trade_log




def simulate_dynamic_portfolio_trading(stock_data, initial_balance=10000, lookahead=5, threshold=0.02):
    """
    Simulates trading multiple stocks to maximize profit with logged decisions:
    BUY, SELL, SHORT, COVER, and HOLD (only when holding a position).

    Parameters:
    - stock_data: dict {stock_name: (actual_prices[], predicted_prices[])}
    - initial_balance: starting cash
    - lookahead: days to look ahead
    - threshold: percentage change to act

    Returns:
    - final_balance, total_profit, trade_log
    """
    balance = initial_balance
    positions = {}  # {stock: {"type": "long"/"short", "shares": int, "entry_price": float}}
    trade_log = []

    n_days = len(next(iter(stock_data.values()))[0])

    for day in range(n_days - 1):
        for stock, (actual, predicted) in stock_data.items():
            current_price = actual[day]
            future_prices = predicted[day + 1: day + 1 + lookahead]
            avg_future = sum(future_prices) / len(future_prices) if future_prices else current_price

            position = positions.get(stock)
            action = None

            if position is None:
                if avg_future > current_price * (1 + threshold):
                    shares = int(balance // current_price)
                    if shares > 0:
                        balance -= shares * current_price
                        positions[stock] = {"type": "long", "shares": shares, "entry_price": current_price}
                        action = "BUY"
                elif avg_future < current_price * (1 - threshold):
                    shares = int(balance // current_price)
                    if shares > 0:
                        balance += shares * current_price
                        positions[stock] = {"type": "short", "shares": shares, "entry_price": current_price}
                        action = "SHORT"
            elif position["type"] == "long":
                if avg_future < current_price:
                    balance += position["shares"] * current_price
                    action = "SELL"
                    positions.pop(stock)
                else:
                    action = "HOLD"
            elif position["type"] == "short":
                if avg_future > current_price:
                    profit = position["shares"] * (position["entry_price"] - current_price)
                    balance += profit
                    action = "COVER"
                    positions.pop(stock)
                else:
                    action = "HOLD"

            # Log only if action was taken or holding a position
            if action:
                trade_log.append((day, stock, action, current_price, balance))

    # Final day liquidation
    for stock, pos in positions.items():
        final_price = stock_data[stock][0][-1]
        if pos["type"] == "long":
            balance += pos["shares"] * final_price
            trade_log.append((n_days - 1, stock, "FINAL SELL", final_price, balance))
        elif pos["type"] == "short":
            profit = pos["shares"] * (pos["entry_price"] - final_price)
            balance += profit
            trade_log.append((n_days - 1, stock, "FINAL COVER", final_price, balance))

    profit = balance - initial_balance
    return balance, profit, trade_log



if __name__ == "__main__":
    
    tickers = ["RELIANCE.NS", "INFY.NS", "ITC.NS"]
    stock_data = {}
    for ticker in tickers:
        data = pd.read_csv("data/Data_" + ticker + ".csv")
        data.drop(columns=['Date'], inplace=True)
        pred = predict_price(ticker=ticker, steps_ahead=50, seq_length=100).tolist()
        data = data['Close'].values.tolist()[::50]
        
        stock_data[ticker] = (data, pred)


    final_balance, profit, log = simulate_trading_with_gemini(stock_data, lookahead=10, threshold=0.015)

    print(f"Final Balance: {final_balance:.2f}")
    print(f"Total Profit: {profit:.2f}")
    print("Trade Log:")
    for entry in log:
        print(entry)
