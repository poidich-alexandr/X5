import clsx from 'clsx';
import { type ReactElement, useEffect, useId, useMemo, useRef, useState } from 'react';

import { useCloseByEsc } from '../../hooks/use-close-by-esc';
import { useOutsideClick } from '../../hooks/use-outside-click';
// import ArrowDown from './assets/arrdown.svg?react';
// import  ArrowDown  from './assets/arrdown.svg';
import cls from './dropdown.module.scss';
import { useMaxDropDownHeight } from './helpers/use-max-dropdown-height';

const DEFAULT_HEIGHT = 10;
const MAX_AVAILABLE_SPACE_BOTTOM = 200;

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
  ariaLabel?: string;
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
  ariaLabel,
  onChange,
}: IDropdownProps) => {
  const [currentText, setCurrentText] = useState<string>(initialOption.text);
  const [isOpened, setIsOpened] = useState(false);

  // активная (подсвеченная) опция для навигации клавиатурой
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const dropdownId = useId();

  const maxDropDownHeight = useMaxDropDownHeight(isOpened, triggerRef);
  const shouldReverseDropDirection = maxDropDownHeight < MAX_AVAILABLE_SPACE_BOTTOM;

  const selectedOptionIndex = useMemo(() => {
    const foundIndex = items.findIndex((option) => option.text === currentText);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [items, currentText]);

  const closeMenu = () => setIsOpened(false);

  const openMenu = () => setIsOpened(true);

  const clampIndex = (index: number) => {
    if (items.length === 0) return 0;
    return Math.min(Math.max(index, 0), items.length - 1);
  };

  const focusOptionButton = (index: number) => {
    const safeIndex = clampIndex(index);
    optionButtonRefs.current[safeIndex]?.focus();
  };

  const applySelection = (index: number) => {
    const safeIndex = clampIndex(index);
    const option = items[safeIndex];
    if (!option) return;

    setCurrentText(option.text);
    onChange(option);
    closeMenu();
    // возвращаю фокус на триггер после выбора
    triggerRef.current?.focus();
  };

  // клики
  const handleTriggerButtonClick = () => {
    setIsOpened((previous) => !previous);
  };

  const handleOptionClick = (option: IDropDownOption) => {
    setCurrentText(option.text);
    closeMenu();
    onChange(option);
    triggerRef.current?.focus();
  };

  // клавиатура на триггере
  const handleTriggerKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (isDisabled) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      if (!isOpened) {
        openMenu();
        const nextActiveIndex = selectedOptionIndex;
        setActiveOptionIndex(nextActiveIndex);
        // фокус переведю в useEffect после открытия
      } else {
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        const nextActiveIndex = clampIndex(activeOptionIndex + delta);
        setActiveOptionIndex(nextActiveIndex);
        focusOptionButton(nextActiveIndex);
      }
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      // Enter/Space на триггере: открыть/закрыть
      event.preventDefault();
      setIsOpened((previous) => !previous);
      return;
    }
  };

  // Клавиатура внутри списка
  const handleListKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (event) => {
    if (!isOpened) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      triggerRef.current?.focus();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const nextActiveIndex = clampIndex(activeOptionIndex + delta);
      setActiveOptionIndex(nextActiveIndex);
      focusOptionButton(nextActiveIndex);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveOptionIndex(0);
      focusOptionButton(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      const lastIndex = Math.max(0, items.length - 1);
      setActiveOptionIndex(lastIndex);
      focusOptionButton(lastIndex);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      applySelection(activeOptionIndex);
    }
  };

  const handleRootBlurCapture: React.FocusEventHandler<HTMLDivElement> = (event) => {
    const nextFocusedElement = event.relatedTarget as Node | null;

    // если фокус пропал или ушёл на соседский dropdown или в сторону - закрываю
    if (!nextFocusedElement || !rootRef.current?.contains(nextFocusedElement)) {
      closeMenu();
    }
  };

  useCloseByEsc({ isWindowOpened: isOpened, onClose: closeMenu });
  useOutsideClick({ targetRef: rootRef, onOutsideClick: closeMenu });

  // При открытии выставляю активную опцию на текущую выбранную + фокусируюсь на ней
  useEffect(() => {
    if (!isOpened) return;

    const nextActiveIndex = selectedOptionIndex;
    setActiveOptionIndex(nextActiveIndex);

    // на следующий тик, когда кнопки уже в DOM
    queueMicrotask(() => {
      focusOptionButton(nextActiveIndex);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened]);

  // Синхронизирую текст, когда initialOption меняется снаружи
  useEffect(() => {
    setCurrentText(initialOption.text);
  }, [initialOption.text]);

  const activeOptionId = `${dropdownId}-option-${activeOptionIndex}`;

  return (
    <div ref={rootRef} className={clsx(cls.root, clsRoot)} onBlurCapture={handleRootBlurCapture}>
      <button
        className={clsx(cls.trigger, clsTrigger, {
          [cls.activeTrigger]: isOpened,
        })}
        ref={triggerRef}
        onClick={handleTriggerButtonClick}
        onKeyDown={handleTriggerKeyDown}
        disabled={isDisabled}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpened}
        aria-haspopup="listbox"
        aria-controls={`${dropdownId}-listbox`}
      >
        {leftIcon && leftIcon}
        <span className={cls.triggerButtonText}>{currentText}</span>
        <div className={cls.triggerIcon}>{customArrowIcon ? customArrowIcon : ""}</div>
      </button>

      <div
        className={clsx(
          cls.dropdown,
          shouldReverseDropDirection && cls.dropup,
          isOpened && cls.dropdownOpen,
          clsDropdown
        )}
        style={{ maxHeight: `${maxDropDownHeight ?? DEFAULT_HEIGHT}px` }}
      >
        <ul
          id={`${dropdownId}-listbox`}
          className={clsx(cls.menuList, isOpened && cls.listOpen)}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={isOpened ? activeOptionId : undefined}
          onKeyDown={handleListKeyDown}
          style={{ gridTemplateRows: `repeat(${items.length}, 1fr)` }}
        >
          {items.map(({ text, value }, index) => {
            const isSelected = text === currentText;
            const optionId = `${dropdownId}-option-${index}`;

            return (
              <li className={clsx(cls.optionItem, clsOptionItem)} key={value}>
                <button
                  ref={(node) => {
                    optionButtonRefs.current[index] = node;
                  }}
                  className={cls.optionButton}
                  type="button"
                  id={optionId}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleOptionClick({ text, value })}
                  tabIndex={isOpened ? (index === activeOptionIndex ? 0 : -1) : -1}
                >
                  {text && (
                    <span
                      className={clsx(cls.optionButtonText, {
                        [cls.optionButtonTextActive]: isSelected,
                      })}
                    >
                      {text}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
