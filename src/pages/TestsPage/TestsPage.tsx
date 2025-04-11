import React, { useState, useEffect } from 'react';
import { Test } from '../../types/model';
import { fetchTests, deleteTest } from '../../services/api';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { useUser } from '../../context/UserContext'; // Импортируем хук
import styles from './TestsPage.module.css';

interface TestsPageProps {
    navigateTo: (page: string, params?: any) => void;
    // userId больше не нужен как проп
}

const TestsPage: React.FC<TestsPageProps> = ({ navigateTo }) => {
    const { currentUser, isDevMode } = useUser(); // Получаем пользователя и режим из контекста
    const userId = currentUser?.id || null; // Получаем ID текущего пользователя
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const loadTests = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedTests = await fetchTests();
                setTests(fetchedTests);
            } catch (err) {
                console.error("Ошибка загрузки тестов:", err);
                setError(`Не удалось загрузить тесты: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
            } finally {
                setLoading(false);
            }
        };
        loadTests();
    }, []);

    const handleDelete = async (testId: string) => {
        const webApp = window.Telegram?.WebApp;
        const confirmDeletion = async () => {
            setDeletingId(testId);
            setError(null);
            try {
                const success = await deleteTest(testId);
                if (success) {
                    setTests(prevTests => prevTests.filter(test => test.id !== testId));
                    webApp?.HapticFeedback?.notificationOccurred('success'); // Используем optional chaining
                } else {
                    const message = 'Не удалось удалить тест (возможно, он уже удален).';
                    if (webApp) webApp.showAlert(message); else alert(message); // Фоллбэк alert
                }
            } catch (err) {
                console.error("Ошибка удаления теста:", err);
                const message = `Не удалось удалить тест: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`;
                setError(message);
                if (webApp) webApp.showAlert(message); else alert(message); // Фоллбэк alert
            } finally {
                setDeletingId(null);
            }
        };

        const message = 'Вы уверены, что хотите удалить этот тест?';
        if (webApp) {
             webApp.showConfirm(message, (confirmed) => {
                 if (confirmed) {
                    confirmDeletion();
                 }
             });
        } else {
            // Фоллбэк для браузера
            if (window.confirm(message)) { // Фоллбэк confirm
                 confirmDeletion();
            }
        }
    };

    // Обработчик клика по карточке теста
    const handleCardClick = (testId: string) => {
        navigateTo('takeTest', { testId: testId });
    };

    // Обработчик клика по кнопкам внутри карточки (чтобы не триггерить клик карточки)
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Останавливаем всплытие события
    };


    return (
        <div className={styles.testsPage}>
            <div className={styles.header}>
                 <span/>
                 <Button variant="primary" onClick={() => navigateTo('createTest')}>
                     Создать новый тест
                 </Button>
            </div>

            {loading && !deletingId && <Loader message="Загрузка тестов..." />}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && tests.length === 0 && !error && (
                <p className={styles.noTests}>Пока нет доступных тестов. Создайте первый!</p>
            )}

            {tests.length > 0 && (
                <div className={styles.testList}>
                    {tests.map((test) => (
                        <Card
                            key={test.id}
                            className={styles.testCard}
                            onClick={() => handleCardClick(test.id)} // Клик по карточке
                        >
                            <div className={styles.testInfo}>
                                <h3>{test.testName}</h3>
                                <p>{test.testDescription}</p>
                                {test.createdBy && (
                                     <small>Создал: {test.createdBy.name.first} {test.createdBy.name.last} ({test.createdBy.login})</small>
                                )}
                            </div>
                            {/* Кнопки редактирования/удаления */}
                            {test.createdBy?.id === userId && (
                                <div className={styles.testActions}>
                                    <Button
                                        variant="secondary"
                                        onClick={(e) => { handleButtonClick(e); navigateTo('editTest', { testId: test.id }); }}
                                        className={styles.actionButton}
                                        disabled={!!deletingId}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={(e) => { handleButtonClick(e); handleDelete(test.id); }}
                                        className={styles.actionButton}
                                        loading={deletingId === test.id}
                                        disabled={!!deletingId && deletingId !== test.id}
                                    >
                                        Удалить
                                    </Button>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestsPage;
