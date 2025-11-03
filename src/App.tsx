import { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import CryptoCard from './components/CryptoCard';
import PriceChart from './components/PriceChart';
import { fetchCryptoData, getPredictions, CryptoData, PredictionResponse } from './services/cryptoService';

function App() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setError(null);
      setRefreshing(true);

      const data = await fetchCryptoData();
      setCryptoData(data);

      try {
        const predictionData = await getPredictions(data);
        setPredictions(predictionData);
      } catch (predError) {
        console.error('Prediction error:', predError);
        setError('Unable to fetch predictions. Displaying live prices only.');
      }

      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cryptocurrency data. Please try again.');
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  const selectedCryptoData = selectedCrypto
    ? cryptoData.find(c => c.id === selectedCrypto)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-blue-500" size={40} />
              <h1 className="text-4xl font-bold text-white">Crypto Price Predictor</h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              <RefreshCw className={refreshing ? 'animate-spin' : ''} size={20} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              Real-time cryptocurrency prices with ML-powered predictions
            </p>
            {lastUpdated && (
              <p className="text-gray-500 text-sm">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-yellow-900 border border-yellow-700 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="text-yellow-400 flex-shrink-0" size={24} />
            <p className="text-yellow-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading cryptocurrency data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cryptoData.map((crypto) => (
              <CryptoCard
                key={crypto.id}
                crypto={crypto}
                predictedPrice={predictions?.predictions[crypto.id]}
                onViewChart={setSelectedCrypto}
              />
            ))}
          </div>
        )}

        {selectedCrypto && selectedCryptoData && (
          <PriceChart
            cryptoId={selectedCrypto}
            cryptoName={selectedCryptoData.name}
            onClose={() => setSelectedCrypto(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
