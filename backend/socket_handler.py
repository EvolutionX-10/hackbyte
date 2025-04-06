import websocket
import threading
import json
from try_run import simulate_trading_with_gemini 

latest_stock_data = {}


def on_message(ws, message):
    global latest_stock_data
    data = json.loads(message)
    latest_stock_data = data
    print("\nReceived:", data)

    # Use your prediction algorithm
    balance, profit, trade_log = simulate_trading_with_gemini(data)
    decision = "BUY" if ("buy" or "BUY") in trade_log else "HOLD"
    decision = "SELL" if ("sell" or "SELL") in trade_log else "HOLD"
    log_message = {
        "type": "log",
        "content": {
            "Datetime": data.get("Datetime"),
            "Final Balance": balance,
            "Total Profit": profit,
            "Trade Log": trade_log,
            "Decision": decision
        }
    }

    try:
        ws.send(json.dumps(log_message))
        print("Sent log back to server:", log_message)
    except Exception as e:
        print("Error sending log:", e)


def on_error(ws, error):
    print("WebSocket Error:", error)

def on_close(ws, close_status_code, close_msg):
    print("WebSocket Closed")

def on_open(ws):
    print("WebSocket Connection Opened")

def start_socket_client():
    ws = websocket.WebSocketApp(
        "ws://localhost:3000/api/ws",
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )
    ws.run_forever()

def run_client():
    thread = threading.Thread(target=start_socket_client)
    thread.daemon = True
    thread.start()