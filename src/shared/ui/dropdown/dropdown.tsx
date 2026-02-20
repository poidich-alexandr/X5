import clsx from 'clsx';
import { type ReactElement, useRef, useState } from 'react';

import { useCloseByEsc } from '../../hooks/use-close-by-esc';
import { useOutsideClick } from '../../hooks/use-outside-click';
import ArrowDown from './assets/arrdown.svg?react';
import cls from './dropdown.module.scss';
import { useMaxDropDownHeight } from './helpers/use-max-dropdown-height';

const DEFAULT_HEIGHT = 10;

export interface IDropDownOption {
  text: string;
  value: string;
}

export interface IDropdownProps {
  items: IDropDownOption[];
  initialOption: IDropDownOption;
  customArrowIcon?: ReactElement;
  leftIcon?: ReactElement;
  isDisabled?: boolean;
  clsRoot?: string;
  clsTrigger?: string;
  clsDropdown?: string;
  clsOptionItem?: string;
  onChange: (option: IDropDownOption) => void;
}

export const Dropdown = ({
  items,
  initialOption,
  isDisabled = false,
  customArrowIcon,
  leftIcon,
  clsRoot,
  clsTrigger,
  clsDropdown,
  clsOptionItem,
  onChange,
}: IDropdownProps) => {
  const [currentText, setCurrentText] = useState<string>(initialOption.text);
  const [isOpened, setIsOpened] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const maxDropDownHeight = useMaxDropDownHeight(isOpened, triggerRef);

  const closeMenu = () => setIsOpened(false);

  const handleTriggerButtonClick = () => {
    setIsOpened((prev) => !prev);
  };

  const handleOptionClick = (option: IDropDownOption) => {
    setCurrentText(option.text);
    closeMenu();

    onChange(option);
  };

  useCloseByEsc({ isWindowOpened: isOpened, onClose: closeMenu });
  useOutsideClick({ targetRef: rootRef, onOutsideClick: closeMenu });

  return (
    <div ref={rootRef} className={clsx(cls.root, clsRoot)}>
      <button
        className={clsx(cls.trigger, clsTrigger, {
          [cls.activeTrigger]: isOpened,
        })}
        ref={triggerRef}
        onClick={handleTriggerButtonClick}
        disabled={isDisabled}
        type="button"
      >
        {leftIcon && leftIcon}
        <span className={cls.triggerButtonText}>{currentText}</span>
        <div className={cls.triggerIcon}>{customArrowIcon ? customArrowIcon : <ArrowDown />}</div>
      </button>
      <div
        className={clsx(cls.dropdown, isOpened && cls.dropdownOpen, clsDropdown)}
        style={{ maxHeight: `${maxDropDownHeight ?? DEFAULT_HEIGHT}px` }}
      >
        <ul
          className={clsx(cls.menuList, isOpened && cls.listOpen)}
          style={{ gridTemplateRows: `repeat(${items.length}, 1fr)` }}
        >
          {items.map(({ text, value }) => (
            <li className={clsx(cls.optionItem, clsOptionItem)} key={value}>
              <button
                className={cls.optionButton}
                type="button"
                onClick={() => handleOptionClick({ text, value })}
                tabIndex={isOpened ? 0 : -1}
              >
                {text && (
                  <span
                    className={clsx(cls.optionButtonText, {
                      [cls.optionButtonTextActive]: text === currentText,
                    })}
                  >
                    {text}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
