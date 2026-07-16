import { useState, useEffect, useCallback, useRef } from 'react';

declare global {
  interface Window {
    smartsupp?: ((...args: unknown[]) => void) & { _?: unknown[][] };
    _smartsupp?: Record<string, unknown>;
  }
}

export function useSmartsupp() {
  const [ready, setReady] = useState(false);
  const pendingOpenRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const isWidgetReady = () => {
      if (typeof window === 'undefined') return false;

      // The inline script defines window.smartsupp as a queue stub immediately.
      // The real widget is ready when loader.js finishes and injects its iframe/container.
      const hasQueue = typeof window.smartsupp === 'function';
      const hasWidget =
        typeof document !== 'undefined' &&
        !!document.querySelector(
          'iframe[id*="smartsupp"], div[id*="smartsupp"], #smartsupp',
        );

      // Ready when the queue exists AND the widget DOM element is present,
      // OR after a generous fallback timeout (loader.js may render differently).
      return hasQueue && hasWidget;
    };

    const markReady = () => {
      if (cancelled) return;
      setReady(true);
      if (pendingOpenRef.current) {
        pendingOpenRef.current = false;
        try {
          window.smartsupp?.('chat:open');
        } catch {
          // ignore
        }
      }
    };

    if (isWidgetReady()) {
      markReady();
      return;
    }

    // Poll for the widget iframe to appear in the DOM.
    const interval = setInterval(() => {
      if (isWidgetReady()) {
        clearInterval(interval);
        markReady();
      }
    }, 400);

    // Fallback: after 12s, assume ready (the queue stub handles deferred commands).
    const timeout = setTimeout(() => {
      if (cancelled) return;
      clearInterval(interval);
      if (typeof window.smartsupp === 'function') {
        markReady();
      }
    }, 12000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const openChat = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.smartsupp !== 'function') return;

    // Always queue the command — Smartsupp's queue processes it once loaded.
    try {
      window.smartsupp('chat:open');
    } catch {
      // ignore — queue stub never throws
    }

    // If the widget isn't ready yet, flag a pending open so we retry
    // automatically once the iframe appears.
    if (!ready) {
      pendingOpenRef.current = true;
    }
  }, [ready]);

  return { ready, openChat };
}
