import { useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import Buttom from "../components/button";
import { useImageDispatch } from "../context/image";
import { useRouter } from "next/router";
import ThumbsUpIcon from "../components/thumbs-up-icon";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment",
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const takeScreenshot = useImageDispatch();
  const router = useRouter();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    takeScreenshot(imageSrc);
    router.push("/image-scan");
  }, [webcamRef]);

  useEffect(() => {
    router.prefetch("/image-scan");
  }, []);

  return (
    <div className="relative">
      <img
        src="/carmageddon-transparent.png"
        className="fixed top-1 left-1/2 -ml-16 z-10 top-4"
        width="150px"
      />
      <Webcam
        style={{
          margin: "auto",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          position: "fixed",
          backgroundColor: "black",
        }}
        audio={false}
        ref={webcamRef}
        allowFullScreen
        controls={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <div className="flex w-full flex-col items-center mt-2 fixed z-10 bottom-14">
        <Buttom onClick={capture} RightIcon={ThumbsUpIcon}>
          I like this car
        </Buttom>
      </div>
    </div>
  );
};

export default WebcamCapture;
