import numpy as np
import pandas as pd
import yfinance as yf

def download_stock_data(ticker, period='1mo', interval='1m'):
    """
    Download historical stock data using yfinance.
    (Note: yfinance 1-minute data might be limited to recent periods.)
    """
    df = yf.download(ticker, period=period, interval=interval)
    df.dropna(inplace=True)
    return df

def compute_technical_indicators(df):
    """
    Compute simple technical indicators and add as columns:
    - Simple Moving Average (SMA)
    - Exponential Moving Average (EMA)
    - Rate of Change (ROC)
    - Relative Strength Index (RSI)
    """
    df = df.copy()
    # SMA
    df['SMA_10'] = df['Close'].rolling(window=10).mean()
    # EMA
    df['EMA_10'] = df['Close'].ewm(span=10, adjust=False).mean()
    # ROC
    df['ROC'] = df['Close'].pct_change(periods=10)
    # RSI (using a simple implementation)
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / (loss + 1e-8)
    df['RSI'] = 100 - (100 / (1 + rs))
    
    # Fill missing values
    df.fillna(method='bfill', inplace=True)
    return df

def main():
    ticker = "AAPL"
    df = download_stock_data(ticker, period='7d', interval='1m')
    df = compute_technical_indicators(df)
    print(df.head())
    #Saving the file in .csv format
    df.to_csv(f"data/Data_{ticker}.csv")
    

if __name__ == '__main__':
    main()