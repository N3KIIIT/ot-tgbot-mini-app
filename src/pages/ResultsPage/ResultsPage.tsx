import React, { useState, useEffect } from 'react';
import { TestResult } from '../../types/model';
import { fetchUserResults } from '../../services/api';
import Card from '../../components/Card/Card';
import Loader from '../../components/Loader/Loader';
import { useUser } from '../../context/UserContext'; // Импортируем хук
import styles from './ResultsPage.module.css';

interface ResultsPageProps {
   // userId больше не нужен
}

const ResultsPage: React.FC<ResultsPageProps> = () => {
    const { currentUser, isDevMode } = useUser(); // Получаем пользователя и режим
    const userId = currentUser?.id || null;
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadResults = async () => {
             if (!userId && !isDevMode) {
                setError("Не удалось определить пользователя для загрузки результатов.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const idToSend = userId || (isDevMode ? 'dev' : ''); // ID для API
                const fetchedResults = await fetchUserResults(idToSend);
                fetchedResults.sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime());
                setResults(fetchedResults);
            } catch (err) {
                console.error("Ошибка загрузки результатов:", err);
                setError(`Не удалось загрузить результаты: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
            } finally {
                setLoading(false);
            }
        };

        // Загружаем только если есть ID пользователя или мы в dev режиме
        if (userId || isDevMode) {
             loadResults();
        } else {
             // Если нет пользователя и не dev режим - не загружаем
             setLoading(false);
             setError("Пользователь не авторизован.");
        }

    }, [userId, isDevMode]); // Зависим от userId и isDevMode

    const formatDate = (date: Date | string): string => {
        return new Date(date).toLocaleString('ru-RU', {
             year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    return (
        <div className={styles.resultsPage}>
            {loading && <Loader message="Загрузка результатов..." />}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && !error && results.length === 0 && (
                <p className={styles.noResults}>Вы еще не прошли ни одного теста.</p>
            )}

            {!loading && !error && results.length > 0 && (
                <div className={styles.resultsList}>
                    {results.map((result) => (
                        <Card key={result.id} className={styles.resultCard}>
                            <h3>{result.test.testName}</h3>
                            <p className={styles.score}>
                                Ваш результат:
                                <span className={styles.correctCount}>{result.result.correctQuestionsCount}</span>
                                /
                                <span className={styles.totalCount}>{result.result.testQuestionsCount}</span>
                            </p>
                            <p className={styles.date}>
                                Пройдено: {formatDate(result.takenAt)}
                            </p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultsPage;
