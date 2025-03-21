interface Answer {
    id: string;
    answerText: string;
}

interface Question {
    id: string;
    questionText: string;
    answers: Answer[];
    correctAnswer?: Answer;
}

interface Test {
    id: string;
    testName: string;
    testDescription: string;
    questions: Question[];
    createdBy?: User;
}

interface TestResult {
    id: string;
    test: Test;
    result: Result;
    user: User;
}

interface User {
    id: string;
    name: Name;
    login: string;
    testResults: TestResult[];
}

interface Name {
    first: string;
    last: string;
}

interface Result {
    testQuestionsCount: number;
    correctQuestionsCount: number;
}

export type { Answer, Question, Test, TestResult, User, Name, Result };