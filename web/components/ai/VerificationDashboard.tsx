'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface VerificationData {
  date: string;
  score: number;
  mode: 'api_only' | 'api_with_screenshot';
  confidence: number;
  successful: boolean;
}

export const VerificationDashboard = () => {
  const [data, setData] = useState<VerificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avgScore, setAvgScore] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    fetchVerificationData();
  }, []);

  const fetchVerificationData = async () => {
    try {
      const response = await fetch('/api/verification-history');
      const result = await response.json();

      setData(result.data || []);
      setAvgScore(result.avgScore || 0);
      setSuccessRate(result.successRate || 0);
    } catch (error) {
      console.error('Error fetching verification data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <p className="text-slate-400 text-sm">Avg Verification Score</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{avgScore.toFixed(0)}/100</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <p className="text-slate-400 text-sm">Screenshot Usage</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {data.filter(d => d.mode === 'api_with_screenshot').length}/{data.length}
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-yellow-500" />
            <p className="text-slate-400 text-sm">Success Rate</p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{(successRate * 100).toFixed(0)}%</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-white font-bold text-lg mb-4">Verification Score Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
            <Legend />
            <Bar dataKey="score" fill="#eab308" name="Verification Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-white font-bold text-lg mb-4">Signal Mode Distribution</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700 rounded p-4">
            <p className="text-slate-400 text-sm">API-Only Mode</p>
            <p className="text-2xl font-bold text-blue-400">
              {data.filter(d => d.mode === 'api_only').length}
            </p>
          </div>
          <div className="bg-slate-700 rounded p-4">
            <p className="text-slate-400 text-sm">API + Screenshot</p>
            <p className="text-2xl font-bold text-green-400">
              {data.filter(d => d.mode === 'api_with_screenshot').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
