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
    color: `#${string}`;
  };
};

export const getKnownColor = (computedColor: string): KnownColor => {
  const knownColor = Object.entries(colors).find(([_, { color }]) => color === computedColor);

  if (!knownColor) {
    throw new Error(`Could not find known color for: ${computedColor}`);
  }

  return knownColor[0] as KnownColor;
};

export const colors: Colors = {
  Black: {
    cssVariableName: '--black',
    color: '#000000',
  },
  Blue: {
    cssVariableName: '--blue',
    color: '#0000a5',
  },
  Green: {
    cssVariableName: '--green',
    color: '#00a600',
  },
  Cyan: {
    cssVariableName: '--cyan',
    color: '#00a6a5',
  },
  Red: {
    cssVariableName: '--red',
    color: '#a50000',
  },
  Magenta: {
    cssVariableName: '--magenta',
    color: '#a500a5',
  },
  Brown: {
    cssVariableName: '--brown',
    color: '#a55100',
  },
  White: {
    cssVariableName: '--white',
    color: '#a5a6a5',
  },
  Gray: {
    cssVariableName: '--gray',
    color: '#525152',
  },
  BrBlue: {
    cssVariableName: '--bright-blue',
    color: '#5251ff',
  },
  BrGreen: {
    cssVariableName: '--bright-green',
    color: '#52fb52',
  },
  BrCyan: {
    cssVariableName: '--bright-cyan',
    color: '#52fbff',
  },
  BrRed: {
    cssVariableName: '--bright-red',
    color: '#ff5152',
  },
  Pink: {
    cssVariableName: '--pink',
    color: '#ff51ff',
  },
  Yellow: {
    cssVariableName: '--yellow',
    color: '#fffb52',
  },
  BrWhite: {
    cssVariableName: '--bright-white',
    color: '#fffbff',
  },
};
