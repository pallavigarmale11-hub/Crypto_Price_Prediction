import axios from 'axios';

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
}

export interface HistoricalData {
  prices: [number, number][];
}

export interface PredictionResponse {
  predictions: {
    [key: string]: number;
  };
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CRYPTO_IDS = ['bitcoin', 'ethereum', 'litecoin', 'tether'];

export const fetchCryptoData = async (): Promise<CryptoData[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: CRYPTO_IDS.join(','),
        order: 'market_cap_desc',
        per_page: 4,
        page: 1,
        sparkline: false
      }
    });

    return response.data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      currentPrice: coin.current_price,
      priceChange24h: coin.price_change_24h,
      priceChangePercentage24h: coin.price_change_percentage_24h
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

export const fetchHistoricalData = async (coinId: string): Promise<HistoricalData> => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: '365',
        interval: 'daily'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    throw error;
  }
};

export const getPredictions = async (cryptoData: CryptoData[]): Promise<PredictionResponse> => {
  try {
    const payload = cryptoData.reduce((acc, coin) => {
      acc[coin.id] = coin.currentPrice;
      return acc;
    }, {} as { [key: string]: number });

    const response = await axios.post('http://localhost:5000/predict_auto', payload);
    return response.data;
  } catch (error) {
    console.error('Error getting predictions:', error);
    throw error;
  }
};
