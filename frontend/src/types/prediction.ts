export interface PredictionResult {
  digit: number;
  confidence: number;
  probabilities: Float32Array;
}