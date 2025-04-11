// src/services/testService.ts
import { Test, TestResult } from '../types/model';

export const testService = {
  async getTests(): Promise<Test[]> {
    const response = await fetch('/api/tests');
    return response.json();
  },

  async createTest(test: Test): Promise<Test> {
    const response = await fetch('/api/tests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(test),
    });
    return response.json();
  },

  async submitTestResult(result: TestResult): Promise<void> {
    await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });
  },
};