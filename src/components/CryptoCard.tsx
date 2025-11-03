import { TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoData } from '../services/cryptoService';

interface CryptoCardProps {
  crypto: CryptoData;
  predictedPrice?: number;
  onViewChart: (cryptoId: string) => void;
}

const CryptoCard = ({ crypto, predictedPrice, onViewChart }: CryptoCardProps) => {
  const isPositiveChange = crypto.priceChangePercentage24h >= 0;
  const predictionDiff = predictedPrice ? ((predictedPrice - crypto.currentPrice) / crypto.currentPrice) * 100 : 0;
  const isPredictionPositive = predictionDiff >= 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{crypto.name}</h3>
          <p className="text-gray-400 text-sm">{crypto.symbol}</p>
        </div>
        <div className={`flex items-center ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
          {isPositiveChange ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">Current Price</p>
          <p className="text-3xl font-bold text-white">
            ${crypto.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-semibold ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
              {isPositiveChange ? '+' : ''}{crypto.priceChangePercentage24h.toFixed(2)}%
            </span>
            <span className="text-gray-500 text-sm ml-2">24h</span>
          </div>
        </div>

        {predictedPrice && (
          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-1">ML Predicted Price</p>
            <p className="text-2xl font-bold text-blue-400">
              ${predictedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-semibold ${isPredictionPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPredictionPositive ? '+' : ''}{predictionDiff.toFixed(2)}%
              </span>
              <span className="text-gray-500 text-sm ml-2">vs current</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onViewChart(crypto.id)}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        View Chart
      </button>
    </div>
  );
};

export default CryptoCard;
