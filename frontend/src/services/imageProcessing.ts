import * as ort from "onnxruntime-web";

const IMAGE_SIZE = 28;
const TARGET_DIGIT_SIZE = 20;

export interface ProcessedImage {
  tensor: ort.Tensor;
  width: number;
  height: number;
  previewUrl: string;
}

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function findBoundingBox(imageData: ImageData): BoundingBox | null {
  const { data, width, height } = imageData;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  let foundPixel = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];

      const brightness = (r + g + b) / 3;

      // White background assumed.
      // Anything significantly darker
      // is considered part of the digit.
      if (brightness < 240) {
        foundPixel = true;

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);

        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (!foundPixel) {
    return null;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}

function createTensorFromImageData(imageData: ImageData): ort.Tensor {
  const pixels = imageData.data;

  const normalizedPixels = new Float32Array(IMAGE_SIZE * IMAGE_SIZE);

  for (
    let pixelIndex = 0, rgbaIndex = 0;
    pixelIndex < normalizedPixels.length;
    pixelIndex++, rgbaIndex += 4
  ) {
    const red = pixels[rgbaIndex];

    const green = pixels[rgbaIndex + 1];

    const blue = pixels[rgbaIndex + 2];

    // Better grayscale conversion
    // const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;
    const grayscale = (red + green + blue) / 3;

    const normalized = grayscale / 255;

    // MNIST expects white digit on black background
    normalizedPixels[pixelIndex] = 1 - normalized;
  }

  return new ort.Tensor("float32", normalizedPixels, [1, 28, 28, 1]);
}

export async function preprocessCanvas(
  sourceCanvas: HTMLCanvasElement,
): Promise<ProcessedImage> {
  const sourceContext = sourceCanvas.getContext("2d");

  if (!sourceContext) {
    throw new Error("Unable to create source canvas.");
  }

  const sourceImageData = sourceContext.getImageData(
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
  );

  const box = findBoundingBox(sourceImageData);

  if (!box) {
    throw new Error("No digit detected.");
  }

  //
  // DIGIT BOUNDS
  //
  const cropWidth = box.maxX - box.minX + 1;

  const cropHeight = box.maxY - box.minY + 1;

  //
  // PRESERVE ASPECT RATIO
  //
  const scale = TARGET_DIGIT_SIZE / Math.max(cropWidth, cropHeight);

  const scaledWidth = cropWidth * scale;

  const scaledHeight = cropHeight * scale;

  //
  // FINAL MNIST CANVAS
  //
  const finalCanvas = document.createElement("canvas");

  finalCanvas.width = IMAGE_SIZE;

  finalCanvas.height = IMAGE_SIZE;

  const finalContext = finalCanvas.getContext("2d");

  if (!finalContext) {
    throw new Error("Unable to create final canvas.");
  }

  // White background
  finalContext.fillStyle = "white";

  finalContext.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);

  const offsetX = (IMAGE_SIZE - scaledWidth) / 2;

  const offsetY = (IMAGE_SIZE - scaledHeight) / 2;

  finalContext.drawImage(
    sourceCanvas,

    box.minX,
    box.minY,
    cropWidth,
    cropHeight,

    offsetX,
    offsetY,
    scaledWidth,
    scaledHeight,
  );

  //
  // FINAL IMAGE DATA
  //
  const finalImageData = finalContext.getImageData(
    0,
    0,
    IMAGE_SIZE,
    IMAGE_SIZE,
  );

  const tensor = createTensorFromImageData(finalImageData);

  const previewUrl = finalCanvas.toDataURL("image/png");

  return {
    tensor,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    previewUrl,
  };
}
