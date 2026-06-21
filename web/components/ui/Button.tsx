import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const base = 'font-semibold rounded transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-yellow-500 hover:bg-yellow-600 text-slate-900',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-300',
    ghost: 'hover:bg-slate-700 text-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
