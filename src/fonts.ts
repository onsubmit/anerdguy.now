export const fontNames = [
  'Inconsolata',
  'JetBrains Mono',
  'Roboto Mono',
  'Source Code Pro',
  'VT323',
] as const;
export type FontName = (typeof fontNames)[number];

export const fontSizes = ['8', '10', '12', '16', '24', '32'] as const;
export type FontSize = (typeof fontSizes)[number];

type FontCssUrls = {
  [T in FontName]: string;
};

export const fontCssUrls = {
  Inconsolata: 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap',
  'JetBrains Mono':
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap',
  'Roboto Mono':
    'https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap',
  'Source Code Pro':
    'https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap',
  VT323: 'https://fonts.googleapis.com/css2?family=VT323&display=swap',
} as const satisfies FontCssUrls;
