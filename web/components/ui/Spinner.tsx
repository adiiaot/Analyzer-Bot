import React from 'react';
import { Loader } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Loader className={`${sizes[size]} animate-spin text-yellow-500`} />
    </div>
  );
};
