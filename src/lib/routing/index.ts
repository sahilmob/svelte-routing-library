import type { SvelteComponent } from "svelte";

import LoadingIndicator from "./LoadingIndicator.svelte";

const NotFound = () => import("../../routes/NotFound.svelte");

interface Route {
  url: RegExp;
  params?: string[];
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
  let currentComponentInstance: SvelteComponent;
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
    let matchedRouteParams: { [k: string]: string };
    let matchedRoute: Route;

    for (const r of routes) {
      const match = pathName.match(r.url);
      if (match) {
        const params: { [k: string]: string } = {};
        if (r.params) {
          for (let i = 0; i < r.params.length; i++) {
            params[r.params[i]] = match[i + 1];
          }
        }
        matchedRouteParams = params;
        matchedRoute = r;
        break;
      }
    }

    const matchedComponentPromise = matchedRoute?.component ?? NotFound;
    showLoadingIndictor();
    matchedComponentPromise().then((C) => {
      hideLoadingIndicator();

      if (C.default === currentComponent) {
        currentComponentInstance.$set(matchedRouteParams);
        return;
      }

      if (currentComponentInstance) {
        currentComponentInstance.$destroy();
      }
      currentComponent = C.default;
      currentComponentInstance = new C.default({
        target: target,
        props: matchedRouteParams,
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
