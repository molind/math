// Элементы DOM
const settingsContainer = document.getElementById('settings');
const startButton = document.getElementById('start-game');
const maxResultSelect = document.getElementById('max-result');
const gameContainer = document.getElementById('game-container');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const resultsButton = document.getElementById('results-button');
const settingsButton = document.getElementById('settings-button');
const resultsContainer = document.getElementById('results-container');
const gridContainer = document.getElementById('grid-container');
const closeResultsButton = document.getElementById('close-results');
const clearResultsButton = document.getElementById('clear-results');
const langSwitcherRu = document.getElementById('lang-ru');
const langSwitcherEn = document.getElementById('lang-en');

let maxResult = parseInt(maxResultSelect.value);
let progress = JSON.parse(localStorage.getItem('progress')) || {};
let examples = [];
let currentExample = null;
let startTime = null;
let awaitingNext = false;
let language = localStorage.getItem('language') || 'ru';

// Текст на разных языках
const translations = {
  ru: {
    title: 'Таблица умножения',
    chooseMax: 'Выберите максимальный результат умножения:',
    startGame: 'Начать игру',
    results: 'Результаты',
    settings: 'Настройки',
    close: 'Закрыть',
    clearResults: 'Очистить результаты',
    confirmClear: 'Вы уверены, что хотите очистить результаты?',
    confirmSettings: 'Вы уверены, что хотите вернуться к настройкам?',
    allDone: 'Все примеры решены!',
  },
  en: {
    title: 'Multiplication Table',
    chooseMax: 'Choose the maximum multiplication result:',
    startGame: 'Start Game',
    results: 'Results',
    settings: 'Settings',
    close: 'Close',
    clearResults: 'Clear Results',
    confirmClear: 'Are you sure you want to clear the results?',
    confirmSettings: 'Are you sure you want to return to settings?',
    allDone: 'All examples are solved!',
  }
};

// Функция для установки языка
function setLanguage(lang) {
  language = lang;
  localStorage.setItem('language', lang);

  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    el.textContent = translations[lang][key];
  });
}

// Установка языка при загрузке
setLanguage(language);

// Обработчики переключения языка
langSwitcherRu.addEventListener('click', () => setLanguage('ru'));
langSwitcherEn.addEventListener('click', () => setLanguage('en'));

// Событие начала игры
startButton.addEventListener('click', () => {
  maxResult = parseInt(maxResultSelect.value);
  settingsContainer.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  initializeExamples();
  showNextExample();
  answerInput.focus();
  localStorage.setItem('maxResult', maxResult);
});

// Инициализация примеров
function initializeExamples() {
  examples = [];
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      const result = i * j;
      const key = `${i}x${j}`;
      examples.push({
        question: `${i} × ${j}`,
        answer: result,
        key: key,
        status: progress[key] ? progress[key].status : 'gray',
        attempts: progress[key] ? progress[key].attempts : 0
      });
    }
  }
}

// Функция показа следующего примера
function showNextExample() {
  const availableExamples = examples.filter(ex => ex.answer <= maxResult);
  if (availableExamples.length === 0) {
    alert(translations[language].allDone);
    return;
  }

  // Весовые коэффициенты для статусов
  const weights = {
    gray: 9,
    red: 9,
    green: 3,
    gold: 1
  };

  // Создаем массив с повторениями примеров по весам
  let weightedExamples = [];
  availableExamples.forEach(example => {
    const weight = weights[example.status] || 1;
    for (let i = 0; i < weight; i++) {
      weightedExamples.push(example);
    }
  });

  // Выбираем случайный пример
  const randomIndex = Math.floor(Math.random() * weightedExamples.length);
  currentExample = weightedExamples[randomIndex];

  questionElement.textContent = currentExample.question;
  questionElement.className = '';
  answerInput.value = '';
  startTime = Date.now();
  awaitingNext = false;
}

// Обработка ввода ответа
answerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (awaitingNext) {
      showNextExample();
    } else {
      checkAnswer();
    }
  }
});

// Проверка ответа
function checkAnswer() {
  const userAnswer = parseInt(answerInput.value);
  const correctAnswer = currentExample.answer;
  const timeTaken = (Date.now() - startTime) / 1000;

  let status = 'red';
  if (userAnswer === correctAnswer) {
    if (timeTaken < 3) {
      status = 'gold';
    } else {
      status = 'green';
    }
  }

  // Обновление прогресса
  progress[currentExample.key] = {
    status: status,
    attempts: (progress[currentExample.key]?.attempts || 0) + 1,
  };

  // Обновляем статус примера
  const index = examples.findIndex(ex => ex.key === currentExample.key);
  examples[index].status = status;
  examples[index].attempts = progress[currentExample.key].attempts;

  localStorage.setItem('progress', JSON.stringify(progress));

  // Изменяем цвет вопроса
  if (status === 'red') {
    questionElement.className = 'red';
    questionElement.textContent = `${currentExample.question} = ${correctAnswer}`;
    awaitingNext = true;
  } else {
    questionElement.className = status === 'gold' ? 'gold' : 'green';
    setTimeout(() => {
      showNextExample();
    }, 500);
  }
}

// Кнопка "Результаты"
resultsButton.addEventListener('click', () => {
  gameContainer.classList.add('hidden');
  resultsContainer.classList.remove('hidden');
  displayResultsGrid();
});

// Кнопка "Настройки"
settingsButton.addEventListener('click', () => {
  // Возврат к настройкам без сброса прогресса
  gameContainer.classList.add('hidden');
  settingsContainer.classList.remove('hidden');
});

// Кнопка "Закрыть" в результатах
closeResultsButton.addEventListener('click', () => {
  resultsContainer.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  answerInput.focus();
});

// Кнопка "Очистить результаты"
clearResultsButton.addEventListener('click', () => {
  if (confirm(translations[language].confirmClear)) {
    progress = {};
    localStorage.removeItem('progress');
    initializeExamples();
    displayResultsGrid();
  }
});

// Отображение таблицы результатов
function displayResultsGrid() {
  gridContainer.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      const result = i * j;
      const key = `${i}x${j}`;
      const cell = document.createElement('div');
      cell.classList.add('cell');
      const cellProgress = progress[key];

      if (cellProgress) {
        cell.classList.add(cellProgress.status);
        cell.textContent = `${i}×${j}`;
      } else {
        cell.textContent = `${i}×${j}`;
      }

      gridContainer.appendChild(cell);
    }
  }
}

// Регистрация сервис-воркера
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('Сервис-воркер зарегистрирован:', registration.scope);
      })
      .catch(err => {
        console.log('Ошибка регистрации сервис-воркера:', err);
      });
  });
}

// При загрузке страницы
window.onload = () => {
  // Если прогресс сохранен, сразу переходим к игре
  if (Object.keys(progress).length > 0) {
    maxResult = parseInt(localStorage.getItem('maxResult')) || 100;
    maxResultSelect.value = maxResult;
    settingsContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    initializeExamples();
    showNextExample();
    answerInput.focus();
  }
};
