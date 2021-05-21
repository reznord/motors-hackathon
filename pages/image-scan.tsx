import { useRef, useState, useEffect } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { useImageState } from "../context/image";
import { useRouter } from "next/router";
import Button from "../components/button";

const fetchCarDetails = () => ({
  name: "Renault Megane",
  value: "8k EUR",
  type: "Diesel",
});

const DisplayAttributes = () => {
  const { name, value, type } = fetchCarDetails();
  return (
    <div>
      <p className="absolute top-1 right-1 bg-white text-xs px-1">{name}</p>
      <p className="absolute top-5 right-1 bg-white text-xs px-1">{value}</p>
      <p className="absolute top-9 right-1 bg-white text-xs px-1">{type}</p>
    </div>
  );
};

const TargetBox = ({ x, y, width, height, classType, score }) => (
  <div
    className="absolute border-green-500 bg-transparent border-4 z-20"
    style={{
      left: x,
      top: y,
      width,
      height,
    }}
  >
    <DisplayAttributes />
  </div>
);

function ImageScan() {
  const imageRef = useRef(null);
  const [imgData, setImgData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [loadModel, setLoadModel] = useState(null);
  const [isModelLoading, setModelLoading] = useState(true);
  const screenshot = useImageState();
  const router = useRouter();

  const fetchModel = async () => {
    setModelLoading(true);
    const model = await cocoSsd.load({});
    setLoadModel(model);
    setModelLoading(false);
  };

  useEffect(() => {
    fetchModel();
  }, []);

  useEffect(() => {
    if (screenshot && !imgData) {
      setImgData(screenshot);
    }
  }, [screenshot, loadModel]);

  useEffect(() => {
    if (imgData && loadModel) {
      setLoading(true);
      const imageElement = document.createElement("img");
      imageElement.src = imgData;

      imageElement.onload = async () => {
        const imgSize = {
          width: imageElement.width,
          height: imageElement.height,
        };
        await detectObjectsOnImage(imageElement, imgSize);
        setLoading(false);
      };
    }
  }, [imgData, loadModel]);

  const isEmptyPredictions = !predictions || predictions.length === 0;

  const normalizePredictions = (predictions, imgSize) => {
    if (!predictions || !imgSize || !imageRef) return predictions || [];
    return predictions.map((prediction) => {
      const { bbox } = prediction;
      const oldX = bbox[0];
      const oldY = bbox[1];
      const oldWidth = bbox[2];
      const oldHeight = bbox[3];

      const imgWidth = imageRef.current.width;
      const imgHeight = imageRef.current.height;

      const x = (oldX * imgWidth) / imgSize.width;
      const y = (oldY * imgHeight) / imgSize.height;
      const width = (oldWidth * imgWidth) / imgSize.width;
      const height = (oldHeight * imgHeight) / imgSize.height;

      return { ...prediction, bbox: [x, y, width, height] };
    });
  };

  const detectObjectsOnImage = async (imageElement, imgSize) => {
    const predictions = await loadModel.detect(imageElement, 6);
    const normalizedPredictions = normalizePredictions(predictions, imgSize);
    setPredictions(normalizedPredictions);
    console.log("Predictions: ", predictions);
  };

  const reset = () => {
    router.back();
  };

  return (
    <div
      className="flex flex-col items-center bg-black"
      style={{ width: "100%", height: "100vh" }}
    >
      {isModelLoading && (
        <p className="text-black absolute top-1/2 left-1/2 -mt-10 -mr-10">
          LOADING
        </p>
      )}
      <div
        className="flex items-center justify-center rounded-sm mt-2"
        style={{ height: 500, minWidth: 200, position: "relative" }}
      >
        {!imgData && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
        {imgData && (
          <img
            src={imgData}
            ref={imageRef}
            style={{
              margin: "auto",
              width: "auto",
              height: "auto",
              position: "fixed",
              backgroundColor: "black",
            }}
          />
        )}
        {!isEmptyPredictions &&
          predictions.map((prediction, idx) => (
            <TargetBox
              key={idx}
              x={prediction.bbox[0]}
              y={prediction.bbox[1]}
              width={prediction.bbox[2]}
              height={prediction.bbox[3]}
              classType={prediction.class}
              score={prediction.score * 100}
            />
          ))}
      </div>
      <div className="flex justify-center flex-col mt-2 gap-5">
        <Button
          onClick={reset}
          className="text-center text-white border-0 py-4 px-8 focus:outline-none rounded text-lg focus:ring-2 focus:ring-black bg-red-500 hover:bg-red-600"
        >
          Scan other car
        </Button>
        <Button href="/carros/?q-renault-megane">
          View more ads like this
        </Button>
      </div>
    </div>
  );
}

export default ImageScan;
