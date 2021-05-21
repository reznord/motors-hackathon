import React from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

function LiveScan() {
  const videoRef = React.useRef();
  const canvasRef = React.useRef();

  React.useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "environment",
          },
        })
        .then((stream) => {
          // @ts-ignore
          window.stream = stream;

          // @ts-ignore
          videoRef.current.srcObject = stream;

          return new Promise((resolve, reject) => {
            // @ts-ignore
            videoRef.current.onloadedmetadata = () => {
              // @ts-ignore
              resolve();
            };
          });
        });
      const modelPromise = cocoSsd.load();
      Promise.all([modelPromise, webCamPromise])
        .then((values) => {
          detectFrame(videoRef.current, values[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const detectFrame = (video, model) => {
    model.detect(video).then((predictions) => {
      renderPredictions(predictions);
      requestAnimationFrame(() => {
        detectFrame(video, model);
      });
    });
  };

  const renderPredictions = (predictions) => {
    // @ts-ignore
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
  };

  return (
    <div className="relative">
      <video
        autoPlay
        playsInline
        muted
        ref={videoRef}
        style={{
          margin: "auto",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          position: "fixed",
          backgroundColor: "black",
        }}
      />
      <canvas className="size absolute inset-0" ref={canvasRef} />
    </div>
  );
}

export default LiveScan;
