'use client';

import React, { useEffect, useState } from 'react';
import { Trade, Signal } from '@/types';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { ScreenshotAnalyzer } from '@/components/ai/ScreenshotAnalyzer';
import { VerificationDashboard } from '@/components/ai/VerificationDashboard';
import { TradeAnalyzer } from '@/components/ai/TradeAnalyzer';

export default function AnalyticsPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [lastSignal, setLastSignal] = useState<Signal | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tradesRes = await fetch('/api/trades');
        const tradesData = await tradesRes.json();
        setTrades(tradesData.trades || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Advanced Analytics</h1>
            <p className="text-slate-400">Charts, AI analysis, and verification metrics</p>
          </div>

          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="screenshot">Screenshot Analysis</TabsTrigger>
              <TabsTrigger value="verification">Verification Metrics</TabsTrigger>
              <TabsTrigger value="trade-analysis">Trade Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6 mt-6">
              {trades.length > 0 && <PerformanceChart trades={trades} />}
            </TabsContent>

            <TabsContent value="screenshot" className="space-y-6 mt-6">
              <ScreenshotAnalyzer onSignalReceived={setLastSignal} />
              {lastSignal && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Latest Signal from Screenshot</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trend:</span>
                      <span className="text-white font-medium">{lastSignal.trend}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Confidence:</span>
                      <span className="text-white font-medium">{(lastSignal.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="verification" className="space-y-6 mt-6">
              <VerificationDashboard />
            </TabsContent>

            <TabsContent value="trade-analysis" className="space-y-6 mt-6">
              <TradeAnalyzer trades={trades} signals={signals} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
