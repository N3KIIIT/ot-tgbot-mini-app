import React from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    id,
    className,
    containerClassName,
    ...props
}) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(7)}`;

    return (
        <div className={`${styles.textareaContainer} ${containerClassName || ''}`}>
            {label && <label htmlFor={textareaId} className={styles.label}>{label}</label>}
            <textarea
                id={textareaId}
                className={`${styles.textarea} ${error ? styles.errorBorder : ''} ${className || ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${textareaId}-error` : undefined}
                {...props}
            />
            {error && <p id={`${textareaId}-error`} className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default Textarea;
