import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Stocks App - System Stocks Application
 */
const StocksApp = () => {
  const [stocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.5, change: 2.4, percent: 1.28 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.2, change: -1.5, percent: -1.06 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 374.8, change: 3.2, percent: 0.86 },
  ]);

  return (
    <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-green-500" />
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Stocks</h1>
        </div>
      </div>

      {/* Stocks List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="bg-white dark:bg-neutral-800 p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{stock.symbol}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-neutral-900 dark:text-white">${stock.price}</div>
                  <div
                    className={`flex items-center justify-end gap-1 text-sm ${
                      stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.percent).toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StocksApp;
