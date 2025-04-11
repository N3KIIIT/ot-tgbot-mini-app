import React, { useState, useEffect, useCallback } from 'react';
import HomePage from './pages/HomePage/HomePage';
import TestsPage from './pages/TestsPage/TestsPage';
import HelpPage from './pages/HelpPage/HelpPage';
import ResultsPage from './pages/ResultsPage/ResultsPage';
import CreateTestPage from './pages/CreateTestPage/CreateTestPage';
import EditTestPage from './pages/EditTestPage/EditTestPage';
import TakeTestPage from './pages/TakeTestPage/TakeTestPage';
import Navbar from './components/Navbar/Navbar';
import { useUser } from './context/UserContext'; // Используем хук useUser
import { fetchTestById } from './services/api';
import Loader from './components/Loader/Loader';
import styles from './App.module.css';

const App: React.FC = () => {
    const { currentUser, loadingUser, appError, isDevMode } = useUser(); // Получаем данные из контекста
    const [currentPage, setCurrentPage] = useState<string>('home');
    const [pageParams, setPageParams] = useState<any>(null);
    const [history, setHistory] = useState<string[]>(['home']);
    const [currentTestName, setCurrentTestName] = useState<string | null>(null);

    const webApp = window.Telegram?.WebApp;

    // Обработка кнопки "Назад"
    const handleGoBack = useCallback(() => {
        setHistory(prev => {
            if (prev.length <= 1) return prev;
            const newHistory = prev.slice(0, -1);
            const previousPage = newHistory[newHistory.length - 1];
            setCurrentPage(previousPage);
            setPageParams(null);
            return newHistory;
        });
    }, []);

    // Управление нативной кнопкой Telegram BackButton
     useEffect(() => {
        if (webApp && !isDevMode) { // Управляем только если есть SDK и не в dev режиме
            const tgBackButtonHandler = () => handleGoBack();

            if (history.length > 1) {
                 if (!webApp.BackButton.isVisible) {
                     webApp.BackButton.show();
                 }
                 webApp.onEvent('backButtonClicked', tgBackButtonHandler);
                 console.log("Telegram BackButton shown and handler attached");
            } else {
                 if (webApp.BackButton.isVisible) {
                     webApp.BackButton.hide();
                 }
                 webApp.offEvent('backButtonClicked', tgBackButtonHandler);
                 console.log("Telegram BackButton hidden and handler detached");
            }
            // Очистка при размонтировании компонента App (хотя он обычно не размонтируется)
            return () => {
                if (webApp.BackButton.isVisible) {
                    webApp.offEvent('backButtonClicked', tgBackButtonHandler);
                    webApp.BackButton.hide();
                     console.log("Cleaning up Telegram BackButton on App unmount");
                }
            };
        }
         // Если в dev режиме или нет webApp, ничего не делаем с нативной кнопкой
    }, [webApp, history.length, handleGoBack, isDevMode]);


    // Функция навигации
    const navigateTo = (page: string, params: any = null) => {
        setCurrentPage(page);
        setPageParams(params);
        setHistory(prev => {
            const lastPage = prev[prev.length - 1];
            const paramsChanged = JSON.stringify(pageParams) !== JSON.stringify(params);
            if (lastPage !== page || (lastPage === page && paramsChanged)) {
                return [...prev, page];
            }
            return prev;
        });
         window.scrollTo(0, 0);
    };

     // Загрузка имени теста для заголовка Navbar
    useEffect(() => {
        let isMounted = true;
        if ((currentPage === 'takeTest' || currentPage === 'editTest') && pageParams?.testId) {
             setCurrentTestName('Загрузка...');
             fetchTestById(pageParams.testId)
                .then(fetchedTest => {
                    if (isMounted && fetchedTest) setCurrentTestName(fetchedTest.testName);
                    else if (isMounted) setCurrentTestName('Тест не найден');
                })
                .catch(err => {
                    console.error("Ошибка загрузки имени теста для заголовка:", err);
                     if (isMounted) setCurrentTestName('Ошибка загрузки');
                });
        } else {
            setCurrentTestName(null);
        }
        return () => { isMounted = false; };
    }, [currentPage, pageParams]);


    // Определение заголовка для Navbar
    const getPageTitle = (): string => {
        switch (currentPage) {
            case 'home': return 'Главная';
            case 'tests': return 'Тесты';
            case 'results': return 'Мои результаты';
            case 'help': return 'Справка';
            case 'createTest': return 'Создание теста';
            case 'editTest': return currentTestName || 'Редактирование...';
            case 'takeTest': return currentTestName || 'Прохождение...';
            default: return 'Тесты';
        }
    };

    // --- Рендеринг ---
    const renderPage = () => {
        // Лоадер теперь в UserProvider
         if (loadingUser) {
            return <Loader message="Загрузка приложения..." />;
         }

        const errorBanner = appError ? <div className={styles.errorContainer}>{appError}</div> : null;
        let pageComponent: React.ReactNode;
        const isAuthorized = !!currentUser;
        const protectedPages = ['tests', 'results', 'createTest', 'editTest', 'takeTest'];

        if (protectedPages.includes(currentPage) && !isAuthorized) {
             pageComponent = <div className={styles.authError}>Необходима авторизация для доступа к этой странице. {isDevMode ? 'Проверьте настройки API или моковые данные.' : 'Пожалуйста, запустите приложение через Telegram.'}</div>;
        } else {
            switch (currentPage) {
                case 'home':
                    pageComponent = <HomePage navigateTo={navigateTo} />; // userName берется из контекста внутри HomePage
                    break;
                case 'tests':
                    pageComponent = <TestsPage navigateTo={navigateTo} />; // userId берется из контекста внутри TestsPage
                    break;
                case 'help':
                    pageComponent = <HelpPage />;
                    break;
                case 'results':
                    pageComponent = <ResultsPage />; // userId берется из контекста внутри ResultsPage
                    break;
                case 'createTest':
                    pageComponent = <CreateTestPage navigateTo={navigateTo} />;
                    break;
                case 'editTest':
                    if (pageParams?.testId) {
                        pageComponent = <EditTestPage navigateTo={navigateTo} testId={pageParams.testId} />;
                    } else {
                        pageComponent = <div className={styles.errorContainer}>Ошибка: Не указан ID теста для редактирования.</div>;
                    }
                    break;
                case 'takeTest':
                     if (pageParams?.testId) {
                        // Передаем userId, т.к. он нужен для отправки результата (хотя бэк может брать из initData)
                        pageComponent = <TakeTestPage navigateTo={navigateTo} testId={pageParams.testId} userId={currentUser?.id || null} />;
                    } else {
                        pageComponent = <div className={styles.errorContainer}>Ошибка: Не указан ID теста для прохождения.</div>;
                    }
                     break;
                default:
                     navigateTo('home');
                     pageComponent = <HomePage navigateTo={navigateTo} />;
            }
        }

         return (
            <>
                {errorBanner}
                <div className={styles.pageContentWrapper}>
                    {pageComponent}
                </div>
            </>
        );
    };

    const showBackButton = history.length > 1;

    // Если пользователь еще грузится, не рендерим остальное
    if (loadingUser) {
        // Можно вернуть null или базовую разметку без контента,
        // т.к. UserProvider уже показывает лоадер
        return null;
    }


    return (
        <div className={styles.appContainer}>
            {isDevMode && <div className={styles.devModeBanner}>Режим разработки</div>}
            <Navbar
                title={getPageTitle()}
                showBackButton={showBackButton}
                onBackClick={handleGoBack}
                isDevMode={isDevMode}
            />
            <main className={styles.mainContent}>
                {renderPage()}
            </main>
        </div>
    );
};

export default App;
