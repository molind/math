// DOM Elements
const mainMenu = document.getElementById('main-menu');
const settingsContainer = document.getElementById('settings');
const startButton = document.getElementById('start-game');
const maxResultSelect = document.getElementById('max-result');
const gameModeSelect = document.getElementById('game-mode');
const gameContainer = document.getElementById('game-container');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const virtualKeyboard = document.getElementById('virtual-keyboard');
const resultsButton = document.getElementById('results-button');
const settingsButton = document.getElementById('settings-button');
const backToGameButton = document.getElementById('back-to-game');
const enableKeyboardCheckbox = document.getElementById('enable-keyboard');
const resultsContainer = document.getElementById('results-container');
const closeResultsButton = document.getElementById('close-results');
const endGameButton = document.getElementById('end-game');
const languageSelect = document.getElementById('language-select');
const themeSelect = document.getElementById('theme-select');

let maxResult = parseInt(maxResultSelect.value);
let gameMode = gameModeSelect.value;
let enableKeyboard = enableKeyboardCheckbox.checked;
let progress = JSON.parse(localStorage.getItem('progress')) || {};
let examples = [];
let currentExample = null;
let startTime = null;
let awaitingNext = false;
let language = localStorage.getItem('language') || 'en';
let theme = localStorage.getItem('theme') || 'system';

// Statistics
let totalExamples = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let totalTime = 0;
let mistakes = [];

// Translations
const translations = {
  en: {
    language: 'Language:',
    mainTitle: 'Learning Mathematics',
    settingsTitle: 'Settings',
    resultsTitle: 'Results',
    chooseMode: 'Choose game mode:',
    chooseMax: 'Choose the maximum result:',
    enableKeyboard: 'Virtual Keyboard',
    chooseTheme: 'Choose Theme:',
    systemTheme: 'System Default',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    startGame: 'Start Game',
    results: 'Results',
    settings: 'Settings',
    back: 'Back',
    close: 'Close',
    endGame: 'End Game',
    confirmClear: 'Are you sure you want to clear the results?',
    confirmSettings: 'Are you sure you want to return to settings?',
    confirmEndGame: 'Are you sure you want to end the game?',
    allDone: 'All examples are solved!',
    multiplication: 'Multiplication',
    division: 'Division',
    addition: 'Addition',
    subtraction: 'Subtraction',
    upTo50: 'Up to 50',
    upTo100: 'Up to 100',
    totalExamples: 'Total examples:',
    correctAnswers: 'Correct answers:',
    incorrectAnswers: 'Incorrect answers:',
    averageTime: 'Average time per answer:',
    lastMistakes: 'Last mistakes:',
    yourAnswer: 'Your answer',
  },
  ru: {
    language: 'Язык:',
    mainTitle: 'Учим математику',
    settingsTitle: 'Настройки',
    resultsTitle: 'Результаты',
    chooseMode: 'Выберите режим игры:',
    chooseMax: 'Выберите максимальный результат:',
    enableKeyboard: 'Виртуальная клавиатура',
    chooseTheme: 'Выберите тему:',
    systemTheme: 'Системная по умолчанию',
    lightTheme: 'Светлая',
    darkTheme: 'Тёмная',
    startGame: 'Начать игру',
    results: 'Результаты',
    settings: 'Настройки',
    back: 'Назад',
    close: 'Закрыть',
    endGame: 'Закончить игру',
    confirmClear: 'Вы уверены, что хотите очистить результаты?',
    confirmSettings: 'Вы уверены, что хотите вернуться к настройкам?',
    confirmEndGame: 'Вы уверены, что хотите закончить игру?',
    allDone: 'Все примеры решены!',
    multiplication: 'Умножение',
    division: 'Деление',
    addition: 'Сложение',
    subtraction: 'Вычитание',
    upTo50: 'До 50',
    upTo100: 'До 100',
    totalExamples: 'Всего примеров:',
    correctAnswers: 'Правильных ответов:',
    incorrectAnswers: 'Неправильных ответов:',
    averageTime: 'Среднее время ответа:',
    lastMistakes: 'Последние ошибки:',
    yourAnswer: 'Ваш ответ',
  },
  pl: {
    language: 'Język:',
    mainTitle: 'Uczymy się matematyki',
    settingsTitle: 'Ustawienia',
    resultsTitle: 'Wyniki',
    chooseMode: 'Wybierz tryb gry:',
    chooseMax: 'Wybierz maksymalny wynik:',
    enableKeyboard: 'Klawiatura wirtualna',
    chooseTheme: 'Wybierz motyw:',
    systemTheme: 'Domyślny systemowy',
    lightTheme: 'Jasny',
    darkTheme: 'Ciemny',
    startGame: 'Rozpocznij grę',
    results: 'Wyniki',
    settings: 'Ustawienia',
    back: 'Wstecz',
    close: 'Zamknij',
    endGame: 'Zakończ grę',
    confirmClear: 'Czy na pewno chcesz wyczyścić wyniki?',
    confirmSettings: 'Czy na pewno chcesz wrócić do ustawień?',
    confirmEndGame: 'Czy na pewno chcesz zakończyć grę?',
    allDone: 'Wszystkie przykłady rozwiązane!',
    multiplication: 'Mnożenie',
    division: 'Dzielenie',
    addition: 'Dodawanie',
    subtraction: 'Odejmowanie',
    upTo50: 'Do 50',
    upTo100: 'Do 100',
    totalExamples: 'Łączna liczba przykładów:',
    correctAnswers: 'Poprawne odpowiedzi:',
    incorrectAnswers: 'Niepoprawne odpowiedzi:',
    averageTime: 'Średni czas na odpowiedź:',
    lastMistakes: 'Ostatnie błędy:',
    yourAnswer: 'Twoja odpowiedź',
  },
};

