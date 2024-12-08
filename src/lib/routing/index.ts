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
  }

  matchRoute(pathname);

  window.addEventListener("click", (e) => {
    const clickTarget = e.target;
    const anchorTag = findAnchorTag(clickTarget as HTMLElement);

    if (!anchorTag) return;

    if (anchorTag.target) return;
    if (anchorTag.hasAttribute("no-routing")) return;

    e.preventDefault();
    const targetLocation = anchorTag.href;
    const targetPathname = new URL(targetLocation).pathname;
    history.pushState({}, "", targetPathname);
    matchRoute(targetPathname);
  });
}

function findAnchorTag(element: HTMLElement): HTMLAnchorElement | null {
  if (element.tagName === "HTML") return null;

  if (element.tagName === "A") return element as HTMLAnchorElement;
  else
    return element.parentElement ? findAnchorTag(element.parentElement) : null;
}
