# MNIST Digit Recognizer

A web-based application for recognizing handwritten digits using machine learning. Draw a digit on the canvas and get instant predictions powered by an ONNX model.

## Features

- **Interactive Drawing Canvas** - Draw digits directly in your browser
- **Real-time Predictions** - Get instant digit recognition results
- **Pre-trained Model** - Uses an optimized ONNX model for fast inference
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Project Structure

```
mnist-digit-recognizer/
├── frontend/              # React + TypeScript web application
│   ├── src/
│   │   ├── components/   # React components (DrawingCanvas, Prediction)
│   │   ├── services/     # Model and image processing utilities
│   │   ├── types/        # TypeScript type definitions
│   │   └── App.tsx       # Main application component
│   ├── public/
│   │   └── model/        # ONNX model files
│   ├── model-training/   # Jupyter notebook for model training
│   ├── package.json      # Dependencies and scripts
│   └── vite.config.ts    # Vite build configuration
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mnist-digit-recognizer
```

2. Navigate to the frontend directory:

```bash
cd frontend
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to the URL displayed (typically `http://localhost:5173`)

## Usage

1. Use your mouse or touch to draw a digit (0-9) on the canvas
2. The model will automatically predict the digit
3. View the prediction result and confidence score
4. Clear the canvas to try drawing another digit

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **ML Model**: ONNX (Open Neural Network Exchange)
- **Styling**: CSS
- **Data**: EMNIST dataset for training
- **Training**: Python (Jupyter Notebook)

## Model Training

The model is trained using the EMNIST dataset. Training details and scripts can be found in `frontend/model-training/train.ipynb`.

To retrain the model:

1. Navigate to `frontend/model-training/`
2. Open `train.ipynb` in Jupyter Notebook
3. Run all cells to train and export the model
4. The trained model will be saved to `frontend/public/model/`

## Available Scripts

In the frontend directory, you can run:

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
