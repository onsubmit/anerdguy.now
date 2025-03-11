export const knownColors = [
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
] as const;

export type KnownColor = (typeof knownColors)[number];

type Colors = {
  [C in KnownColor]: {
    cssVariableName: `--${string}`;
  };
};

export const colors: Colors = {
  Black: {
    cssVariableName: '--black',
  },
  Blue: {
    cssVariableName: '--blue',
  },
  Green: {
    cssVariableName: '--green',
  },
  Cyan: {
    cssVariableName: '--cyan',
  },
  Red: {
    cssVariableName: '--red',
  },
  Magenta: {
    cssVariableName: '--magenta',
  },
  Brown: {
    cssVariableName: '--brown',
  },
  White: {
    cssVariableName: '--white',
  },
  Gray: {
    cssVariableName: '--gray',
  },
  BrBlue: {
    cssVariableName: '--bright-blue',
  },
  BrGreen: {
    cssVariableName: '--bright-green',
  },
  BrCyan: {
    cssVariableName: '--bright-cyan',
  },
  BrRed: {
    cssVariableName: '--bright-red',
  },
  Pink: {
    cssVariableName: '--pink',
  },
  Yellow: {
    cssVariableName: '--yellow',
  },
  BrWhite: {
    cssVariableName: '--bright-white',
  },
};
