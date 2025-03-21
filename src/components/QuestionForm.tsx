import React, { useState } from 'react';
import { Answer, Question } from '../types/models';

interface QuestionFormProps {
    onSave: (question: Question) => void; // Обработчик сохранения вопроса
    onCancel: () => void; // Обработчик отмены
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSave, onCancel }) => {
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [newAnswerText, setNewAnswerText] = useState('');
    const [correctAnswerId, setCorrectAnswerId] = useState<Answer | undefined>(undefined);

    // Добавление ответа
    const handleAddAnswer = () => {
        if (newAnswerText.trim()) {
            const newAnswer: Answer = {
                id: Date.now().toString(), // Генерация уникального ID
                answerText: newAnswerText,
            };
            setAnswers([...answers, newAnswer]);
            setNewAnswerText('');
        }
    };

    // Удаление ответа
    const handleRemoveAnswer = (id: string) => {
        setAnswers(answers.filter((answer) => answer.id !== id));
    };

    // Сохранение вопроса
    const handleSaveQuestion = () => {
        if (questionText.trim() && answers.length > 0) {
            const newQuestion: Question = {
                id: Date.now().toString(), // Генерация уникального ID
                questionText,
                answers,
            };
            onSave(newQuestion);
        } else {
            alert('Пожалуйста, заполните текст вопроса и добавьте хотя бы один ответ.');
        }
    };

    return (
        <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Добавить вопрос</h3>
            <input
                type="text"
                placeholder="Текст вопроса"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />

            <h4>Ответы:</h4>
            {answers.map((answer) => (
                <div key={answer.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <input
                        type="radio"
                        name="correctAnswer"
                        //checked={correctAnswerId === answer.id}
                        //onChange={() => setCorrectAnswerId(answer.id)}
                        style={{ marginRight: '10px' }}
                    />
                    <span>{answer.answerText}</span>
                    <button
                        onClick={() => handleRemoveAnswer(answer.id)}
                        style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Удалить
                    </button>
                </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Текст ответа"
                    value={newAnswerText}
                    onChange={(e) => setNewAnswerText(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button
                    onClick={handleAddAnswer}
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Добавить ответ
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleSaveQuestion}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Сохранить вопрос
                </button>
                <button
                    onClick={onCancel}
                    style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Отмена
                </button>
            </div>
        </div>
    );
};

export default QuestionForm;