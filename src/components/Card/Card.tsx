import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void; // Добавляем возможность клика по карточке
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
    const cardClasses = [
        styles.card,
        onClick ? styles.clickable : '', // Добавляем класс, если карточка кликабельна
        className || ''
    ].join(' ').trim();

    return (
        <div className={cardClasses} onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;
