import * as ort from "onnxruntime-web";

export interface ProcessedImage {
  tensor: ort.Tensor;
  width: number;
  height: number;
  previewUrl: string;
}
