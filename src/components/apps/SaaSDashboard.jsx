import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

/**
 * SaaS Dashboard
 * Product metrics and analytics for AI products
 */
const SaaSDashboard = ({ windowId, windowData }) => {
  const [selectedProduct, setSelectedProduct] = useState('clipgen');

  const products = {
    clipgen: {
      name: 'Clipgen AI',
      icon: '🎬',
      status: 'Live',
      metrics: {
        users: '2.5K',
        revenue: '$12.5K',
        conversionRate: '3.2%',
        churn: '2.1%',
      },
      growth: '45%',
      description: 'AI-powered video clipping platform',
    },
    autoyt: {
      name: 'AutoYT',
      icon: '📹',
      status: 'Live',
      metrics: {
        users: '1.8K',
        revenue: '$8.2K',
        conversionRate: '2.8%',
        churn: '1.9%',
      },
      growth: '32%',
      description: 'Automated YouTube content generator',
    },
    fraud: {
      name: 'Fraud Detector',
      icon: '🛡️',
      status: 'Beta',
      metrics: {
        users: '500',
        revenue: '$2.1K',
        conversionRate: '5.2%',
        churn: '3.1%',
      },
      growth: '120%',
      description: 'AI fraud detection system',
    },
  };

  const currentProduct = products[selectedProduct];

  const dashboardMetrics = [
    { label: 'Total ARR', value: '$22.8K', change: '+18%', icon: '💰' },
    { label: 'Active Users', value: '4.8K', change: '+12%', icon: '👥' },
    { label: 'Avg. MRR', value: '$1,900', change: '+5%', icon: '📊' },
    { label: 'Customer Health', value: '92%', change: '+3%', icon: '💚' },
  ];

  const recentActivity = [
    { action: 'New signup', product: 'Clipgen AI', time: '2 hours ago' },
    { action: 'Payment received', product: 'AutoYT', amount: '$99', time: '4 hours ago' },
    { action: 'Feature released', product: 'Fraud Detector', time: '1 day ago' },
    { action: 'Bug fixed', product: 'Clipgen AI', time: '2 days ago' },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-800">
      {/* Header */}
      <div className="border-b border-white/10 p-6 bg-black/20 backdrop-blur">
        <h1 className="text-3xl font-bold text-white mb-1">SaaS Dashboard</h1>
        <p className="text-neutral-400">Product metrics and growth tracking</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Overview Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {dashboardMetrics.map((metric, idx) => (
            <motion.div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-primary-500/50 transition-all"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-2xl">{metric.icon}</span>
                <span className="text-xs text-green-400">{metric.change}</span>
              </div>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-xs text-neutral-400 mt-1">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Product Selector */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-3">
            Products
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(products).map(([key, product]) => (
              <motion.button
                key={key}
                onClick={() => setSelectedProduct(key)}
                className={`p-4 rounded-lg border transition-all text-left ${
                  selectedProduct === key
                    ? 'bg-primary-500/20 border-primary-500/50'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-2xl mb-2">{product.icon}</div>
                <div className="font-semibold text-white text-sm">{product.name}</div>
                <div className="text-xs text-neutral-400 mt-1">{product.status}</div>
                <div className="text-xs text-green-400 mt-1">↑ {product.growth}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <motion.div
          key={selectedProduct}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{currentProduct.name}</h2>
              <p className="text-sm text-neutral-400 mt-1">
                {currentProduct.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">
                {currentProduct.growth}
              </div>
              <div className="text-xs text-neutral-400">Growth</div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Users', value: currentProduct.metrics.users },
              { label: 'Revenue', value: currentProduct.metrics.revenue },
              { label: 'Conversion', value: currentProduct.metrics.conversionRate },
              { label: 'Churn', value: currentProduct.metrics.churn },
            ].map((metric, idx) => (
              <div key={idx} className="bg-black/30 rounded p-3">
                <div className="text-2xl font-bold text-primary-400">
                  {metric.value}
                </div>
                <div className="text-xs text-neutral-400 mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={idx}
                className="bg-white/5 border border-white/10 rounded p-3 flex justify-between items-center hover:border-primary-500/50 transition-all"
                whileHover={{ paddingLeft: '1.25rem' }}
              >
                <div>
                  <p className="font-medium text-white text-sm">{activity.action}</p>
                  <p className="text-xs text-neutral-400">{activity.product}</p>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="text-sm text-green-400 font-medium">
                      {activity.amount}
                    </p>
                  )}
                  <p className="text-xs text-neutral-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaaSDashboard;
