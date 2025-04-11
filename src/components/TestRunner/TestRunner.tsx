// import React, { useState } from 'react';
// import { Test, TestResult } from '../../types/models';
// import Button from '../Button/Button';

// interface TestRunnerProps {
//   test: Test;
//   onComplete: (result: TestResult) => void;
//   onBack: () => void;
// }

// const TestRunner: React.FC<TestRunnerProps> = ({ test, onComplete, onBack }) => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const currentQuestion = test.questions[currentQuestionIndex];

//   const handleAnswerSelect = (answerId: string) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [currentQuestion.id]: answerId
//     }));
//   };

//   const handleSubmitTest = async () => {
//     setIsSubmitting(true);
//     try {
//       // Подсчет правильных ответов
//       let correctCount = 0;
//       test.questions.forEach(question => {
//         const selectedAnswerId = selectedAnswers[question.id];
//         const correctAnswer = question.answers.find(a => a.isAnswerCorrect);
//         if (selectedAnswerId && correctAnswer && selectedAnswerId === correctAnswer.id) {
//           correctCount++;
//         }
//       });

//       const result = {
//         id: Date.now().toString(),
//         test,
//         result: {
//           testQuestionsCount: test.questions.length,
//           correctQuestionsCount: correctCount
//         },
//         user: {} as any // Заглушка для пользователя
//       };

//       onComplete(result);
//     } catch (error) {
//       console.error('Error submitting test:', error);
//       window.Telegram.WebApp.showAlert('Произошла ошибка при отправке результатов');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <h2>{test.testName}</h2>
//       <p>Вопрос {currentQuestionIndex + 1} из {test.questions.length}</p>

//       <div style={{ margin: '20px 0' }}>
//         <h3>{currentQuestion.questionText}</h3>
//         {currentQuestion.answers.map(answer => (
//           <div key={answer.id} style={{ margin: '10px 0' }}>
//             <label style={{ display: 'flex', alignItems: 'center' }}>
//               <input
//                 type="radio"
//                 name={`question-${currentQuestion.id}`}
//                 checked={selectedAnswers[currentQuestion.id] === answer.id}
//                 onChange={() => handleAnswerSelect(answer.id)}
//                 style={{ marginRight: '10px' }}
//               />
//               {answer.answerText}
//             </label>
//           </div>
//         ))}
//       </div>

//       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//         {currentQuestionIndex > 0 ? (
//           <Button onClick={() => setCurrentQuestionIndex(prev => prev - 1)} variant="secondary">
//             Назад
//           </Button>
//         ) : (
//           <Button onClick={onBack} variant="secondary">
//             Выйти из теста
//           </Button>
//         )}

//         {currentQuestionIndex < test.questions.length - 1 ? (
//           <Button 
//             onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
//             disabled={!selectedAnswers[currentQuestion.id]}
//             variant="primary"
//           >
//             Далее
//           </Button>
//         ) : (
//           <Button 
//             onClick={handleSubmitTest}
//             disabled={!selectedAnswers[currentQuestion.id] || isSubmitting}
//             variant="primary"
//           >
//             {isSubmitting ? 'Отправка...' : 'Завершить тест'}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };
export{}
// export default TestRunner; 