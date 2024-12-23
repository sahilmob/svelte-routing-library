import type { SvelteComponent } from "svelte";

import Main from "./Main.svelte";
import LoadingIndicator from "./LoadingIndicator.svelte";

const NotFound = [() => import("../../routes/NotFound.svelte")];

interface Route {
  url: RegExp;
  params?: Array<{
    name: string;
    matching?: (param: string) => boolean;
    rest?: boolean;
  }>;

  components: Array<() => Promise<SvelteComponent>>;
}

export function createRouter({
  routes,
  target,
}: {
  routes: Route[];
  target: HTMLElement;
}) {
  const pathname = window.location.pathname;

  let main: SvelteComponent;

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
    let matchedRouteParams: { [k: string]: string | string[] };
    let matchedRoute: Route;

    routeMatching: for (const r of routes) {
      const match = pathName.match(r.url);
      if (match) {
        const params: { [k: string]: string | string[] } = {};
        if (r.params) {
          for (let i = 0; i < r.params.length; i++) {
            const { name, matching, rest } = r.params?.[i];
            const paramValue: string | string[] = match[i + 1] ?? "";
            if (typeof matching === "function") {
              if (!matching(paramValue)) {
                continue routeMatching;
              }
            }
            params[name] = rest ? paramValue.split("/") : paramValue;
          }
        }

        matchedRouteParams = params;
        matchedRoute = r;
        break;
      }
    }

    const matchedComponentsPromises = matchedRoute?.components ?? NotFound;
    showLoadingIndictor();

    Promise.all(matchedComponentsPromises.map((fn) => fn())).then(
      (matchedComponentsModules) => {
        hideLoadingIndicator();
        const matchedComponents = matchedComponentsModules.map(
          (m) => m.default
        );

        if (!main) {
          main = new Main({
            target,
            props: { matchedRouteParams, matchedComponents },
          });
        } else {
          main.$set({
            matchedComponents,
            matchedRouteParams,
          });
        }
      }
    );
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
