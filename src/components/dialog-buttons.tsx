import styles from './dialog-buttons.module.css';

type DialogButtonParams = {
  children: React.ReactNode;
};

export function DialogButtons({ children }: DialogButtonParams): React.JSX.Element {
  return <div className={styles.buttons}>{children}</div>;
}
