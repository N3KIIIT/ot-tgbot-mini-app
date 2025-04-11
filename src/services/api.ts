import axios from 'axios';
import { Test, TestResult, User, UserAnswers } from '../types/model';

// --- Base API URL ---
// !!! ЗАМЕНИТЕ НА АДРЕС ВАШЕГО БЭКЕНДА !!!
const BASE_API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7164'; // Пример

// --- Helper Functions ---

// Функция для выполнения fetch запросов с базовой обработкой ошибок
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${BASE_API_URL}${endpoint}`;
    //const webApp = window.Telegram?.WebApp;
    const headers: HeadersInit = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        ...options.headers,
    };

    // Добавляем данные авторизации Telegram, если они есть
    // Бэкенд должен уметь валидировать initData
   /* if (webApp?.initData) {
        //headers['X-Telegram-Init-Data'] = webApp.initData;
    }*/

    try {
        const response = await fetch(url, { ...options, headers});
       // const axiosresp = await axios(url, {headers:{'Access-Control-Allow-Origin': '*'}});

        if (!response.ok) {
            // Попытка прочитать тело ошибки, если оно есть
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                // Если тело ошибки не JSON или пустое
                errorData = { message: response.statusText };
            }
            console.error(`API Error ${response.status}:`, errorData);
            throw new Error(errorData?.message || `Request failed with status ${response.status}`);
        }

        // Если ожидается пустое тело ответа (например, при DELETE или статусе 204)
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null as T; // Или можно вернуть { success: true } в зависимости от ожиданий
        }

        return await response.json() as T; // Парсим JSON ответ

    } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        // Перебрасываем ошибку дальше, чтобы ее можно было обработать в компонентах
        throw error;
    }
};


// --- API Functions ---

/**
 * Получает список всех доступных тестов.
 */
export const fetchTests = async (): Promise<Test[]> => {
    console.log('API: Запрос на получение тестов...');

   /* const tests2 = await axios.get('http://localhost:5263/all' , {headers: {'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'}});
*/
    const tests = await apiFetch<Test[]>('/test/getall' , {method: 'GET'});

    console.log('API: Тесты получены:', tests);
    return tests;
};

/**
 * Получает данные одного теста по ID.
 * (Включая вопросы и ответы для прохождения)
 */
export const fetchTestById = async (testId: string): Promise<Test | null> => {
     console.log(`API: Запрос теста с ID: ${testId}...`);
     // Убедитесь, что эндпоинт возвращает тест со всеми вопросами и ответами
     const test = await apiFetch<Test | null>(`/test/${testId}`);
     console.log('API: Тест найден:', test);
     return test;
}

/**
 * Создает новый тест.
 * Отправляет данные теста на бэкенд. `creator` обычно определяется на бэкенде по `initData`.
 */
export const createTest = async (newTestData: Omit<Test, 'id' | 'createdBy'>): Promise<Test> => {
    console.log('API: Создание нового теста...', newTestData);
    const createdTest = await apiFetch<Test>('/test/addnew', {
        method: 'POST',
        body: JSON.stringify(newTestData),
    });
    console.log('API: Тест создан:', createdTest);
    return createdTest;
};

/**
 * Обновляет существующий тест.
 */
export const updateTest = async (testId: string, updatedTestData: Partial<Omit<Test, 'id' | 'createdBy'>>): Promise<Test | null> => {
    console.log(`API: Обновление теста ${testId}...`, updatedTestData);
    const updatedTest = await apiFetch<Test | null>(`/tests/${testId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTestData),
    });
    console.log('API: Тест обновлен:', updatedTest);
    return updatedTest;
};

/**
 * Удаляет тест по ID.
 */
export const deleteTest = async (testId: string): Promise<boolean> => {
    console.log(`API: Удаление теста ${testId}...`);
    // Ожидаем успешный ответ (например, 204 No Content)
    await apiFetch<null>(`/tests/${testId}`, {
        method: 'DELETE',
    });
    console.log('API: Запрос на удаление теста отправлен.');
    return true; // Возвращаем true, если запрос прошел без ошибок
};

/**
 * Сохраняет результат прохождения теста.
 * Отправляет ID теста и ответы пользователя. ID пользователя берется из initData на бэкенде.
 */
export const saveTestResult = async (testId: string, answers: UserAnswers): Promise<TestResult> => {
    console.log(`API: Сохранение результата теста ${testId}...`, answers);
    const result = await apiFetch<TestResult>('/results', {
        method: 'POST',
        body: JSON.stringify({ testId, answers }),
    });
    console.log('API: Результат сохранен:', result);
    return result;
};

/**
 * Получает результаты тестов для текущего пользователя (определяется по initData на бэкенде).
 */
export const fetchUserResults = async (userId: string): Promise<TestResult[]> => {
    console.log(`API: Запрос результатов для пользователя ${userId}...`);
    // userId может быть не нужен, если бэкенд определяет пользователя по initData
    // Возможно, эндпоинт будет просто '/results/my'
    const results = await apiFetch<TestResult[]>(`/results?userId=${userId}`); // Или '/results/my'
    console.log('API: Результаты пользователя получены:', results);
    return results;
};

/**
 * Получает данные текущего пользователя с бэкенда.
 * Бэкенд использует initData для идентификации или создания пользователя.
 */
export const getOrCreateUser = async (currentUser: Omit<User, | 'Id'>): Promise<User> => {
    console.log("API: Запрос данных пользователя...");
    // Отправляем GET запрос, бэкенд идентифицирует пользователя по X-Telegram-Init-Data
    const user = await apiFetch<User>('/user/me',{    
            method: 'POST',
            body: JSON.stringify(currentUser)
        });
    console.log("API: Данные пользователя получены:", user);
    return user;
};