# Local Setup & Run Guide

## Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- pip (Python package manager)
- Git (optional, for version control)

## Project Structure
```
project/
├── src/                          # React frontend
│   ├── components/
│   │   ├── CryptoCard.tsx       # Individual crypto display cards
│   │   └── PriceChart.tsx       # Yearly price chart modal
│   ├── services/
│   │   └── cryptoService.ts     # CoinGecko API integration
│   ├── App.tsx                  # Main dashboard
│   └── main.tsx
├── flask_backend/               # Python Flask backend
│   ├── app.py                   # ML prediction endpoint
│   ├── requirements.txt         # Python dependencies
│   └── crypto_forecast_models.pkl  # ML models (optional)
└── package.json
```

## Setup Steps

### 1. Clone or Download the Project
```bash
# Navigate to the project directory
cd project
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd flask_backend
pip install -r requirements.txt
cd ..
```

## Running the Application

### Terminal 1: Start Flask Backend
```bash
cd flask_backend
python app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

The backend will be running at `http://localhost:5000`

### Terminal 2: Start React Frontend (Dev Server)
```bash
npm run dev
```

Expected output:
```
VITE v5.4.8  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Access the Dashboard
Open your browser and go to: `http://localhost:5173`

## Using the Dashboard

1. **View Live Prices**: The dashboard displays Bitcoin, Ethereum, Litecoin, and Tether prices from CoinGecko
2. **Check Predictions**: ML-powered price predictions appear below current prices
3. **Auto-Refresh**: Data refreshes automatically every 60 seconds
4. **Manual Refresh**: Click the "Refresh" button to fetch data immediately
5. **View Charts**: Click "View Chart" on any crypto card to see yearly price history with monthly timestamps
6. **Price History**: Charts show aggregated monthly prices for the past 12 months

## API Information

### CoinGecko API
- No API key required
- Free tier: 10 calls/second
- Used for: Live prices, historical data

### Flask Backend Endpoints
- `POST /predict_auto` - Receives current prices, returns ML predictions
- `GET /health` - Health check

## Troubleshooting

### Frontend won't start
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.8+

# Try python3 instead
python3 app.py

# Or reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Port already in use
- Flask uses port 5000
- Vite uses port 5173
- If ports are busy, kill existing processes:
```bash
# macOS/Linux: Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# macOS/Linux: Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Windows: Use Task Manager or:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ML predictions not working
- If `crypto_forecast_models.pkl` is missing, the backend will generate mock predictions
- To use actual ML models, place `crypto_forecast_models.pkl` in the `flask_backend/` directory
- Current predictions will use random variations (±2%) of current prices

### API rate limiting
- CoinGecko free tier allows 10 calls/second
- Dashboard refreshes every 60 seconds and should not hit limits
- If you get 429 errors, wait a few minutes before retrying

## Building for Production

### Build Frontend
```bash
npm run build
```

Output will be in the `dist/` folder

### Run Production Build
```bash
npm run preview
```

## Environment Variables

No environment variables required for local development. The app uses:
- CoinGecko API (public, no key needed)
- Flask backend on localhost:5000

## Stopping the Application

### Frontend
Press `Ctrl+C` in the Vite terminal

### Backend
Press `Ctrl+C` in the Flask terminal
