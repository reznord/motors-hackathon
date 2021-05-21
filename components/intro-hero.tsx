import useLogoCycle from "../hooks/use-logo-cycle";
import Button from "./button";

export default function IntroHero() {
  const logo = useLogoCycle(4000);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 ">
            <div className="flex items-center flex-row leading-none justify-center">
              <img src={logo} className="h-8" />
              <span>'s Street View</span>
            </div>
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Did you know your future next car might be close to you? <br />
            Don't know anything about cars? <br />
            Use your camera to find out relevant information about vehicles
            sourrounding you.
          </p>
        </div>
        <div className="flex w-full flex-col mx-auto px-8 space-y-4 items-center">
          <Button href="/scanner">That sounds cool. Let's do this!</Button>
        </div>
      </div>
    </section>
  );
}
