import {Test} from '../types/models';

const API_BASE_URL = 'https://api.example.com';

interface ApiResponse {
    tests: Test[];
    totalPages: number;
}

// Загрузка тестов с пагинацией
export const fetchTests = async (page: number, limit: number): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/tests?page=${page}&limit=${limit}`);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке тестов');
    }
    return response.json();
};

// Создание нового теста
export const createTest = async (title: string, description: string): Promise<Test> => {
    const response = await fetch(`${API_BASE_URL}/tests`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    });
    if (!response.ok) {
        throw new Error('Ошибка при создании теста');
    }
    return response.json();
};