// Set language
function setLanguage(lang) {
  language = lang;
  localStorage.setItem('language', lang);

  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    el.textContent = translations[lang][key];
  });

  // Update options in selects
  document.querySelectorAll('option[data-lang]').forEach(option => {
    const key = option.getAttribute('data-lang');
    option.textContent = translations[lang][key];
  });
}

setLanguage(language);
languageSelect.value = language;

// Language switcher handler
languageSelect.addEventListener('change', () => setLanguage(languageSelect.value));

// Set theme
function setTheme(selectedTheme) {
  theme = selectedTheme;
  localStorage.setItem('theme', theme);

  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

// Theme switcher handler
themeSelect.value = theme;
themeSelect.addEventListener('change', () => {
  setTheme(themeSelect.value);
});

function startGame() {
  maxResult = parseInt(maxResultSelect.value);
  gameMode = gameModeSelect.value;
  enableKeyboard = enableKeyboardCheckbox.checked;
  localStorage.setItem('maxResult', maxResult);
  localStorage.setItem('gameMode', gameMode);
  localStorage.setItem('enableKeyboard', enableKeyboard);

  mainMenu.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  updateKeyboardSettings();
  initializeExamples();
  resetStatistics();
  showNextExample();
  answerInput.focus();
}

// Start game event
startButton.addEventListener('click', () => {
  startGame();
});

// Initialize examples
function initializeExamples() {
  examples = [];
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      let question = '';
      let answer = 0;
      switch (gameMode) {
        case 'multiplication':
          question = `${i} × ${j}`;
          answer = i * j;
          break;
        case 'division':
          question = `${i * j} ÷ ${i}`;
          answer = j;
          break;
        case 'addition':
          question = `${i} + ${j}`;
          answer = i + j;
          break;
        case 'subtraction':
          question = `${i + j} − ${i}`;
          answer = j;
          break;
      }
      const key = `${gameMode}-${i}x${j}`;
      examples.push({
        question: question,
        answer: answer,
        key: key,
        status: progress[key] ? progress[key].status : 'gray',
        attempts: progress[key] ? progress[key].attempts : 0
      });
    }
  }
}

// Reset statistics
function resetStatistics() {
  totalExamples = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  totalTime = 0;
  mistakes = [];
}

// Show next example
function showNextExample() {
  const availableExamples = examples.filter(ex => ex.answer <= maxResult);
  if (availableExamples.length === 0) {
    alert(translations[language].allDone);
    return;
  }

  // Weights for statuses
  const weights = {
    gray: 9,
    red: 9,
    green: 3,
    gold: 1
  };

  // Create weighted examples array
  let weightedExamples = [];
  availableExamples.forEach(example => {
    const weight = weights[example.status] || 1;
    for (let i = 0; i < weight; i++) {
      weightedExamples.push(example);
    }
  });

  // Select random example
  const randomIndex = Math.floor(Math.random() * weightedExamples.length);
  currentExample = weightedExamples[randomIndex];

  questionElement.textContent = currentExample.question;
  questionElement.className = '';
  answerInput.value = '';
  startTime = Date.now();
  awaitingNext = false;
}

// Answer input handler
answerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (awaitingNext) {
      showNextExample();
    } else {
      checkAnswer();
    }
  }
});

// Virtual keyboard handler
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', () => {
    if (key.id === 'key-backspace') {
      answerInput.value = answerInput.value.slice(0, -1);
    } else if (key.id === 'key-enter') {
      if (awaitingNext) {
        showNextExample();
      } else {
        checkAnswer();
      }
    } else {
      answerInput.value += key.textContent;
    }
    answerInput.focus();
  });
});

