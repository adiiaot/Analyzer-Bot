'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { LearningBot } from '@/components/ai/LearningBot';

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Learning Hub</h1>
            <p className="text-slate-400">Ask questions about forex, gold trading, and trading concepts</p>
          </div>

          <LearningBot />
        </main>
      </div>
    </div>
  );
}
