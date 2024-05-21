<script>
  import { Image2Table } from '$lib/Image2Table/index.js';
  import { arrayToCsv } from '$lib/Sheets.js';
  import Table from '$lib/components/Table.svelte';
  import FileInputButton from '$lib/components/FileInputButton.svelte';
  import PlaceholderData from './PlaceholderData.js';

  const imageProcessor = new Image2Table;
  let isDragover = false;
  let pixles = PlaceholderData;
  let cellSize = 16;
  let nColumns = 64;
  let title = 'untitled';
  let currentFile;

  async function onDropFile(event) {
    event.preventDefault();
    isDragover = false;

    // TODO: Shortcut because its noramlly used to handle multiple files
    let file;
    if (event.dataTransfer.items && event.dataTransfer.items.length) {
      file = Array.from(event.dataTransfer.items).reduce(function(filtered, file) {
        if (file.kind === 'file') {
          filtered.push(file.getAsFile());
        }
        return filtered;
      }, [])[0];
    } else {
      file = Array.from(event.dataTransfer.files)[0];
    }

    handleFile(file);
  }


  function onFileInput(event) {
    event.preventDefault();
    handleFile(Array.from(event.target.files)[0] || null)
  }

  async function handleFile(file) {
    // TODO: Check type here
    if(!file) {
      console.warn('No file was provided.')
      return;
    }

    // Simple validation
    if(!file.type.startsWith('image/')) {
      throw new Error(`File type ${file.type} is not supported.`);
    }

    currentFile = file;
    title = file.name.substring(0, file.name.lastIndexOf('.'));
    await getImageData();
  }

  async function getImageData() {
    if(!currentFile) {
      return;
    }

    const data = await imageProcessor.process(currentFile, nColumns);
    pixles = data.pixles;
  }

  function copyData() {
    navigator.clipboard.writeText(arrayToCsv(pixles, '\t'));
  }

  function saveData() {
    const link = document.createElement('a');
    const file = new Blob([arrayToCsv(pixles, '\t')], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = `${title}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
</script>

<div
  class="App"
  class:has-dragover={isDragover}
  on:drop={onDropFile}
  on:dragover|preventDefault
  on:dragenter={() => isDragover = true}
  on:dragleave={() => isDragover = false}
>
	<div class="App__toolbar">
		<h1>{title}.csv</h1>
		<nav >
      <FileInputButton on:change={onFileInput}>Open image</FileInputButton>
      <button on:click={saveData}>Save</button>
      <button on:click={copyData}>Copy</button>
      <input type="number" on:change={getImageData} bind:value={nColumns} min="8" max="1024"/>
		</nav>
	</div>
  <div class="App__editor">
    <Table data={pixles} size={cellSize} />
  </div>
  <div class="App__footer">
    <label>Cell size</label>
    <input type="range" bind:value={cellSize} min="8" max="100" />
  </div>
</div>

<style lang="scss">
  .App {
    display: flex;
    flex-flow: column nowrap;
    height: 100vh;
    height: 100dvh;

    &__toolbar {
      flex: 0 0 auto;
      min-height: 0;
      min-width: 0;
      width: 100%;
      max-height: none;
      height: auto;
      padding: 16px;
      border-bottom: 1px solid #D7D7D9;
    }

    &__footer {
      flex: 0 0 auto;
      min-height: 0;
      min-width: 0;
      width: 100%;
      max-height: none;
      height: auto;
      padding: 16px 8px;
    }

    &__editor {
      flex: 1 1 0;
      min-height: 0;
      min-width: 0;
      width: 100%;
      max-height: none;
      height: auto;

    }
  }
</style>

