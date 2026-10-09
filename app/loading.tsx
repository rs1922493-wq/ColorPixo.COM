import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center space-y-4 px-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-950 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" />
      </div>
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 animate-pulse">
        Loading ColorPixo Studio...
      </p>
    </div>
  );
}
