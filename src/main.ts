import A from "./routes/A.svelte";
import B from "./routes/B.svelte";
import C from "./routes/C.svelte";
import { createRouter } from "./lib/routing";

createRouter({
  routes: [
    {
      url: "/",
      component: A,
    },
    {
      url: "/b",
      component: B,
    },
    {
      url: "/c",
      component: C,
    },
  ],
  target: document.getElementById("app")!,
});
