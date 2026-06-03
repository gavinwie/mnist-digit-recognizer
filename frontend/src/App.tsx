import { useRef, useState } from "react";

import { preprocessCanvas } from "./services/imageProcessing";

import { predictDigit } from "./services/model";
import DrawingCanvas from "./components/DrawingCanvas";
import "./App.css";

function App() {
  const [prediction, setPrediction] = useState<number | null>(null);

  const [confidence, setConfidence] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [preview, setPreview] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const predictionTimeout = useRef<number | null>(null);

  async function handleCanvas() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    try {
      setIsLoading(true);

      const { tensor, previewUrl } = await preprocessCanvas(canvas);

      setPreview(previewUrl);

      const result = await predictDigit(tensor);

      setPrediction(result.digit);

      setConfidence(result.confidence);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  function schedulePrediction() {
    if (predictionTimeout.current) {
      clearTimeout(predictionTimeout.current);
    }

    predictionTimeout.current = window.setTimeout(() => {
      handleCanvas();
    }, 750);
  }

  function handleClear() {
    if (predictionTimeout.current) {
      clearTimeout(predictionTimeout.current);
      predictionTimeout.current = null;
    }

    setPreview(null);
    setPrediction(null);
    setConfidence(null);
  }

  return (
    <>
      <h1>Digit Recognizer</h1>
      <div className="app-container">
        <div className="canvas-container">
          <DrawingCanvas
            canvasRef={canvasRef}
            onDrawingEnd={schedulePrediction}
            onClear={handleClear}
          />
        </div>
        <div className="prediction-container">
          {preview && (
            <div>
              <h3>Processed Image (Model Input)</h3>
              <img
                src={preview}
                alt="Processed digit"
                style={{
                  width: "200px",
                  imageRendering: "pixelated",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}

          {isLoading && <p>Predicting...</p>}

          {prediction !== null && confidence !== null && (
            <>
              <h2>Prediction: {prediction}</h2>

              <p>Confidence: {(confidence * 100).toFixed(2)}%</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
