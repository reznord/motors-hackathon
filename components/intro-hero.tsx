import useLogoCycle from "../hooks/use-logo-cycle";
import Button from "./button";
import CameraIcon from "./camera-icon";

export default function IntroHero() {
  const logo = useLogoCycle(4000);

  return (
    <section className="text-gray-600 body-font">
      <div
        className="text-gray-600 body-font bg-fixed bg-no-repeat bg-center h-screen fixed inset-0 opacity-20 z-0"
        bg-contain
        style={{ backgroundImage: "url(/intro-bg.png)" }}
      ></div>
      <div className="container px-5 py-24 mx-auto relative z-10">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="text-2xl font-medium title-font mb-4 text-gray-900">
            <div className="flex items-center flex-col leading-none justify-center">
              <img src={logo} className="h-8 mr-3" />
              <span>
                street <span className="line-through italic">view</span> scan
              </span>
            </div>
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Don't know anything about cars?
            <br />
            Your future next car might be close to you
            <br />
            Use your camera to find out relevant information about vehicles
            sourrounding you.
          </p>
        </div>
        <div className="flex w-full flex-col mx-auto px-8 items-center">
          <Button href="/camera" className="flex gap-2 items-center">
            <CameraIcon className="h-8 w-8" /> Let's do it!
          </Button>
        </div>
        <div className="bottom-5 fixed left-0 w-screen flex flex-col items-center">
          <em>We don't store this information.</em>
          <a href="#" className="text-blue-700">
            Want to know more?
          </a>
        </div>
      </div>
    </section>
  );
}
