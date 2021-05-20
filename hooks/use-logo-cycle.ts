import React from "react";
import useInterval from "./use-interval";

export default function useLogoCycle(delay: number) {
  const [index, setIndex] = React.useState<number>(0);
  const logos = [
    `//statics.otomoto.pl/optimus-storage/a/otomotopl/images/logo.svg`,
    `//statics.autovit.ro/optimus-storage/a/autovitro/images/logo.svg`,
    `//statics.standvirtual.com/optimus-storage/a/carspt/images/logo.svg`,
  ];

  useInterval(() => {
    setIndex(index === logos.length - 1 ? 0 : index + 1);
  }, delay);

  return logos[index];
}
