<script>
  import { clamp } from '$lib/Math.js';

  export let data;
  export let size = 100;

  // https://dev.to/all_stacks_developer/how-to-convert-column-index-of-a-spreadsheet-into-letters-31k0
  function getColumnLetters(columnIndexStartFromOne) {
    const ALPHABETS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    if (columnIndexStartFromOne < 27) {
      return ALPHABETS[columnIndexStartFromOne - 1]
    } else {
      var res = columnIndexStartFromOne % 26
      var div = Math.floor(columnIndexStartFromOne / 26)
      if (res === 0) {
        div = div - 1
        res = 26
      }
      return getColumnLetters(div) + ALPHABETS[res - 1]
    }
  }
</script>

<div class="Table" style:--cellWidth={`${clamp(size, 8, 100)}px`}>
  <div class="Table__headerow">
    <div></div>
    {#each {length: data[0]?.length || 0} as _, i}
      <div>{getColumnLetters(i + 1)}</div>
    {/each}
  </div>

  {#each data as row, rowIndex}
    <div>
      <div>{rowIndex + 1}</div>
      {#each row as column, columnIndex}
        <div style:--color={column}>{ column }</div>
      {/each}
    </div>
  {/each}
</div>

<style lang="scss">
  .Table {
    --cellWidth: 10px;
    --border-color: #D7D7D9;
    width: 100%;
    height: 100%;
    overflow: scroll;
    position: relative;

    > div {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      width: max-content;
      border-top: 1px solid var(--border-color);

      &:first-child {
        position: sticky;
        top: 0;
        user-select: none;
        background-color: #F2F2F2;
        text-align: center;

        > div {
          aspect-ratio: unset;
          height: auto;
        }
      }

      > div {
        flex: 0 0 auto;
        width: var(--cellWidth);
        height: var(--cellWidth);
        // aspect-ratio: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: var(--color, transparent);
        border-right: 1px solid var(--border-color);

        &:first-child {
          position: sticky;
          left: 0;

          display: flex;
          width: 50px;
          align-items: center;
          justify-content: center;

          background-color: #F2F2F2;
          user-select: none;
        }


      }

    }
  }
</style>

