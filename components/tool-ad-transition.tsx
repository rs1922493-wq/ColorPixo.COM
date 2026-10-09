'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ToolAdTransitionContextType {
  launchTool: (path: string, name?: string, description?: string) => void;
  isAdTransitionActive: boolean;
}

const ToolAdTransitionContext = createContext<ToolAdTransitionContextType>({
  launchTool: () => {},
  isAdTransitionActive: false,
});

export const useToolAdTransition = () => useContext(ToolAdTransitionContext);

/**
 * ToolAdTransitionProvider:
 * Direct tool navigation without artificial delays or interstitials.
 * Compliant with Google AdSense quality guidelines.
 *
 * Click Tool -> Open Tool Directly.
 */
export function ToolAdTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Instant direct navigation without delay
  const launchTool = useCallback(
    (path: string) => {
      if (path) {
        router.push(path);
      }
    },
    [router]
  );

  return (
    <ToolAdTransitionContext.Provider
      value={{
        launchTool,
        isAdTransitionActive: false,
      }}
    >
      {children}
    </ToolAdTransitionContext.Provider>
  );
}
