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
  let currentComponent: SvelteComponent;
  const pathname = window.location.pathname;

  function matchRoute(pathName: string) {
    if (currentComponent) {
      currentComponent.$destroy();
    }

    const matchedRoute = routes.find((r) => r.url === pathName);
    const MatchedComponent = matchedRoute?.component ?? NotFound;

    currentComponent = new MatchedComponent({
      target: target,
    });

    document.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", (e) => {
        if (a.target) return;

        e.preventDefault();
        const targetLocation = a.href;
        const targetPathname = new URL(targetLocation).pathname;
        history.pushState({}, "", targetPathname);
        matchRoute(targetPathname);
      });
    });
  }

  matchRoute(pathname);
}
