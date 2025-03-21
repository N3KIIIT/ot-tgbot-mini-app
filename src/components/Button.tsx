import React from 'react';

interface ButtonProps {
    onClick: () => void; // Обработчик нажатия
    label: string; // Текст кнопки
    backgroundColor?: string; // Цвет фона (опционально)
    color?: string; // Цвет текста (опционально)
}

const Button: React.FC<ButtonProps> = ({ onClick, label, backgroundColor = '#007bff', color = '#fff' }) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor,
                color,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
            }}
        >
            {label}
        </button>
    );
};

export default Button;