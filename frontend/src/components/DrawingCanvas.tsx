import { useEffect, useRef } from "react";

type DrawingCanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onDrawingEnd?: () => void;
  onClear?: () => void;
};

export default function DrawingCanvas({
  canvasRef,
  onDrawingEnd,
  onClear,
}: DrawingCanvasProps) {
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // White background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Black drawing color
    ctx.strokeStyle = "black";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [canvasRef]);

  const getMousePosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getTouchPosition = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  };

  const startDrawing = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    drawingRef.current = true;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const continueDrawing = (x: number, y: number) => {
    if (!drawingRef.current) return;

    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!drawingRef.current) return;

    drawingRef.current = false;

    const ctx = canvasRef.current?.getContext("2d");

    ctx?.closePath();

    onDrawingEnd?.();
  };

  const clearCanvas = () => {
    onClear?.();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        style={{
          border: "1px solid #ccc",
          cursor: "crosshair",
          touchAction: "none",
        }}
        onMouseDown={(e) => {
          const pos = getMousePosition(e);
          startDrawing(pos.x, pos.y);
        }}
        onMouseMove={(e) => {
          const pos = getMousePosition(e);
          continueDrawing(pos.x, pos.y);
        }}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={(e) => {
          e.preventDefault();
          const pos = getTouchPosition(e);
          startDrawing(pos.x, pos.y);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          const pos = getTouchPosition(e);
          continueDrawing(pos.x, pos.y);
        }}
        onTouchEnd={stopDrawing}
      />

      <div style={{ marginTop: "1rem" }}>
        <button onClick={clearCanvas}>Clear</button>
      </div>
    </div>
  );
}
