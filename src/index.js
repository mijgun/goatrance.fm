import React from 'react';
// Импортируем библиотеку React

import { createRoot } from 'react-dom/client';
// Импортируем метод createRoot из пакета react-dom для рендеринга приложения

import App from './App';
// Импортируем главный компонент приложения App

import './index.css';
// Импортируем файл стилей index.css

const container = document.getElementById('root');
// Получаем элемент DOM с id 'root', который будет контейнером для нашего React-приложения

const root = createRoot(container);
// Создаем корень для рендеринга нашего React-приложения

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// Рендерим компонент App внутри StrictMode для выявления потенциальных проблем в приложении
