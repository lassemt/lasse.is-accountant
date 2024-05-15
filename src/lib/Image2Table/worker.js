const canvas = new OffscreenCanvas(64, 8);
const ctx = canvas.getContext('2d', { willReadFrequently: true });

addEventListener('message', (event) => {
	if(!event.data.id) {
		console.warn('A job id needs to be provided...');
		return;
	}

	handleImage(event.data.id, event.data.image, event.data.size);
});

async function handleImage(id, image, size) {
	const img = await createImageBitmap(image, {
		resizeWidth: Math.floor(size || 64),
		// resizeQuality: 'pixelated'
		// resizeHeight: Math.floor(32 * (img.height / img.width)),
	});

  // set size proportional to image
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const pixles = imageTo2DHexArray(ctx.getImageData(0, 0, img.width, img.height));

	postMessage({
		id,
		pixles
	});
}

function imageTo2DHexArray(imageData) {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const result = new Array(height);

  for (let y = 0; y < height; y++) {
    const row = new Array(width);
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      // Ignore alpha with pixels[idx + 3]
      row[x] = rgbToHex(r, g, b);
    }
    result[y] = row;
  }

  return result;
}

function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}
