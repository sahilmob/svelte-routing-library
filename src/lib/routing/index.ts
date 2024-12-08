import type { SvelteComponent } from "svelte";

import LoadingIndicator from "./LoadingIndicator.svelte";

const NotFound = () => import("../../routes/NotFound.svelte");

interface Route {
  url: RegExp;
  component: () => Promise<SvelteComponent>;
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

  const indicator = new LoadingIndicator({
    target: document.body,
  });

  function showLoadingIndictor() {
    indicator.show();
  }

  function hideLoadingIndicator() {
    indicator.hide();
  }

  function matchRoute(pathName: string) {
    const matchedRoute = routes.find((r) => r.url.test(pathName));
    const matchedComponentPromise = matchedRoute?.component ?? NotFound;
    showLoadingIndictor();
    matchedComponentPromise().then((C) => {
      hideLoadingIndicator();
      if (currentComponent) {
        currentComponent.$destroy();
      }
      currentComponent = new C.default({
        target: target,
      });
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

  window.addEventListener("popstate", () => {
    matchRoute(window.location.pathname);
  });
}

function findAnchorTag(element: HTMLElement): HTMLAnchorElement | null {
  if (element.tagName === "HTML") return null;

  if (element.tagName === "A") return element as HTMLAnchorElement;
  else
    return element.parentElement ? findAnchorTag(element.parentElement) : null;
}
