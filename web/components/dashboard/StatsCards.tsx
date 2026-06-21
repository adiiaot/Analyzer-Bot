'use client';

import React from 'react';
import { TradingStats } from '@/types';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

interface StatsCardsProps {
  stats: TradingStats;
  currentCapital: number;
}

export const StatsCards = ({ stats, currentCapital }: StatsCardsProps) => {
  const cards = [
    {
      title: 'Total P&L',
      value: `$${stats.total_pnl.toFixed(2)}`,
      icon: DollarSign,
      color: stats.total_pnl >= 0 ? 'text-green-500' : 'text-red-500',
    },
    {
      title: 'Win Rate',
      value: `${(stats.win_rate * 100).toFixed(1)}%`,
      icon: Target,
      color: stats.win_rate >= 0.5 ? 'text-green-500' : 'text-red-500',
      subtitle: `${stats.wins}W / ${stats.losses}L`,
    },
    {
      title: 'Profit Factor',
      value: `${stats.profit_factor.toFixed(2)}x`,
      icon: TrendingUp,
      color: stats.profit_factor >= 1.5 ? 'text-green-500' : 'text-yellow-500',
    },
    {
      title: 'Current Capital',
      value: `$${currentCapital.toFixed(2)}`,
      icon: TrendingDown,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                <p className={`text-2xl font-bold mt-2 ${card.color}`}>{card.value}</p>
                {card.subtitle && (
                  <p className="text-slate-400 text-xs mt-1">{card.subtitle}</p>
                )}
              </div>
              <Icon className={`w-8 h-8 ${card.color} opacity-50`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
