import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    containerClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    id,
    className,
    containerClassName,
    checked,
    ...props
}) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(7)}`;

    // Добавляем класс 'selected' к контейнеру, если чекбокс выбран
    const containerClasses = [
        styles.checkboxContainer,
        checked ? styles.selected : '',
        containerClassName || ''
    ].join(' ').trim();


    return (
        // Оборачиваем в label, чтобы клик по всей области работал
        <label htmlFor={checkboxId} className={containerClasses}>
            <input
                id={checkboxId}
                type="checkbox"
                className={`${styles.checkbox} ${className || ''}`}
                checked={checked}
                {...props}
            />
            <span className={styles.label}>{label}</span>
        </label>
    );
};

export default Checkbox;
