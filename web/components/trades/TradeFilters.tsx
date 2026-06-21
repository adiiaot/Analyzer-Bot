'use client';

import React, { useState } from 'react';

interface TradeFiltersProps {
  onFilterChange: (filters: { result?: string; dateFrom?: string; dateTo?: string }) => void;
}

export const TradeFilters = ({ onFilterChange }: TradeFiltersProps) => {
  const [result, setResult] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleFilter = () => {
    onFilterChange({
      result: result || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
  };

  const handleClear = () => {
    setResult('');
    setDateFrom('');
    setDateTo('');
    onFilterChange({});
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Result</label>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-white text-sm"
          >
            <option value="">All</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
          </select>
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-white text-sm"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-white text-sm"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-4 py-1.5 rounded text-sm font-semibold"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="text-slate-400 hover:text-slate-200 px-4 py-1.5 text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
