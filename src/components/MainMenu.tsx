import React from 'react';
import Button from './Button'; // Используем компонент Button

interface MainMenuProps {
    onTestsClick: () => void; // Обработчик для кнопки "Тесты"
    onInfoClick: () => void; // Обработчик для кнопки "Информационный материал"
}

var MainMenu: React.FC<MainMenuProps> = ({ onTestsClick, onInfoClick }) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
            {/* Приветствие */}
            <h1>Добро пожаловать!</h1>
            <p>Выберите раздел, чтобы продолжить:</p>

            {/* Кнопка "Тесты" */}
            <div style={{ marginBottom: '10px' }}>
                <Button
                    onClick={onTestsClick}
                    label="Тесты"
                    backgroundColor="#007bff"
                    color="#fff"
                />
            </div>

            {/* Кнопка "Информационный материал" */}
            <div>
                <Button
                    onClick={onInfoClick}
                    label="Информационный материал"
                    backgroundColor="#28a745"
                    color="#fff"
                />
            </div>
        </div>
    );
};

export default MainMenu;