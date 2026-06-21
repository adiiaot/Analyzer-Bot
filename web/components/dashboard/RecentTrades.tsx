'use client';

import React from 'react';
import { Trade } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatTimeAgo } from '@/lib/formatters';

interface RecentTradesProps {
  trades: Trade[];
}

export const RecentTrades = ({ trades }: RecentTradesProps) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mt-6">
      <h2 className="text-white font-bold text-lg mb-4">Recent Trades</h2>
      <div className="space-y-3">
        {trades.slice(0, 5).map(trade => (
          <div
            key={trade.id}
            className="flex items-center justify-between bg-slate-700 rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              {trade.pnl >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="text-white text-sm font-medium">
                  ${trade.entry_price} → ${trade.exit_price}
                </p>
                <p className="text-slate-400 text-xs">{formatTimeAgo(trade.timestamp)}</p>
              </div>
            </div>
            <span className={`font-semibold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${trade.pnl.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
