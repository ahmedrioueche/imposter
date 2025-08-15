'use client';

import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  onReconnect?: () => void;
}

export default function ConnectionStatus({ isConnected, onReconnect }: ConnectionStatusProps) {
  if (isConnected) {
    return (
      <div className='flex items-center gap-2 text-green-600 dark:text-green-400 text-sm'>
        <Wifi size={16} />
        <span>Connected</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
      <WifiOff size={16} className='text-red-500' />
      <span className='text-red-600 dark:text-red-400 text-sm'>Connection lost</span>
      {onReconnect && (
        <button
          onClick={onReconnect}
          className='flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors'
        >
          <RefreshCw size={12} />
          Reconnect
        </button>
      )}
    </div>
  );
}
