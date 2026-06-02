
type PredictionProps = {
    digit: number | null,
    confidence: number | null,
};

function Prediction({digit, confidence}: PredictionProps) {
    return (
        <div>
            <h2>Prediction: {digit}</h2>
            <p>Confidence: {confidence}%</p>
        </div>
    );
}

export default Prediction;