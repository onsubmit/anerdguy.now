import { OptionsList } from './option-list';

type ColorOptionListParams = {
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
};

export function ColorOptionList({
  selectedColor,
  setSelectedColor,
}: ColorOptionListParams): React.JSX.Element {
  return (
    <OptionsList
      selectedOption={selectedColor}
      setSelectedOption={setSelectedColor}
      options={[
        'Black',
        'Blue',
        'Green',
        'Cyan',
        'Red',
        'Magenta',
        'Brown',
        'White',
        'Gray',
        'BrBlue',
        'BrGreen',
        'BrCyan',
        'BrRed',
        'Pink',
        'Yellow',
        'BrWhite',
      ]}
    ></OptionsList>
  );
}
