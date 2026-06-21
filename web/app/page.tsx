'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <TrendingUp className="w-16 h-16 text-yellow-500 mx-auto" />
        <h1 className="text-4xl font-bold text-white">Analyzer Bot</h1>
        <p className="text-slate-400">XAU/USD Trading Dashboard</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold px-8 py-3 rounded-lg transition"
        >
          Enter Dashboard
        </button>
      </div>
    </main>
  );
}
