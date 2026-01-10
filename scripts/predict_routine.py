import sys
import json
import pandas as pd
import pickle
import os

# Set working directory to the project root (one level up from scripts/) 
# or assume the command is run from root.
# We'll try to find the model file.

MODEL_FILE = 'routine_model.pkl'

def load_model():
    if os.path.exists(MODEL_FILE):
        with open(MODEL_FILE, 'rb') as f:
            return pickle.load(f)
    # Check parent dir if running from scripts/
    if os.path.exists(os.path.join('..', MODEL_FILE)):
         with open(os.path.join('..', MODEL_FILE), 'rb') as f:
            return pickle.load(f)
    
    raise FileNotFoundError(f"Model file {MODEL_FILE} not found.")

def predict(data):
    try:
        model = load_model()
        
        # Ensure data is a DataFrame with expected columns
        # Features must match training data order and names
        expected_cols = [
            "temperature", "feels_like", "humidity", "wind_speed", 
            "precipitation", "uv_index", "AQI", "heat_index", 
            "time_of_day", "day_type", "commute_mode", "routine_sensitivity"
        ]
        
        # Create DataFrame
        df = pd.DataFrame([data])
        
        # Reorder/Ensure columns exist
        df = df[expected_cols]
        
        # Predict
        prediction = model.predict(df)[0]
        # Check if predict_proba exists
        if hasattr(model, "predict_proba"):
            probability = model.predict_proba(df)[0][1]
        else:
            probability = 0.0 # Fallback
            
        return {
            "prediction": int(prediction), 
            "probability": float(probability),
            "status": "success"
        }

    except Exception as e:
        return {"error": str(e), "status": "error"}

if __name__ == "__main__":
    # Read input from stdin
    try:
        input_str = sys.stdin.read()
        if not input_str:
            raise ValueError("No input data received")
            
        input_data = json.loads(input_str)
        result = predict(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e), "status": "error"}))
