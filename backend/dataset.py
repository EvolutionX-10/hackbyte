import numpy as np
import pandas as pd
import yfinance as yf
import pandas_ta as ta

def download_stock_data(ticker, period='1mo', interval='1m'):
    """
    Download historical stock data using yfinance.
    """
    print("Downloading data for " + ticker)
    df = yf.download(ticker, period=period, interval=interval)
    df.dropna(inplace=True)
    df = df.reset_index()  # Move datetime index to a column
    df['atetime'] = pd.to_datetime(df['Datetime'])  # Ensure it's properly formatted
    return df

def compute_technical_indicators(df):
    """
    Compute technical indicators using pandas-ta and add them as columns.
    """
    df = df.copy()
    
    # Ensure the DataFrame has a flat index
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    
    # Calculate various technical indicators using pandas-ta
    df.ta.sma(length=10, append=True)  # Simple Moving Average
    df.ta.ema(length=10, append=True)  # Exponential Moving Average
    df.ta.roc(length=10, append=True)  # Rate of Change
    df.ta.rsi(length=14, append=True)  # Relative Strength Index
    df.ta.macd(append=True)  # MACD
    
    # Fill missing values
    df.fillna(method='bfill', inplace=True)
    return df

def main():
    # Get user input for 3 tickers
    tickers = ["RELIANCE.NS", "INFY.NS", "ITC.NS"]
    
    # Process each ticker separately and save individual files
    for ticker in tickers:
        # Download and compute indicators
        df = download_stock_data(ticker, period='max', interval='1m')
        df = compute_technical_indicators(df)
        
        # Save individual file
        df.to_csv(f"Data/Data_{ticker}.csv", index=False)
        print(f"Saved data for {ticker}")

if __name__ == '__main__':
    main()