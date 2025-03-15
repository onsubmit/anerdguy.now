import { DialogType } from './dialog';

export type SubMenuParams = {
  topMenuButton: HTMLButtonElement | null;
  closeMenu: () => void;
  openDialog: (type: DialogType, toFocusOnClose?: HTMLElement | null) => void;
};
