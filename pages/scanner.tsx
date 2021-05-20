import { useCamera } from "../hooks/use-camera";

function Scanner() {
  const { video: videoRef, canvas: canvasRef } = useCamera();

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Scanner
          </h2>
          <div className="flex justify-center items-center mt-6">
            <video
              className="size rounded shadow-lg"
              autoPlay
              playsInline
              muted
              ref={videoRef}
              width="600"
              height="500"
            />
            <canvas className="size" ref={canvasRef} width="600" height="500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
