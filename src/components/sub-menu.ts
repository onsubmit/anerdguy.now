import { DialogType, OpenDialogArgs } from './dialog';

export type SubMenuParams = {
  closeMenu: () => void;
  topMenuButton: HTMLButtonElement | null;
  openDialog: <T extends DialogType>(args: OpenDialogArgs<T>) => void;
};
