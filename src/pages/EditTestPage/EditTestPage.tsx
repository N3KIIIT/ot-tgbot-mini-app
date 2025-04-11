import React, { useState, useEffect, useCallback } from 'react';
import { Test, TestFormData, QuestionFormData, AnswerFormData } from '../../types/model';
import { fetchTestById, updateTest } from '../../services/api';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Textarea/Textarea';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import Loader from '../../components/Loader/Loader';
import Card from '../../components/Card/Card';
import styles from './EditTestPage.module.css';

interface EditTestPageProps {
    navigateTo: (page: string) => void;
    testId: string;
}

const EditTestPage: React.FC<EditTestPageProps> = ({ navigateTo, testId }) => {
    const [testData, setTestData] = useState<TestFormData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const webApp = window.Telegram?.WebApp; // Получаем доступ к webApp

    // Загрузка данных теста (без изменений)
    useEffect(() => {
        const loadTestData = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedTest = await fetchTestById(testId);
                if (fetchedTest) {
                    setTestData({
                        testName: fetchedTest.testName,
                        testDescription: fetchedTest.testDescription,
                        questions: fetchedTest.questions.map(q => ({
                            id: q.id,
                            questionText: q.questionText,
                            answers: q.answers.map(a => ({
                                id: a.id,
                                answerText: a.answerText,
                                isAnswerCorrect: !!a.isAnswerCorrect,
                            })),
                        })),
                    });
                } else {
                    setError("Тест не найден.");
                }
            } catch (err) {
                console.error("Ошибка загрузки теста для редактирования:", err);
                setError(`Не удалось загрузить тест: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
            } finally {
                setLoading(false);
            }
        };
        loadTestData();
    }, [testId]);

    // --- Handlers (без изменений, используют useCallback) ---
    const handleTestInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTestData(prev => prev ? ({ ...prev, [name]: value }) : null);
    }, []);
    const addQuestion = useCallback(() => {
        const newQuestion: QuestionFormData = { id: `q_new_${Date.now()}`, questionText: '', answers: [] };
        setTestData(prev => prev ? ({ ...prev, questions: [...prev.questions, newQuestion] }) : null);
    }, []);
    const removeQuestion = useCallback((questionId: string) => {
        setTestData(prev => prev ? ({ ...prev, questions: prev.questions.filter(q => q.id !== questionId) }) : null);
    }, []);
    const handleQuestionTextChange = useCallback((questionId: string, value: string) => {
        setTestData(prev => prev ? ({ ...prev, questions: prev.questions.map(q => q.id === questionId ? { ...q, questionText: value } : q) }) : null);
    }, []);
    const addAnswer = useCallback((questionId: string) => {
        const newAnswer: AnswerFormData = { id: `a_new_${Date.now()}`, answerText: '', isAnswerCorrect: false };
         setTestData(prev => prev ? ({ ...prev, questions: prev.questions.map(q => q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q) }) : null);
    }, []);
     const removeAnswer = useCallback((questionId: string, answerId: string) => {
        setTestData(prev => prev ? ({ ...prev, questions: prev.questions.map(q => q.id === questionId ? { ...q, answers: q.answers.filter(a => a.id !== answerId) } : q) }) : null);
    }, []);
    const handleAnswerTextChange = useCallback((questionId: string, answerId: string, value: string) => {
       setTestData(prev => prev ? ({ ...prev, questions: prev.questions.map(q => q.id === questionId ? { ...q, answers: q.answers.map(a => a.id === answerId ? { ...a, answerText: value } : a) } : q) }) : null);
    }, []);
    const handleAnswerCorrectChange = useCallback((questionId: string, answerId: string, checked: boolean) => {
        setTestData(prev => prev ? ({ ...prev, questions: prev.questions.map(q => q.id === questionId ? { ...q, answers: q.answers.map(a => a.id === answerId ? { ...a, isAnswerCorrect: checked } : a) } : q) }) : null);
    }, []);

    // --- Form Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testData) return;
        setError(null);

        // Валидация (без изменений)
        if (!testData.testName.trim()) { setError("Название теста не может быть пустым."); return; }
        if (testData.questions.length === 0) { setError("Добавьте хотя бы один вопрос."); return; }
        for (const q of testData.questions) {
            if (!q.questionText.trim()) { setError(`Текст вопроса ${testData.questions.indexOf(q) + 1} не может быть пустым.`); return; }
            if (q.answers.length < 2) { setError(`В вопросе ${testData.questions.indexOf(q) + 1} должно быть минимум 2 варианта ответа.`); return; }
            let hasCorrectAnswer = false;
            for (const a of q.answers) {
                if (!a.answerText.trim()) { setError(`Текст ответа в вопросе ${testData.questions.indexOf(q) + 1} не может быть пустым.`); return; }
                if (a.isAnswerCorrect) hasCorrectAnswer = true;
            }
            if (!hasCorrectAnswer) { setError(`В вопросе ${testData.questions.indexOf(q) + 1} должен быть хотя бы один правильный ответ.`); return; }
        }

        setSaving(true);
        try {
            const dataToSend = {
                 testName: testData.testName,
                 testDescription: testData.testDescription,
                 questions: testData.questions.map(q => ({
                    id: q.id.startsWith('q_new_') ? '' : q.id,
                    questionText: q.questionText,
                    answers: q.answers.map(a => ({
                        id: a.id.startsWith('a_new_') ? '' : a.id,
                        answerText: a.answerText,
                        isAnswerCorrect: a.isAnswerCorrect,
                    })),
                 })),
            };

            await updateTest(testId, dataToSend);
            webApp?.HapticFeedback?.notificationOccurred('success'); // Optional chaining
            navigateTo('tests');
        } catch (err) {
            console.error("Ошибка обновления теста:", err);
            setError(`Не удалось обновить тест: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
            webApp?.HapticFeedback?.notificationOccurred('error'); // Optional chaining
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loader message="Загрузка данных теста..." />;
    }
    if (error && !testData) {
        return <p className={styles.error}>{error}</p>;
    }
    if (!testData) {
        return <p>Данные теста не найдены.</p>;
    }

    return (
        <div className={styles.editTestPage}>
            <form onSubmit={handleSubmit}>
                <Card className={styles.formSection}>
                    <h3>Основная информация</h3>
                    <Input label="Название теста" name="testName" value={testData.testName} onChange={handleTestInfoChange} required maxLength={100} />
                    <Textarea label="Описание теста" name="testDescription" value={testData.testDescription} onChange={handleTestInfoChange} rows={3} maxLength={500} />
                </Card>

                <Card className={styles.formSection}>
                    <h3>Вопросы</h3>
                    {testData.questions.map((question, qIndex) => (
                        <Card key={question.id} className={styles.questionCard}>
                            <div className={styles.questionHeader}>
                                <h4>Вопрос {qIndex + 1}</h4>
                                <Button type="button" variant="danger" onClick={() => removeQuestion(question.id)} className={styles.removeButtonSmall}>Удалить вопрос</Button>
                            </div>
                            <Textarea label="Текст вопроса" value={question.questionText} onChange={(e) => handleQuestionTextChange(question.id, e.target.value)} required rows={2} />
                            <h5>Ответы</h5>
                            {question.answers.map((answer, aIndex) => (
                                <div key={answer.id} className={styles.answerRow}>
                                    <Checkbox id={`correct_${question.id}_${answer.id}`} label="" checked={answer.isAnswerCorrect} onChange={(e) => handleAnswerCorrectChange(question.id, answer.id, e.target.checked)} title="Отметить как правильный" />
                                    <Input placeholder={`Текст ответа ${aIndex + 1}`} value={answer.answerText} onChange={(e) => handleAnswerTextChange(question.id, answer.id, e.target.value)} required containerClassName={styles.answerInput} />
                                    <Button type="button" variant="danger" onClick={() => removeAnswer(question.id, answer.id)} className={styles.removeButtonSmall} disabled={question.answers.length <= 1}>&times;</Button>
                                </div>
                            ))}
                             <Button type="button" variant="secondary" onClick={() => addAnswer(question.id)} className={styles.addButton}>Добавить ответ</Button>
                        </Card>
                    ))}
                    <Button type="button" variant="primary" onClick={addQuestion} className={styles.addButton}>Добавить вопрос</Button>
                </Card>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.submitSection}>
                    <Button type="submit" variant="primary" loading={saving} disabled={saving || loading}>
                        {saving ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditTestPage;
