import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './context/UserContext'; // Импортируем провайдер
import './types/telegram-web-app.d.ts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserProvider> {/* Оборачиваем App */}
      <App />
    </UserProvider>
  </React.StrictMode>
);