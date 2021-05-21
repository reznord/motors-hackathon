import { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import Buttom from "../components/button";
import { useImageDispatch } from "../context/image";
import { useRouter } from 'next/router'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment"
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const takeScreenshot = useImageDispatch();
  const router = useRouter();

  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      takeScreenshot(imageSrc);
      router.push("/image-scan");
    },
    [webcamRef]
  );

  return (
    <div style={{position: 'relative'}}>
      <Webcam
        style={{margin: 'auto', minWidth: '100%', minHeight: '100%', width: 'auto', height: 'auto', position: 'fixed', backgroundColor: 'black'}}
        audio={false}
        ref={webcamRef}
        allowFullScreen
        controls={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <Buttom
        onClick={capture}
        style={{position: 'fixed', zIndex: 1, bottom: 10, left: "calc(50% - 82px)"}}>
          I like this car
      </Buttom>
    </div>
  );
};

export default WebcamCapture;