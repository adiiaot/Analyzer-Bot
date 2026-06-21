'use client';

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Trade } from '@/types';

interface PerformanceChartProps {
  trades: Trade[];
}

export const PerformanceChart = ({ trades }: PerformanceChartProps) => {
  const chartData = trades
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .reduce((acc, trade, idx) => {
      const prevPnL = idx > 0 ? acc[idx - 1].cumulative : 0;
      return [
        ...acc,
        {
          name: `Trade ${idx + 1}`,
          pnl: trade.pnl,
          cumulative: parseFloat((prevPnL + trade.pnl).toFixed(2)),
          timestamp: new Date(trade.timestamp).toLocaleDateString(),
        },
      ];
    }, [] as any[]);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mt-6">
      <h2 className="text-white font-bold text-lg mb-4">Performance Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'P&L']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#eab308"
            strokeWidth={2}
            dot={{ fill: '#eab308', r: 4 }}
            activeDot={{ r: 6 }}
            name="Cumulative P&L"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
