import { createRef, RefObject, useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
/* 
function renderPredictions(canvas, predictions) {
  const ctx = canvas.current.getContext("2d");
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
}
 */
function detectFrame(video, model) {
  console.log("detectFrame ===>", video, model);
  if (model) {
    model?.detect(video).then((predictions) => {
      // renderPredictions(predictions);
      console.log("PRED ===>", predictions);
      requestAnimationFrame(() => {
        detectFrame(video, model);
      });
    });
  }
}

const options = {
  audio: false,
  video: {
    facingMode: "user",
  },
};

function useCamera() {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const modelPromise = cocoSsd.load();
      const webCamPromise = navigator.mediaDevices
        .getUserMedia(options)
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            Promise.all([modelPromise, webCamPromise]).then((res) =>
              detectFrame(videoRef.current, res[0])
            );
          };
        });
    }
  }, []);

  return {
    video: videoRef,
    canvas: canvasRef,
  };
}

export { useCamera };
