import { KnownColor, knownColors } from './colors';
import { OptionsList } from './option-list';

type ColorOptionListParams = {
  selectedColor: KnownColor;
  setSelectedColor: React.Dispatch<React.SetStateAction<KnownColor>>;
  onSelectedColorChange?: (color: KnownColor) => void;
  refocus: boolean;
};

export function ColorOptionList({
  selectedColor,
  setSelectedColor,
  onSelectedColorChange,
  refocus,
}: ColorOptionListParams): React.JSX.Element {
  return (
    <OptionsList
      selectedOption={selectedColor}
      setSelectedOption={setSelectedColor}
      onSelectionChange={onSelectedColorChange}
      options={knownColors}
      refocus={refocus}
    ></OptionsList>
  );
}
