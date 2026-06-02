import Prediction from "./components/Prediction";
import './App.css'
import { useState } from "react";

function App() {
  const [prediction, setPrediction] = useState<number | null>(null)


  return (
    <div>
      <Prediction digit={prediction}
      confidence={98.2}
      />
      <button onClick= {() => setPrediction(3)}>
        Change Prediction
      </button>
    </div>
  );
}

export default App
