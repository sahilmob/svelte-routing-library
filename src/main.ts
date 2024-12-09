import { createRouter } from "./lib/routing";

createRouter({
  routes: [
    {
      url: /^\/\/?$/,
      components: [() => import("./routes/A.svelte")],
    },
    {
      url: /^\/b\/?$/,
      components: [() => import("./routes/B.svelte")],
    },
    {
      url: /^\/c\/?$/,
      components: [() => import("./routes/C.svelte")],
    },
    {
      url: /^\/shop\/([^/]+)\/?$/,
      params: [{ name: "shopId", matching: (shopId) => /^\d+$/.test(shopId) }],
      components: [
        () => import("./routes/Layout.svelte"),
        () => import("./routes/Shop.svelte"),
      ],
    },
    {
      url: /^\/shop\/([^/]+)\/([^/]+)\/?$/,
      params: [
        { name: "shopId", matching: (shopId) => /^\d+$/.test(shopId) },
        { name: "itemId", matching: (itemId) => /^\d+$/.test(itemId) },
      ],
      components: [
        () => import("./routes/Layout.svelte"),
        () => import("./routes/Item.svelte"),
      ],
    },
    {
      url: /^\/a(?:\/?|\/(.+)\/?)$/,
      params: [{ name: "rest", rest: true }],
      components: [() => import("./routes/Rest.svelte")],
    },
  ],
  target: document.getElementById("app")!,
});
