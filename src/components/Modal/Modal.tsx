import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import Button from '../Button/Button'; // Предполагаем, что есть компонент Button

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode; // Для кнопок или другого контента в футере
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    useEffect(() => {
        // Закрытие по Esc
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Блокируем скролл фона
        } else {
            document.body.style.overflow = ''; // Восстанавливаем скролл
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = ''; // Убедимся, что скролл восстановлен при размонтировании
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    // Закрытие по клику на оверлей
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    {title && <h2 className={styles.title}>{title}</h2>}
                    <button onClick={onClose} className={styles.closeButton} aria-label="Закрыть">
                        &times; {/* Крестик */}
                    </button>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
                {footer && (
                    <div className={styles.footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
