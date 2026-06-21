'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Menu } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-yellow-500" />
          <span className="font-bold text-lg">Analyzer Bot</span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/dashboard" className="hover:text-yellow-400 transition">Dashboard</Link>
          <Link href="/dashboard/trades" className="hover:text-yellow-400 transition">Trades</Link>
          <Link href="/dashboard/analytics" className="hover:text-yellow-400 transition">Analytics</Link>
          <Link href="/dashboard/learning" className="hover:text-yellow-400 transition">Learning</Link>
        </nav>

        <button className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
