import { useEffect, useState, useCallback } from 'react';

export type Route =
  | 'home'
  | 'about'
  | 'apply'
  | 'tracker'
  | 'donate'
  | 'contact'
  | 'admin'
  | 'admin-login'
  | 'auth';

const routeMap: Record<string, Route> = {
  '': 'home',
  '#': 'home',
  '#home': 'home',
  '#about': 'about',
  '#apply': 'apply',
  '#tracker': 'tracker',
  '#donate': 'donate',
  '#contact': 'contact',
  '#admin': 'admin',
  '#admin-login': 'admin-login',
  '#auth': 'auth',
};

export function parseHash(): Route {
  const hash = window.location.hash || '#home';
  return routeMap[hash] ?? 'home';
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export function navigate(to: Route) {
  window.location.hash = `#${to}`;
}

export function useNavigate() {
  return useCallback((to: Route) => navigate(to), []);
}
