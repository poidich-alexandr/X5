import React, { useEffect, useState } from 'react';

import { useAdaptive } from '../../../hooks/use-adaptive';

export const useMaxDropDownHeight = (
  isOpened: boolean,
  triggerButtonRef: React.RefObject<HTMLButtonElement | null>
) => {
  const [maxMenuHeight, setMaxMenuHeight] = useState<number>(0);

  const isMobile = useAdaptive(750);
  const BOTTOM_DROPDOWN_OFFSET_PIXELS = isMobile ? 32 : 100;

  useEffect(() => {
    if (!isOpened && !triggerButtonRef.current) {
      return;
    }

    const calculate = () => {
      const selectButtonRect = triggerButtonRef.current!.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const availableSpace = Math.max(
        0, //кейс если низ элемента чуть ниже viewport, то беру 0
        windowHeight - selectButtonRect.bottom - BOTTOM_DROPDOWN_OFFSET_PIXELS
      );
      setMaxMenuHeight(availableSpace);
    };
    calculate();

    window.addEventListener('resize', calculate);
    window.addEventListener('scroll', calculate, true);

    return () => {
      window.removeEventListener('resize', calculate);
      window.removeEventListener('scroll', calculate, true);
    };
  }, [isOpened, triggerButtonRef, BOTTOM_DROPDOWN_OFFSET_PIXELS]);

  return maxMenuHeight;
};
