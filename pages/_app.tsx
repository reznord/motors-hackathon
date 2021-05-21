import "../styles/globals.css";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

import { ImageProvider } from "../context/image";

function MyApp({ Component, pageProps }) {
  return (
    <ImageProvider>
      <Component {...pageProps} />
    </ImageProvider>
  );
}

export default MyApp;
