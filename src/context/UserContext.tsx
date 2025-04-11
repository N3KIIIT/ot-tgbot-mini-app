import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types/model';
import { getOrCreateUser } from '../services/api';
import Loader from '../components/Loader/Loader'; // Импортируем Loader

// Определяем режим разработки
const isDevMode = window.Telegram?.WebApp.initDataUnsafe.user === undefined;

// Моковый пользователь для случая, когда API недоступен в dev режиме
const mockDevUser: User = {
    id: '38EA9F6F-2CB2-4E14-A6CF-F81F6B983E38',
    login: 'developer',
    name: { first: 'Dev', last: 'Browser' }
};

interface UserContextType {
    currentUser: User | null;
    loadingUser: boolean;
    appError: string | null; // Ошибка инициализации/получения пользователя
    isDevMode: boolean;
}

// Создаем контекст с начальными значениями
export const UserContext = createContext<UserContextType>({
    currentUser: null,
    loadingUser: true,
    appError: null,
    isDevMode: isDevMode,
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const [appError, setAppError] = useState<string | null>(null);
    const webApp = window.Telegram?.WebApp;

    useEffect(() => {
        const initializeApp = async () => {
            setLoadingUser(true);
            setAppError(null);

            if (webApp.initDataUnsafe.user !== undefined) {
                // --- Режим Telegram ---
                console.log("UserProvider: Telegram WebApp SDK found.");
                webApp.ready(); // Готовность лучше объявлять здесь
                webApp.expand();

                try {
                    const telegram = window.Telegram?.WebApp.initDataUnsafe.user
                    const tgUser : User = {
                        id: '',
                        name: {
                            first: telegram!.first_name,
                            last: telegram?.last_name
                        },
                        login: telegram!.username,
                    }
                    const user = await getOrCreateUser(tgUser);
                    setCurrentUser(user);
                    console.log("UserProvider: User fetched/created via API:", user);
                } catch (err) {
                    console.error("UserProvider: Ошибка получения пользователя через API:", err);
                    setAppError(`Не удалось идентифицировать пользователя: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
                    setCurrentUser(null);
                }

                // Установка темы Telegram (можно делать и в App.tsx, но здесь тоже логично)
                 if (webApp.themeParams.bg_color) {
                    document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.themeParams.bg_color);
                 }
                 if (webApp.themeParams.text_color) {
                    document.documentElement.style.setProperty('--tg-theme-text-color', webApp.themeParams.text_color);
                 }
                 // ... другие переменные ...
                 webApp.setHeaderColor(webApp.themeParams.secondary_bg_color || '#ffffff');

            } else {
                // --- Режим Разработки (Браузер) ---
                console.warn('UserProvider: Telegram WebApp SDK не найден. Запуск в режиме разработки (Dev Mode).');
                try {
                    const user = await getOrCreateUser(mockDevUser);
                    setCurrentUser(user);
                    console.log("UserProvider (Dev Mode): User fetched via API:", user);
                    setAppError("Режим разработки: Функционал API может быть ограничен.");
                } catch (err) {
                    console.error("UserProvider (Dev Mode): Ошибка получения пользователя через API, используем мок:", err);
                    setCurrentUser(mockDevUser);
                    setAppError("Режим разработки (API недоступен): Используются моковые данные пользователя.");
                }
            }
             setLoadingUser(false);
        };

        initializeApp();

    }, [webApp]); // Зависимость только от webApp

    // Пока пользователь загружается, можно показать глобальный лоадер
    if (loadingUser) {
         // Можно вернуть стилизованный лоадер на весь экран
         return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <Loader message="Загрузка приложения..." />
                </div>;
    }

    return (
        <UserContext.Provider value={{ currentUser, loadingUser, appError, isDevMode }}>
            {children}
        </UserContext.Provider>
    );
};

// Хук для удобного использования контекста
export const useUser = (): UserContextType => useContext(UserContext);
