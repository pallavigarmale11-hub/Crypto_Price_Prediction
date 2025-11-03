from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

try:
    with open('crypto_forecast_models.pkl', 'rb') as f:
        models = pickle.load(f)
except FileNotFoundError:
    models = {}
    print("Warning: crypto_forecast_models.pkl not found. Using mock predictions.")

@app.route('/predict_auto', methods=['POST'])
def predict_auto():
    try:
        data = request.get_json()

        predictions = {}

        for crypto_id, current_price in data.items():
            if crypto_id in models:
                model = models[crypto_id]
                features = np.array([[current_price]])
                predicted_price = model.predict(features)[0]
                predictions[crypto_id] = float(predicted_price)
            else:
                prediction_factor = np.random.uniform(0.98, 1.02)
                predictions[crypto_id] = float(current_price * prediction_factor)

        return jsonify({'predictions': predictions})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
