import { useState } from 'react';
import { Question, Answer } from '../types/model';
import './QuestionForm.css';

type QuestionFormProps = {
    question: Question;
    onChange: (question: Question) => void;
    onDelete: () => void;
};

export const QuestionForm = ({ question, onChange, onDelete }: QuestionFormProps) => {
    const handleAnswerChange = (answerId: string, field: keyof Answer, value: string | boolean) => {
        const newAnswers = question.answers.map(a => 
            a.id === answerId ? { ...a, [field]: value } : a
        );
        onChange({ ...question, answers: newAnswers });
    };

    const addAnswer = () => {
        const newAnswer: Answer = {
            id: Date.now().toString(),
            answerText: '',
            isAnswerCorrect: false,
        };
        onChange({ ...question, answers: [...question.answers, newAnswer] });
    };

    return (
        <div className="question-form">
            <input
                type="text"
                value={question.questionText}
                onChange={(e) => onChange({ ...question, questionText: e.target.value })}
                placeholder="Текст вопроса"
            />
            
            {question.answers.map(answer => (
                <div key={answer.id} className="answer">
                    <input
                        type="text"
                        value={answer.answerText}
                        onChange={(e) => handleAnswerChange(answer.id, 'answerText', e.target.value)}
                        placeholder="Вариант ответа"
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={answer.isAnswerCorrect}
                            onChange={(e) => handleAnswerChange(answer.id, 'isAnswerCorrect', e.target.checked)}
                        />
                        Верный
                    </label>
                </div>
            ))}
            
            <button type="button" onClick={addAnswer}>Добавить ответ</button>
            <button type="button" onClick={onDelete}>Удалить вопрос</button>
        </div>
    );
};