import { useRef, useState, useEffect } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const TargetBox = ({x, y, width, height, classType, score}) => 
  <div
    tw-content-before={`${classType} ${score.toFixed(1)}%`}
    className="content-before before:text-green-500 before:bg-white before:-top-2.5 before:-left-2.5"
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      border: "4px solid #1ac71a",
      backgroundColor: "transparent",
      zIndex: 20,
    }}
  />


function ImageScan() {
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const [imgData, setImgData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [loadModel, setLoadModel] = useState(null);
  const [isModelLoading, setModelLoading] = useState(true);
  

  const fetchModel = async () => {
    setModelLoading(true);
    const model = await cocoSsd.load({});
    setLoadModel(model);
    setModelLoading(false);
  };

  useEffect(() => {
    fetchModel();
  }, []);

  const isEmptyPredictions = !predictions || predictions.length === 0;

  const openFilePicker = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();
    };
  };

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

  const readImage = (file) => {
    return new Promise((rs, rj) => {
      const fileReader = new FileReader();
      fileReader.onload = () => rs(fileReader.result);
      fileReader.onerror = () => rj(fileReader.error);
      fileReader.readAsDataURL(file);
    });
  };

  const onSelectImage = async (e) => {
    setPredictions([]);
    setLoading(true);

    const file = e.target.files[0];
    const imgData = await readImage(file);
    setImgData(imgData);

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
  };


  return (
    <div className="flex flex-col items-center" style={{backgroundColor: "#282c34"}}>
      { isModelLoading && (<p className="text-white absolute top-1/2 left-1/2 -mt-10 -mr-10">LOADING</p>) }
      <div className="flex items-center justify-center border-4 border-white rounded-sm" style={{height: 700, minWidth: 200, position: 'relative'}}>
        {imgData && <img className="h-full" src={imgData} ref={imageRef} />}
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
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={onSelectImage}
      />
      <button onClick={openFilePicker} className="py-5 px-10 border-2 border-transparent bg-white text-yellow-600 hover:bg-transparent hover:text-blue hover:border-2 hover:border-solid hover:border-black">
        {isLoading ? "Recognizing..." : "Select Image"}
      </button>
    </div>
  );
}

export default ImageScan;