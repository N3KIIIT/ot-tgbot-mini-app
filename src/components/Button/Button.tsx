import React from 'react';
import styles from './Button.module.css'; // Используем CSS Modules

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'link';
    loading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    loading = false,
    disabled,
    iconLeft,
    iconRight,
    className,
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant], // Применяем класс варианта
        loading ? styles.loading : '',
        className || '' // Добавляем внешние классы
    ].join(' ').trim();

    return (
        <button
            className={buttonClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className={styles.spinner}></span>}
            {iconLeft && !loading && <span className={styles.iconLeft}>{iconLeft}</span>}
            <span className={styles.content}>{children}</span>
            {iconRight && !loading && <span className={styles.iconRight}>{iconRight}</span>}
        </button>
    );
};

export default Button;
