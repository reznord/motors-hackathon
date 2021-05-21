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
    <div>
      <img
        src="/carmageddon-transparent.png"
        className="fixed top-1 left-1/2 -ml-16 z-10 top-4"
        width="150px"
      />
      {isModelLoading && (
        <p className="bg-black text-white fixed top-2 left-1/2 -mt-10 -ml-10">
          Analysing
        </p>
      )}
      <div className="grid place-items-center w-screen h-screen bg-black">
        <div className="relative">
          {imgData && (
            <img
              src={imgData}
              ref={imageRef}
              style={{
                margin: "auto",
                width: "auto",
                height: "auto",
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
      </div>
      <div className="flex w-full flex-col items-center mt-2 fixed z-10 bottom-14 gap-5">
        <Button
          onClick={reset}
          className="text-center text-white border-0 py-4 px-8 focus:outline-none rounded text-lg focus:ring-2 focus:ring-black bg-red-500 hover:bg-red-600"
        >
          Scan another car
        </Button>
        <Button
          href="https://www.standvirtual.com/carros/q-renault-megane"
          target="_blank"
        >
          View more ads like this
        </Button>
      </div>
    </div>
  );
}

export default ImageScan;
