import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import TestsPage from './components/TestsPage';
import InfoPage from './components/InfoPage';

const TelegramApp: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<'main' | 'tests' | 'info'>('main');

    // Обработчики для кнопок главного меню
    const handleTestsClick = () => {
        setCurrentScreen('tests');
    };

    const handleInfoClick = () => {
        setCurrentScreen('info');
    };

    // Обработчик для кнопки "Назад"
    const handleBackClick = () => {
        setCurrentScreen('main');
    };

    return (
        <div>
            {/* Отображаем главное меню, если текущий экран - main */}
            {currentScreen === 'main' && (
                <MainMenu
                    onTestsClick={handleTestsClick}
                    onInfoClick={handleInfoClick}
                />
            )}

            {/* Отображаем страницу "Тесты", если текущий экран - tests */}
            {currentScreen === 'tests' && (
               <TestsPage onBack={handleBackClick} />
            )}

            {/* Отображаем страницу "Информационный материал", если текущий экран - info */}
            {currentScreen === 'info' && (
                <InfoPage onBack={handleBackClick} />
            )}
        </div>
    );
};

export default TelegramApp;