import React, { useState, useEffect, useCallback } from 'react';
import { Test, UserAnswers, Question as QuestionType } from '../../types/model';
import { fetchTestById, saveTestResult } from '../../services/api';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import Loader from '../../components/Loader/Loader';
import Card from '../../components/Card/Card';
import styles from './TakeTestPage.module.css';

// Определяем режим разработки (если нет SDK Telegram)
const isDevMode = window.Telegram?.WebApp.initDataUnsafe.user == undefined;

interface TakeTestPageProps {
    navigateTo: (page: string, params?: any) => void;
    testId: string;
    userId: string | null; // ID пользователя для сохранения результата (хотя бэк может брать из initData)
}

const TakeTestPage: React.FC<TakeTestPageProps> = ({ navigateTo, testId, userId }) => {
    const [test, setTest] = useState<Test | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const webApp = window.Telegram?.WebApp; // Получаем доступ к webApp

    // Загрузка данных теста (без изменений)
    useEffect(() => {
        const loadTest = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedTest = await fetchTestById(testId);
                if (fetchedTest) {
                    setTest(fetchedTest);
                    const initialAnswers: UserAnswers = {};
                    fetchedTest.questions.forEach(q => { initialAnswers[q.id] = []; });
                    setUserAnswers(initialAnswers);
                } else {
                    setError("Тест не найден.");
                }
            } catch (err) {
                console.error("Ошибка загрузки теста:", err);
                setError(`Не удалось загрузить тест: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
            } finally {
                setLoading(false);
            }
        };
        loadTest();
    }, [testId]);

    // Обработчик изменения выбора ответа (без изменений)
    const handleAnswerChange = (questionId: string, answerId: string, isChecked: boolean) => {
        setUserAnswers(prevAnswers => {
            const currentAnswers = prevAnswers[questionId] || [];
            let newAnswers;
            if (isChecked) {
                newAnswers = currentAnswers.includes(answerId) ? currentAnswers : [...currentAnswers, answerId];
            } else {
                newAnswers = currentAnswers.filter(id => id !== answerId);
            }
            return { ...prevAnswers, [questionId]: newAnswers };
        });
    };

    // Проверка, все ли вопросы отвечены (без изменений)
    const allQuestionsAnswered = useCallback((): boolean => {
        if (!test) return false;
        return test.questions.every(q => (userAnswers[q.id]?.length ?? 0) > 0);
    }, [test, userAnswers]);


    // Отправка результатов
    const handleSubmit = async () => {
        if (!test || (!userId && !isDevMode) || !allQuestionsAnswered()) return;

        setSubmitting(true);
        setError(null);
        try {
            await saveTestResult(testId, userAnswers);
            webApp?.HapticFeedback?.notificationOccurred('success'); // Optional chaining
            navigateTo('results');
        } catch (err) {
            console.error("Ошибка сохранения результата:", err);
            setError(`Не удалось сохранить результат: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
            webApp?.HapticFeedback?.notificationOccurred('error'); // Optional chaining
        } finally {
            setSubmitting(false);
        }
    };

    // --- Telegram Main Button (без изменений) ---
    useEffect(() => {
        if (!webApp || !test) return;
        const mainButtonClickHandler = () => { handleSubmit(); };

        if (allQuestionsAnswered()) {
            webApp.MainButton.setText('Завершить тест');
            webApp.MainButton.onClick(mainButtonClickHandler);
            webApp.MainButton.show();
            webApp.MainButton.enable();
        } else {
             webApp.MainButton.setText('Ответьте на все вопросы');
             webApp.MainButton.disable();
             webApp.MainButton.show();
             webApp.MainButton.offClick(mainButtonClickHandler);
        }
         if (submitting) {
            webApp.MainButton.showProgress();
            webApp.MainButton.disable();
         } else {
            webApp.MainButton.hideProgress();
             if(allQuestionsAnswered()) webApp.MainButton.enable();
         }
        return () => {
            if (webApp?.MainButton.isVisible) {
                 webApp.MainButton.offClick(mainButtonClickHandler);
                 webApp.MainButton.hide();
                 webApp.MainButton.hideProgress();
            }
        };
    }, [test, userAnswers, submitting, allQuestionsAnswered, webApp]); // Добавили webApp в зависимости


    if (loading) {
        return <Loader message="Загрузка теста..." />;
    }
    if (error && !test) {
        return <p className={styles.error}>{error}</p>;
    }
    if (!test) {
        return <p>Тест не найден.</p>;
    }

    return (
        <div className={styles.takeTestPage}>
            <p className={styles.description}>{test.testDescription}</p>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {test.questions.map((question, qIndex) => (
                    <Card key={question.id} className={styles.questionCard}>
                        <h4>Вопрос {qIndex + 1}: {question.questionText}</h4>
                        <div className={styles.answersList}>
                            {question.answers.map((answer) => (
                                <Checkbox
                                    key={answer.id}
                                    id={`q${question.id}_a${answer.id}`}
                                    label={answer.answerText}
                                    checked={userAnswers[question.id]?.includes(answer.id) ?? false}
                                    onChange={(e) => handleAnswerChange(question.id, answer.id, e.target.checked)}
                                    disabled={submitting}
                                />
                            ))}
                        </div>
                         {(userAnswers[question.id]?.length ?? 0) === 0 && (
                            <small className={styles.notAnswered}>* Выберите хотя бы один ответ</small>
                         )}
                    </Card>
                ))}
                 {error && <p className={styles.errorSubmit}>{error}</p>}
                {isDevMode && (
                     <div className={styles.submitSection}>
                        <Button type="submit" variant="primary" loading={submitting} disabled={submitting || !allQuestionsAnswered()}>
                            {submitting ? 'Отправка...' : 'Завершить тест'}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default TakeTestPage;

