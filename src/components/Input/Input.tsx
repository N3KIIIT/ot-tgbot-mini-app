import React from 'react';
import styles from './Input.module.css'; // Используем CSS Modules

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    iconLeft?: React.ReactNode;
    containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    id,
    iconLeft,
    className,
    containerClassName,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substring(7)}`;

    return (
        <div className={`${styles.inputContainer} ${containerClassName || ''}`}>
            {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
            <div className={`${styles.inputWrapper} ${error ? styles.errorBorder : ''}`}>
                 {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
                <input
                    id={inputId}
                    className={`${styles.input} ${iconLeft ? styles.inputWithIcon : ''} ${className || ''}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
            </div>
            {error && <p id={`${inputId}-error`} className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default Input;
