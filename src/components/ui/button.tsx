import styles from './button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
}

export function Button({ text, onClick }: ButtonProps): React.JSX.Element {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {text}
    </button>
  );
}
