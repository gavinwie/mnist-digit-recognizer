import * as ort from "onnxruntime-web";
import type { PredictionResult } from "../types/prediction";

const MODEL_PATH = `${import.meta.env.BASE_URL}model/mnist_model.onnx`;

const INPUT_NAME = "args_0:0";

const OUTPUT_NAME = "Identity:0";

let session: ort.InferenceSession | null = null;

export async function loadModel(): Promise<ort.InferenceSession> {
  if (session) {
    return session;
  }

  session = await ort.InferenceSession.create(MODEL_PATH);

  return session;
}

export async function predictDigit(
  tensor: ort.Tensor,
): Promise<PredictionResult> {
  const activeSession = await loadModel();

  const outputs = await activeSession.run({
    [INPUT_NAME]: tensor,
  });

  const probabilities = outputs[OUTPUT_NAME].data as Float32Array;

  let digit = 0;
  let confidence = probabilities[0];

  for (let i = 1; i < probabilities.length; i++) {
    if (probabilities[i] > confidence) {
      confidence = probabilities[i];
      digit = i;
    }
  }

  return {
    digit,
    confidence,
    probabilities,
  };
}
