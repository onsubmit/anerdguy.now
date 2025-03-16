import { DialogType } from './dialog';

export type SubMenuParams = {
  closeMenu: () => void;
  openDialog: (type: DialogType, toFocusOnClose?: HTMLElement | null) => void;
  topMenuButton: HTMLButtonElement | null;
};
