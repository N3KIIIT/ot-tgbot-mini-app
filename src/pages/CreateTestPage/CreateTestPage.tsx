import React, { useState } from 'react';
import { TestFormData, QuestionFormData, AnswerFormData } from '../../types/model';
import { createTest } from '../../services/api';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Textarea/Textarea';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import Loader from '../../components/Loader/Loader';
import Card from '../../components/Card/Card';
import styles from './CreateTestPage.module.css';
import { idText } from 'typescript';
import { useUser } from '../../context/UserContext'

interface CreateTestPageProps {
    navigateTo: (page: string) => void;
}

const CreateTestPage: React.FC<CreateTestPageProps> = ({ navigateTo }) => {
    const [testData, setTestData] = useState<TestFormData>({
        testName: '',
        testDescription: '',
        questions: [],
    });
    const { currentUser } = useUser();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const webApp = window.Telegram?.WebApp; // Получаем доступ к webApp

    // --- Handlers (без изменений) ---
    const handleTestInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTestData(prev => ({ ...prev, [name]: value }));
    };
    const addQuestion = () => {
        const newQuestion: QuestionFormData = { id: `q_${Date.now()}`, questionText: '', answers: [] };
        setTestData(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
    };
    const removeQuestion = (questionId: string) => {
        setTestData(prev => ({ ...prev, questions: prev.questions.filter(q => q.id !== questionId) }));
    };
    const handleQuestionTextChange = (questionId: string, value: string) => {
        setTestData(prev => ({ ...prev, questions: prev.questions.map(q => q.id === questionId ? { ...q, questionText: value } : q) }));
    };
    const addAnswer = (questionId: string) => {
        const newAnswer: AnswerFormData = { id: `a_${Date.now()}`, answerText: '', isAnswerCorrect: false };
        setTestData(prev => ({ ...prev, questions: prev.questions.map(q => q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q) }));
    };
    const removeAnswer = (questionId: string, answerId: string) => {
        setTestData(prev => ({ ...prev, questions: prev.questions.map(q => q.id === questionId ? { ...q, answers: q.answers.filter(a => a.id !== answerId) } : q) }));
    };
    const handleAnswerTextChange = (questionId: string, answerId: string, value: string) => {
        setTestData(prev => ({ ...prev, questions: prev.questions.map(q => q.id === questionId ? { ...q, answers: q.answers.map(a => a.id === answerId ? { ...a, answerText: value } : a) } : q) }));
    };
    const handleAnswerCorrectChange = (questionId: string, answerId: string, checked: boolean) => {
        setTestData(prev => ({ ...prev, questions: prev.questions.map(q => q.id === questionId ? { ...q, answers: q.answers.map(a => a.id === answerId ? { ...a, isAnswerCorrect: checked } : a) } : q) }));
    };

    // --- Form Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

        setLoading(true);
        try {

            const dataToSend = {
                id: '',
                createdBy: currentUser,
                testName: testData.testName,
                testDescription: testData.testDescription,
                questions: testData.questions.map(q => ({
                    id:'',
                    questionText: q.questionText,
                    answers: q.answers.map(a => ({
                        id:'',
                        answerText: a.answerText,
                        isAnswerCorrect: a.isAnswerCorrect,
                    })),
                })),
            };

            await createTest(dataToSend);
            webApp?.HapticFeedback?.notificationOccurred('success'); // Optional chaining
            navigateTo('tests');
        } catch (err) {
            console.error("Ошибка создания теста:", err);
            setError(`Не удалось создать тест: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
            webApp?.HapticFeedback?.notificationOccurred('error'); // Optional chaining
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.createTestPage}>
            <form onSubmit={handleSubmit}>
                <Card className={styles.formSection}>
                    <h3>Основная информация</h3>
                    <Input
                        label="Название теста"
                        name="testName"
                        value={testData.testName}
                        onChange={handleTestInfoChange}
                        required
                        maxLength={100}
                    />
                    <Textarea
                        label="Описание теста"
                        name="testDescription"
                        value={testData.testDescription}
                        onChange={handleTestInfoChange}
                        rows={3}
                        maxLength={500}
                    />
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
                    <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить тест'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateTestPage;
