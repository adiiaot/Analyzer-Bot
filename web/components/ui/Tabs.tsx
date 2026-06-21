'use client';

import React, { useState } from 'react';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType>({
  activeTab: '',
  setActiveTab: () => {},
});

export const Tabs = ({ defaultValue, children, className = '' }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex ${className}`}>{children}</div>
);

export const TabsTrigger = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex-1 px-4 py-2 text-sm font-medium transition ${
        activeTab === value
          ? 'bg-yellow-500 text-slate-900'
          : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const { activeTab } = React.useContext(TabsContext);
  if (activeTab !== value) return null;
  return <>{children}</>;
};
