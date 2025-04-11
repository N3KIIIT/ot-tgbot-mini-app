import React from 'react';
import styles from './Navbar.module.css';
import Button from '../Button/Button';

interface NavbarProps {
    title: string;
    showBackButton: boolean; // Показывать ли кнопку "Назад"
    onBackClick: () => void; // Функция для кнопки "Назад"
    isDevMode: boolean; // Режим разработки для условного рендеринга кнопки
}

const Navbar: React.FC<NavbarProps> = ({ title, showBackButton, onBackClick, isDevMode }) => {
    // Показываем кастомную кнопку "Назад" только в DevMode
    const shouldShowCustomBack = showBackButton && isDevMode;

    return (
        <nav className={styles.navbar}>
            <div className={styles.left}>
                {shouldShowCustomBack && (
                    <Button
                        onClick={onBackClick}
                        variant="secondary" // или link
                        className={styles.backButton}
                        aria-label="Назад"
                    >
                        {/* Можно использовать иконку */}
                        &lt; Назад
                    </Button>
                )}
            </div>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.right}>
                {/* Placeholder for potential future actions */}
            </div>
        </nav>
    );
};

export default Navbar;
