'use client';

import React, { useEffect, useState } from 'react';
import { Trade, TradingStats, Signal } from '@/types';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { TradeTable } from '@/components/trades/TradeTable';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<TradingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tradesRes, statsRes] = await Promise.all([
          fetch('/api/trades?limit=100'),
          fetch('/api/stats'),
        ]);

        const tradesData = await tradesRes.json();
        const statsData = await statsRes.json();

        setTrades(tradesData.trades || []);
        setStats(statsData.stats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <Spinner />;

  const currentCapital = 10 + (stats?.total_pnl || 0);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400">Real-time trading metrics & performance</p>
          </div>

          {stats && <StatsCards stats={stats} currentCapital={currentCapital} />}
          {trades.length > 0 && <PerformanceChart trades={trades} />}
          {trades.length > 0 && <TradeTable trades={trades.slice(0, 10)} />}
        </main>
      </div>
    </div>
  );
}
