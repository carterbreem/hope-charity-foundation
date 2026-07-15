import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    smartsupp?: ((...args: unknown[]) => void) & { _?: unknown[][] };
    _smartsupp?: Record<string, unknown>;
  }
}

export function useSmartsupp() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkReady = () => {
      if (cancelled) return;

      const smartsuppLoaded =
        typeof window !== 'undefined' &&
        typeof window.smartsupp === 'function' &&
        window._smartsupp !== undefined &&
        window._smartsupp.key !== undefined;

      const widgetInDom =
        typeof document !== 'undefined' &&
        !!document.querySelector('iframe[id*="smartsupp"], div[id*="smartsupp"]');

      if (smartsuppLoaded || widgetInDom) {
        setReady(true);
        return true;
      }
      return false;
    };

    if (checkReady()) return;

    const interval = setInterval(() => {
      if (checkReady()) {
        clearInterval(interval);
      }
    }, 500);

    const timeout = setTimeout(() => {
      if (window.smartsupp) {
        setReady(true);
      }
      clearInterval(interval);
    }, 15000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const openChat = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.smartsupp !== 'function') return;

    try {
      window.smartsupp('chat:show');
      window.smartsupp('chat:open');
    } catch {
      try {
        window.smartsupp('chat:open');
      } catch {
        // Smartsupp not available
      }
    }
  }, []);

  return { ready, openChat };
}
