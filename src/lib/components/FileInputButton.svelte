<script>
  let {
    children,
    inputElement = $bindable()
  } = $props();
</script>



<button on:click={inputElement.click}>
  {@render children()}
  <input bind:this={inputElement} on:change on:click|stopPropagation type="file" accept="image/*" multiple />
</button>

<style lang="scss">
  button {
    position: relative;
  }

  input {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
    padding: initial;
    border: initial;
    line-height: initial;
    box-shadow: none;
  }
</style>
