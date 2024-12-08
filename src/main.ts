import { createRouter } from "./lib/routing";

createRouter({
  routes: [
    {
      url: /^\/\/?$/,
      component: () => import("./routes/A.svelte"),
    },
    {
      url: /^\/b\/?$/,
      component: () => import("./routes/B.svelte"),
    },
    {
      url: /^\/c\/?$/,
      component: () => import("./routes/C.svelte"),
    },
    {
      url: /^\/shop\/([^/]+)\/?$/,
      params: ["shopId"],
      component: () => import("./routes/Shop.svelte"),
    },
    {
      url: /^\/shop\/([^/]+)\/([^/]+)\/?$/,
      params: ["shopId", "itemId"],
      paramsMatching: [(shopId) => /^\d+$/.test(shopId)],
      component: () => import("./routes/Item.svelte"),
    },
  ],
  target: document.getElementById("app")!,
});
