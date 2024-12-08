import type { SvelteComponent } from "svelte";

import NotFound from "../../routes/NotFound.svelte";

interface Route {
  url: string;
  component: SvelteComponent;
}

export function createRouter({
  routes,
  target,
}: {
  routes: Route[];
  target: HTMLElement;
}) {
  const pathname = window.location.pathname;
  const matchedRoute = routes.find((r) => r.url === pathname);
  const MatchedComponent = matchedRoute?.component ?? NotFound;

  new MatchedComponent({
    target: target,
  });
}
