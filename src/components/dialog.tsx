import { useRef } from 'react';

import styles from './dialog.module.css';

export type DialogType = 'color' | 'color-help' | 'about';

type DialogParams = {
  title: string;
  children: React.ReactNode;
  open: boolean;
};

export function Dialog({ title, children, open }: DialogParams): React.JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);

  dialogRef.current?.[open ? 'showModal' : 'close']();

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <div className={styles.title}>{title}</div>
      {children}
    </dialog>
  );
}
