interface Answer {
  id: string; // ID ответа (может генерироваться на фронте при создании)
  answerText: string;
  isAnswerCorrect: boolean;
}

interface Question {
  id: string; // ID вопроса (может генерироваться на фронте при создании)
  questionText: string;
  answers: Answer[];
}

interface Name {
  first: string;
  last?: string;
}

interface User {
  id: string; // ID пользователя из вашей системы (может быть UUID)
  tgUserId?: number; // ID пользователя Telegram (опционально, если нужно хранить)
  name: Name;
  login: string; // Telegram username
  testResults?: TestResult[];
}

interface Test {
  id: string;
  testName: string;
  testDescription: string;
  questions: Question[];
  createdBy?: User; // Связь с пользователем, создавшим тест
}

interface Result {
  testQuestionsCount: number;
  correctQuestionsCount: number;
}

interface TestResult {
  id: string;
  test: Test; // Ссылка на пройденный тест
  result: Result;
  takenAt: Date | string; // Дата прохождения теста (может быть строкой из API)
}

// Тип для отправки ответов на сервер при прохождении теста
interface UserAnswers {
  [questionId: string]: string[]; // Ключ - ID вопроса, значение - массив ID выбранных ответов
}

// Тип для данных формы создания/редактирования теста
interface TestFormData {
  testName: string;
  testDescription: string;
  questions: QuestionFormData[];
}
interface QuestionFormData {
  id: string; // Для связывания при редактировании и как key
  questionText: string;
  answers: AnswerFormData[];
}
interface AnswerFormData {
  id: string; // Для связывания при редактировании и как key
  answerText: string;
  isAnswerCorrect: boolean;
}


export type {
  Answer, Question, Test, TestResult, User, Name, Result, UserAnswers,
  TestFormData, QuestionFormData, AnswerFormData
};
