import { useEffect } from 'react';

export const useCloseByEsc = ({
  onClose,
  isWindowOpened = true,
}: {
  onClose: () => void;
  isWindowOpened?: boolean;
}): void => {
  useEffect(() => {
    const closeByEsc = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        onClose();
      }
    };

    if (isWindowOpened) {
      document.addEventListener('keydown', closeByEsc);
    }

    return () => {
      document.removeEventListener('keydown', closeByEsc);
    };
  }, [onClose, isWindowOpened]);
};
