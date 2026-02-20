import { type RefObject, useEffect } from 'react';

export const useOutsideClick = ({
  targetRef,
  onOutsideClick,
}: {
  targetRef: RefObject<HTMLElement | null>;
  isTargetRefOpened?: boolean;
  onOutsideClick: () => void;
}) => {
  useEffect(() => {
    const handleOutsideClick = (evt: MouseEvent) => {
      if (
        targetRef.current &&
        !targetRef.current.contains(evt.target as Node)
      ) {
        onOutsideClick();
      }
    };
    document.addEventListener('click', handleOutsideClick);

    return () => document.removeEventListener('click', handleOutsideClick);
  }, [targetRef, onOutsideClick]);
};
