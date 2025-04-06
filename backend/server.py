from flask import Flask
from flask_socketio import SocketIO, emit
from socket_handler import start_socket_client
from try_run import predict_price, simulate_trading_with_gemini 
from flask import Flask, jsonify
import json
import threading
import pandas as pd
# from try_run import predict_price, simulate_trading_with_gemini  # Import your core logic

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for testing

latest_stock_data = {}
@app.route("/predict", methods=["GET"])
def serve_prediction():
    global latest_stock_data

    try:
        ticker = latest_stock_data.get("ticker", "RELIANCE.NS")
        steps = latest_stock_data.get("steps", 50)

        pred = predict_price(ticker=ticker, steps_ahead=steps, seq_length=100)
        data = pd.read_csv(f"data/Data_{ticker}.csv")
        data.drop(columns=['Date'], inplace=True)
        actual = data['Close'].values.tolist()[::steps]

        stock_data = {ticker: (actual, pred.tolist())}
        final_balance, profit, log = simulate_trading_with_gemini(stock_data)

        return jsonify({
            "Final Balance": final_balance,
            "Total Profit": profit,
            "Trade Log": log
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Run WebSocket in a separate thread
    socket_thread = threading.Thread(target=start_socket_client)
    socket_thread.start()

    # Start Flask API
    app.run(port=5000)