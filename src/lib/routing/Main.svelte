<script lang="ts">
  import { SvelteComponent } from "svelte";

  export let matchedRouteParams = {};
  export let matchedComponents: SvelteComponent[] = [];
</script>

{#if matchedComponents.length === 1}
  <svelte:component this={matchedComponents[0]} {...matchedRouteParams} />
{:else if matchedComponents.length > 1}
  <svelte:component this={matchedComponents[0]} {...matchedRouteParams}>
    <svelte:self
      matchedComponents={matchedComponents.slice(1)}
      {matchedRouteParams}
    />
  </svelte:component>
{/if}
