import { useEffect, useState } from "react";
import { useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const renderPredictions = canvasRef => (predictions) => {
  const ctx = canvasRef.current.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Font options.
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";
  predictions.forEach(prediction => {
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
    const textHeight = parseInt(font, 10);
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
  });

  predictions.forEach(prediction => {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    // Draw the text last to ensure it's on top.
    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);
  });
};

const webCamPromise = async (videoRef) => {
  try {
    const result = await navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: "user"
        }
      });

      videoRef.current.srcObject = result;

      return new Promise((resolve, reject) => {
        videoRef.current.onloadedmetadata = () => {
          resolve(true);
        }
      });
  } catch (error) {
    console.log("CAN NOT LOAD VIDEO", error);
  }
};

const useVideo = () => {
  const videoRef = useRef(null);

  if(process.browser) {
    if (navigator?.mediaDevices && navigator?.mediaDevices?.getUserMedia) {
      webCamPromise(videoRef);
    }
  }

  return videoRef;
}

const detectFrame = (video, model) => async (canvasRef) => {
  try {
    const predictions = await model.detect(video);

    if (canvasRef?.current) {
      renderPredictions(canvasRef)(predictions);
    }

    requestAnimationFrame(() => {
      detectFrame(video, model)(canvasRef);
    });

  } catch (err) {
    console.log("DETECT ERROR", err);
  }
};


function Predictor() {
  const videoRef = useVideo();
  const canvasRef = useRef();


  const fetchModel = async () => {
    try {
      const model = await cocoSsd.load();
      detectFrame(videoRef.current, model)(canvasRef);
    } catch(error) {
      console.log("ERROR LOADING MODEL ===>", error);
    }
  };

  useEffect(() => {
    if (videoRef?.current) {
      fetchModel();
    }
  }, [videoRef]);


  return (
    <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", height: "auto"}}>
      <video
        ref={videoRef}
        style={{position: 'absolute', top: 0, left: 0}}
        width="600"
        height="450"
        autoPlay
        muted
        playsInline
      />
      <canvas
        style={{position: 'absolute', top: 0, left: 0}}
        className="size"
        ref={canvasRef}
        width="600"
        height="450"
      />
    </div>
  )
}

export default Predictor;