// Check answer
function checkAnswer() {
  const userAnswer = parseInt(answerInput.value);
  const correctAnswer = currentExample.answer;
  const timeTaken = (Date.now() - startTime) / 1000;

  totalExamples++;
  totalTime += timeTaken;

  let status = 'red';
  if (userAnswer === correctAnswer) {
    if (timeTaken < 3) {
      status = 'gold';
    } else {
      status = 'green';
    }
    correctAnswers++;
  } else {
    incorrectAnswers++;
    mistakes.unshift(`${currentExample.question} = ${correctAnswer} (${translations[language].yourAnswer}: ${userAnswer})`);
    if (mistakes.length > 10) {
      mistakes.pop();
    }
  }

  // Update progress only for multiplication and division
  if (gameMode === 'multiplication' || gameMode === 'division') {
    progress[currentExample.key] = {
      status: status,
      attempts: (progress[currentExample.key]?.attempts || 0) + 1,
    };

    // Update example status
    const index = examples.findIndex(ex => ex.key === currentExample.key);
    examples[index].status = status;
    examples[index].attempts = progress[currentExample.key].attempts;

    localStorage.setItem('progress', JSON.stringify(progress));
  }

  // Change question color
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

// "Results" button
resultsButton.addEventListener('click', () => {
  gameContainer.classList.add('hidden');
  resultsContainer.classList.remove('hidden');
  displayResults();
});

// "Settings" button
settingsButton.addEventListener('click', () => {
  gameContainer.classList.add('hidden');
  settingsContainer.classList.remove('hidden');
  enableKeyboardCheckbox.checked = enableKeyboard;
});

// "Back" button in settings
backToGameButton.addEventListener('click', () => {
  enableKeyboard = enableKeyboardCheckbox.checked;
  localStorage.setItem('enableKeyboard', enableKeyboard);
  updateKeyboardSettings();
  settingsContainer.classList.add('hidden');
  gameContainer.classList.remove('hidden');
});

// "Close" button in results
closeResultsButton.addEventListener('click', () => {
  resultsContainer.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  answerInput.focus();
});

// "End Game" button
endGameButton.addEventListener('click', () => {
  if (confirm(translations[language].confirmEndGame)) {
    // Reset statistics
    resetStatistics();

    // Clear progress for multiplication and division
    if (gameMode === 'multiplication' || gameMode === 'division') {
      progress = {};
      localStorage.removeItem('progress');
    }

    resultsContainer.classList.add('hidden');
    gameContainer.classList.add('hidden');
    mainMenu.classList.remove('hidden');
  }
});

// Display results
function displayResults() {
  const resultsContent = document.getElementById('results-content');
  resultsContent.innerHTML = '';

  // Display statistics
  const stats = document.createElement('div');
  stats.className = 'stats';
  stats.innerHTML = `
    <p>${translations[language].totalExamples} ${totalExamples}</p>
    <p>${translations[language].correctAnswers} ${correctAnswers}</p>
    <p>${translations[language].incorrectAnswers} ${incorrectAnswers}</p>
    <p>${translations[language].averageTime} ${(totalTime / totalExamples).toFixed(2)} sec</p>
    <p>${translations[language].lastMistakes}</p>
    <ul>${mistakes.map(mistake => `<li>${mistake}</li>`).join('')}</ul>
  `;
  resultsContent.appendChild(stats);

  if (gameMode === 'multiplication' || gameMode === 'division') {
    // Display results grid
    const gridContainer = document.createElement('div');
    gridContainer.id = 'grid-container';

    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        const key = `${gameMode}-${i}x${j}`;
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const cellProgress = progress[key];

        if (cellProgress) {
          cell.classList.add(cellProgress.status);
          cell.textContent = examples.find(ex => ex.key === key).question;
        } else {
          cell.textContent = examples.find(ex => ex.key === key).question;
        }

        gridContainer.appendChild(cell);
      }
    }

    resultsContent.appendChild(gridContainer);
  }
}

function updateKeyboardSettings() {
  answerInput.readOnly = enableKeyboard;
  virtualKeyboard.classList.toggle('hidden', !enableKeyboard);
}

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
  navigator.serviceWorker.register('./service-worker.js')
    .then(registration => {
      console.log('Service-worker registered:', registration.scope);
    })
    .catch(err => {
      console.log('Service worker registration error:', err);
    });
  });
}

// On page load
window.onload = () => {
  // Load settings
  maxResult = parseInt(localStorage.getItem('maxResult')) || 100;
  gameMode = localStorage.getItem('gameMode') || 'multiplication';
  enableKeyboard = localStorage.getItem('enableKeyboard') === 'true';
  theme = localStorage.getItem('theme') || 'system';

  maxResultSelect.value = maxResult;
  gameModeSelect.value = gameMode;
  enableKeyboardCheckbox.checked = enableKeyboard;
  themeSelect.value = theme;
  setTheme(theme);

  // If progress saved, start game
  if (Object.keys(progress).length > 0) {
    startGame();
  }
};
