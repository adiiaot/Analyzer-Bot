'use client';

import React, { useState } from 'react';
import { Trade, Signal } from '@/types';
import { Loader } from 'lucide-react';

interface TradeAnalyzerProps {
  trades: Trade[];
  signals: Signal[];
}

export const TradeAnalyzer = ({ trades, signals }: TradeAnalyzerProps) => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedTrade) return;

    setIsLoading(true);
    try {
      const signal = signals.find(s => s.id === selectedTrade.signal_id);

      const response = await fetch('/api/analyze-trade-nvidia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade: selectedTrade, signal }),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing trade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-white font-bold text-lg">Trade Analysis (Nvidia AI)</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-slate-300 text-sm font-medium">Select Trade to Analyze</label>
          <select
            value={selectedTrade?.id || ''}
            onChange={(e) => setSelectedTrade(trades.find(t => t.id === e.target.value) || null)}
            className="w-full mt-2 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          >
            <option value="">Choose a trade...</option>
            {trades.map(trade => (
              <option key={trade.id} value={trade.id}>
                Trade {trade.id.slice(-6)} - ${trade.entry_price} → ${trade.exit_price}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!selectedTrade || isLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-slate-900 font-semibold py-2 rounded transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Trade'
          )}
        </button>

        {analysis && (
          <div className="bg-slate-700 border border-slate-600 rounded p-4 text-slate-300 text-sm whitespace-pre-wrap">
            {analysis}
          </div>
        )}
      </div>
    </div>
  );
};
