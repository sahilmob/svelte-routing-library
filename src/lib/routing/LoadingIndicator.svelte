<script>
  import { tweened } from "svelte/motion";

  let hiding = false;
  export let visible = true;

  let percentage = tweened(0, {
    duration: 500,
  });

  async function update() {
    if (!visible || $percentage >= 100) return;
    if ($percentage === 0) {
      await percentage.set(50);
    } else if ($percentage < 90) {
      await percentage.set($percentage + 5);
    } else {
      await percentage.set($percentage * 1.01);
    }
    update();
  }

  export async function show() {
    visible = true;
    percentage.set(0, { duration: 0 });

    await new Promise((res) =>
      setTimeout(() => {
        res("");
      }, 500)
    );

    if (!visible || hiding) return;
    update();
  }

  export async function hide() {
    hiding = true;
    if ($percentage > 0) {
      await percentage.set(100, { duration: 200 });
    }
    visible = false;
    hiding = false;
  }
</script>

{#if visible}
  <div style:transform="scaleX({$percentage}%)" />
{/if}

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    width: 100vw;
    transform-origin: 0 0;
    background: rebeccapurple;
  }
</style>
