import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchPortfolio } from './api';
import type { Portfolio } from './types';
import { buildSectionMeta } from './viewerProfiles';

const PortfolioContext = createContext<Portfolio | null>(null);

/**
 * Loads the portfolio from the Spring Boot API once, then shares it with every component.
 * Components read it with:   const { projects } = usePortfolio();
 */
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Portfolio | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio()
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink px-6 text-center text-bone">
        <p className="font-display text-4xl tracking-wide">Can&apos;t reach the backend</p>
        <p className="max-w-md text-sm text-mist">
          {error}. Start PostgreSQL and the Spring Boot server (see README), then refresh this page.
        </p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <span className="font-display text-3xl tracking-[0.3em] text-crimson-2 animate-pulse">LOADING…</span>
      </div>
    );
  }
  return <PortfolioContext.Provider value={data}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): Portfolio {
  const value = useContext(PortfolioContext);
  if (!value) throw new Error('usePortfolio must be used inside <PortfolioProvider>');
  return value;
}

export function useSectionMeta() {
  const portfolio = usePortfolio();
  return useMemo(() => buildSectionMeta(portfolio), [portfolio]);
}
