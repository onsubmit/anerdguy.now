import { RefObject } from 'react';

import { KnownColor, knownColors } from './colors';
import { OptionListOperations, OptionsList } from './option-list';

type ColorOptionListParams = {
  selectedColor: KnownColor;
  setSelectedColor: React.Dispatch<React.SetStateAction<KnownColor>>;
  onSelectedColorChange?: (color: KnownColor) => void;
  ref?: RefObject<OptionListOperations<KnownColor> | null>;
};

export function ColorOptionList({
  selectedColor,
  setSelectedColor,
  onSelectedColorChange,
  ref,
}: ColorOptionListParams): React.JSX.Element {
  return (
    <OptionsList
      ref={ref}
      selectedOption={selectedColor}
      setSelectedOption={setSelectedColor}
      onSelectionChange={onSelectedColorChange}
      options={knownColors}
    ></OptionsList>
  );
}
