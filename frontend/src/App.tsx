import { useRef, useState } from "react";

import { preprocessCanvas } from "./services/imageProcessing";

import { predictDigit } from "./services/model";
import DrawingCanvas from "./components/DrawingCanvas";
import "./App.css";
import { FaGithub } from "react-icons/fa6";

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
      <header className="hero">
        <h1 className="app-title">Digit Recognizer</h1>

        <p className="tagline">
          Draw a single digit and classify it with an ONNX neural network.
        </p>

        <a
          href="https://github.com/gavinwie/mnist-digit-recognizer"
          target="_blank"
          rel="noopener noreferrer"
          className="github-button"
        >
          <FaGithub />
          <span>View Source</span>
        </a>
      </header>
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
      <small className="disclaimer">
        A simple React + TypeScript frontend for a single digit recognition
        model trained on the{" "}
        <a
          href="https://www.tensorflow.org/datasets/catalog/mnist"
          target="_blank"
          rel="noopener noreferrer"
        >
          MNIST dataset
        </a>
        .
      </small>
    </>
  );
}

export default App;
