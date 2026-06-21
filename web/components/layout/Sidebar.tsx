'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3, TrendingUp, FileText, Brain, Settings, LogOut,
} from 'lucide-react';

const navigationItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
  { icon: TrendingUp, label: 'Trades', href: '/dashboard/trades' },
  { icon: FileText, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Brain, label: 'Learning', href: '/dashboard/learning' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 h-screen sticky top-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-white font-bold text-lg">AOT Trader</h1>
        <p className="text-slate-400 text-xs mt-1">XAU/USD Scalper</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-yellow-500 text-slate-900 font-semibold'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-lg transition">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
