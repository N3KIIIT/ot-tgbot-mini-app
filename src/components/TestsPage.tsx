import React, { useState } from 'react';
import Button from './Button';
import QuestionForm from './QuestionForm';
import { Test, Question } from '../types/models';

interface TestsPageProps {
    onBack: () => void; // Обработчик для кнопки "Назад"
}

const TestsPage: React.FC<TestsPageProps> = ({ onBack }) => {
    const [testName, setTestName] = useState('');
    const [testDescription, setTestDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isQuestionFormVisible, setIsQuestionFormVisible] = useState(false);

    // Добавление вопроса
    const handleAddQuestion = (question: Question) => {
        setQuestions([...questions, question]);
        setIsQuestionFormVisible(false);
    };

    // Сохранение теста
    const handleSaveTest = async () => {
        if (testName.trim() && testDescription.trim() && questions.length > 0) {
            const newTest: Test = {
                id: Date.now().toString(), // Генерация уникального ID
                testName,
                testDescription,
                questions
            };
            // Отправка теста на сервер
            console.log('Тест сохранен:', newTest);
            alert('Тест успешно сохранен!');
        } else {
            alert('Пожалуйста, заполните название, описание теста и добавьте хотя бы один вопрос.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Создание теста</h1>

            {/* Кнопка "Назад" */}
            <div style={{ marginBottom: '20px' }}>
                <Button
                    onClick={onBack}
                    label="Назад"
                    backgroundColor="#6c757d"
                    color="#fff"
                />
            </div>

            {/* Поля для названия и описания теста */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Название теста"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <textarea
                    placeholder="Описание теста"
                    value={testDescription}
                    onChange={(e) => setTestDescription(e.target.value)}
                    style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            {/* Список вопросов */}
            {questions.map((question) => (
                <div key={question.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>{question.questionText}</h3>
                    <ul>
                        {question.answers.map((answer) => (
                            <li key={answer.id}>
                                {answer.answerText} {question.correctAnswer === answer && '(Правильный)'}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {/* Форма добавления вопроса */}
            {isQuestionFormVisible ? (
                <QuestionForm
                    onSave={handleAddQuestion}
                    onCancel={() => setIsQuestionFormVisible(false)}
                />
            ) : (
                <Button
                    onClick={() => setIsQuestionFormVisible(true)}
                    label="Добавить вопрос"
                    backgroundColor="#28a745"
                    color="#fff"
                />
            )}

            {/* Кнопка сохранения теста */}
            <div style={{ marginTop: '20px' }}>
                <Button
                    onClick={handleSaveTest}
                    label="Сохранить тест"
                    backgroundColor="#007bff"
                    color="#fff"
                />
            </div>
        </div>
    );
};

export default TestsPage;