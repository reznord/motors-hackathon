import { createContext, useState, useContext } from "react";

type State = string;

type Dispatch = (image: string) => void;

const ImageStateContext = createContext<State | undefined | null>(null);
const ImageDispatchContext = createContext<Dispatch | undefined | null>(null);

type ImageProviderProps = {
  children: React.ReactChild;
  image?: string;
};

function ImageProvider({ children, image }: ImageProviderProps) {
  const [state, dispatch] = useState(image ?? null);

  return (
    <ImageStateContext.Provider value={state}>
      <ImageDispatchContext.Provider value={dispatch}>
        {children}
      </ImageDispatchContext.Provider>
    </ImageStateContext.Provider>
  );
}

function useImageState(): React.ContextType<typeof ImageStateContext> {
  const context = useContext(ImageStateContext);

  return context;
}

function useImageDispatch(): React.ContextType<typeof ImageDispatchContext> {
  const context = useContext(ImageDispatchContext);

  return context;
}

export { ImageProvider, useImageState, useImageDispatch };
