// app.js

class MathGame {
  constructor() {
    // DOM Elements
    this.elements = {
      mainMenu: document.getElementById('main-menu'),
      settingsContainer: document.getElementById('settings'),
      startButton: document.getElementById('start-game'),
      maxResultSelect: document.getElementById('max-result'),
      gameModeSelect: document.getElementById('game-mode'),
      gameContainer: document.getElementById('game-container'),
      questionElement: document.getElementById('question'),
      answerInput: document.getElementById('answer-input'),
      virtualKeyboard: document.getElementById('virtual-keyboard'),
      resultsButton: document.getElementById('results-button'),
      settingsButton: document.getElementById('settings-button'),
      backToGameButton: document.getElementById('back-to-game'),
      enableKeyboardCheckbox: document.getElementById('enable-keyboard'),
      resultsContainer: document.getElementById('results-container'),
      closeResultsButton: document.getElementById('close-results'),
      endGameButton: document.getElementById('end-game'),
      languageSelect: document.getElementById('language-select'),
      themeSelect: document.getElementById('theme-select'),
      resultsContent: document.getElementById('results-content'),
      pageTitle: document.querySelector('title[data-lang="title"]')
    };

    // Initial Settings
    this.settings = {
      maxResult: parseInt(localStorage.getItem('maxResult')) || parseInt(this.elements.maxResultSelect.value),
      gameMode: localStorage.getItem('gameMode') || this.elements.gameModeSelect.value,
      enableKeyboard: localStorage.getItem('enableKeyboard') === 'true' || this.elements.enableKeyboardCheckbox.checked,
      language: localStorage.getItem('language') || 'en',
      theme: localStorage.getItem('theme') || 'system',
    };

    // Game State
    this.progress = JSON.parse(localStorage.getItem('progress')) || {};
    this.examples = [];
    this.currentExample = null;
    this.startTime = null;
    this.awaitingNext = false;

    // Statistics
    this.statistics = {
      totalExamples: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalTime: 0,
      mistakes: [],
    };

    // Translations
    this.translations = {
      en: {
        title: 'Learning Mathematics',
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
        gameTitle: 'Learning Mathematics' // Added for gameTitle
      },
      ru: {
        title: 'Учим математику',
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
        gameTitle: 'Учим математику' // Added for gameTitle
      },
      pl: {
        title: 'Uczymy się matematyki',
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
        gameTitle: 'Uczymy się matematyki' // Added for gameTitle
      },
    };

    // Initialize the game
    this.init();
  }

  init() {
    this.setLanguage(this.settings.language);
    this.setTheme(this.settings.theme);
    this.bindEvents();
    this.loadSettings();
    if (Object.keys(this.progress).length > 0) {
      this.startGame();
    }
  }

  bindEvents() {
    const { startButton, languageSelect, themeSelect, resultsButton, settingsButton, backToGameButton, closeResultsButton, endGameButton, answerInput, virtualKeyboard } = this.elements;

    startButton.addEventListener('click', () => this.startGame());
    languageSelect.addEventListener('change', (e) => this.setLanguage(e.target.value));
    themeSelect.addEventListener('change', (e) => this.setTheme(e.target.value));
    resultsButton.addEventListener('click', () => this.showResults());
    settingsButton.addEventListener('click', () => this.showSettings());
    backToGameButton.addEventListener('click', () => this.backToGame());
    closeResultsButton.addEventListener('click', () => this.closeResults());
    endGameButton.addEventListener('click', () => this.endGame());

    answerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.awaitingNext ? this.showNextExample() : this.checkAnswer();
      }
    });

    virtualKeyboard.querySelectorAll('.key').forEach(key => {
      key.addEventListener('click', () => this.handleVirtualKey(key));
    });

    // Service worker registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
          .then(registration => console.log('Service-worker registered:', registration.scope))
          .catch(err => console.error('Service worker registration error:', err));
      });
    }
  }

  /**
   * Handles clicks on the virtual keyboard keys.
   * @param {HTMLElement} key - The key element that was clicked.
   */
  handleVirtualKey(key) {
    const { answerInput } = this.elements;
    switch (key.id) {
      case 'key-backspace':
        answerInput.value = answerInput.value.slice(0, -1);
        break;
      case 'key-enter':
        this.awaitingNext ? this.showNextExample() : this.checkAnswer();
        break;
      default:
        answerInput.value += key.textContent;
    }
    answerInput.focus();
  }

  /**
   * Sets the language of the game.
   * @param {string} lang - The selected language code.
   */
  setLanguage(lang) {
    this.settings.language = lang;
    localStorage.setItem('language', lang);

    // Update text content for elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(el => {
      const key = el.getAttribute('data-lang');
      if (key === 'title') {
        this.elements.pageTitle.textContent = this.translations[lang][key] || '';
      } else {
        el.textContent = this.translations[lang][key] || '';
      }
    });

    // Update option texts in select elements
    document.querySelectorAll('option[data-lang]').forEach(option => {
      const key = option.getAttribute('data-lang');
      option.textContent = this.translations[lang][key] || '';
    });
  }

  /**
   * Sets the theme of the game.
   * @param {string} selectedTheme - The selected theme ('light', 'dark', 'system').
   */
  setTheme(selectedTheme) {
    this.settings.theme = selectedTheme;
    localStorage.setItem('theme', selectedTheme);

    const root = document.documentElement;
    switch (selectedTheme) {
      case 'light':
        root.setAttribute('data-theme', 'light');
        break;
      case 'dark':
        root.setAttribute('data-theme', 'dark');
        break;
      default:
        root.removeAttribute('data-theme');
    }
  }

  /**
   * Loads settings from the settings object to the UI elements.
   */
  loadSettings() {
    const { maxResultSelect, gameModeSelect, enableKeyboardCheckbox, themeSelect, languageSelect } = this.elements;
    maxResultSelect.value = this.settings.maxResult;
    gameModeSelect.value = this.settings.gameMode;
    enableKeyboardCheckbox.checked = this.settings.enableKeyboard;
    themeSelect.value = this.settings.theme;
    languageSelect.value = this.settings.language;

    this.updateKeyboardSettings();
  }

  /**
   * Starts the game by initializing examples and resetting statistics.
   */
  startGame() {
    const { maxResultSelect, gameModeSelect, enableKeyboardCheckbox, mainMenu, gameContainer } = this.elements;

    this.settings.maxResult = parseInt(maxResultSelect.value);
    this.settings.gameMode = gameModeSelect.value;
    this.settings.enableKeyboard = enableKeyboardCheckbox.checked;

    // Save settings to localStorage
    localStorage.setItem('maxResult', this.settings.maxResult);
    localStorage.setItem('gameMode', this.settings.gameMode);
    localStorage.setItem('enableKeyboard', this.settings.enableKeyboard);

    // Toggle visibility of containers
    mainMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    this.updateKeyboardSettings();
    this.initializeExamples();
    this.resetStatistics();
    this.showNextExample();
    this.elements.answerInput.focus();
  }

  /**
   * Initializes the list of examples based on the selected game mode and maximum result.
   */
  initializeExamples() {
    const { gameMode, maxResult } = this.settings;
    this.examples = [];

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
          default:
            console.warn(`Unknown game mode: ${gameMode}`);
            continue;
        }

        if (answer > maxResult) continue;

        const key = `${gameMode}-${i}x${j}`;
        this.examples.push({
          question,
          answer,
          key,
          status: this.progress[key]?.status || 'gray',
          attempts: this.progress[key]?.attempts || 0,
        });
      }
    }

    // If no examples are available, alert the user and end the game
    if (this.examples.length === 0) {
      alert(this.translations[this.settings.language].allDone);
      this.endGame(); // End the game if no examples are available
    }
  }

  /**
   * Resets the game statistics.
   */
  resetStatistics() {
    this.statistics = {
      totalExamples: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalTime: 0,
      mistakes: [],
    };
  }

  /**
   * Displays the next example/question to the user.
   */
  showNextExample() {
    const availableExamples = this.examples.filter(ex => ex.answer <= this.settings.maxResult);
    if (availableExamples.length === 0) {
      alert(this.translations[this.settings.language].allDone);
      this.endGame();
      return;
    }

    // Weights for example statuses
    const weights = {
      gray: 9,
      red: 9,
      green: 3,
      gold: 1,
    };

    // Create a weighted array of examples based on their status
    const weightedExamples = availableExamples.flatMap(example => {
      const weight = weights[example.status] || 1;
      return Array(weight).fill(example);
    });

    // Select a random example from the weighted array
    const randomIndex = Math.floor(Math.random() * weightedExamples.length);
    this.currentExample = weightedExamples[randomIndex];

    // Display the question
    this.elements.questionElement.textContent = this.currentExample.question;
    this.elements.questionElement.className = '';
    this.elements.answerInput.value = '';
    this.startTime = Date.now();
    this.awaitingNext = false;
  }

  /**
   * Checks the user's answer and updates the game state accordingly.
   */
  checkAnswer() {
    const { answerInput, questionElement } = this.elements;
    const userAnswer = parseInt(answerInput.value, 10);
    const correctAnswer = this.currentExample.answer;
    const timeTaken = (Date.now() - this.startTime) / 1000;

    // Update statistics
    this.statistics.totalExamples++;
    this.statistics.totalTime += timeTaken;

    let status = 'red';
    if (userAnswer === correctAnswer) {
      status = timeTaken < 3 ? 'gold' : 'green';
      this.statistics.correctAnswers++;
    } else {
      this.statistics.incorrectAnswers++;
      const mistake = `${this.currentExample.question} = ${correctAnswer} (${this.translations[this.settings.language].yourAnswer}: ${userAnswer})`;
      this.statistics.mistakes.unshift(mistake);
      if (this.statistics.mistakes.length > 10) {
        this.statistics.mistakes.pop();
      }
    }

    // Update progress only for multiplication and division modes
    if (['multiplication', 'division'].includes(this.settings.gameMode)) {
      this.updateProgress(this.currentExample.key, status);
    }

    // Update UI based on the answer
    if (status === 'red') {
      questionElement.classList.add('red');
      questionElement.textContent = `${this.currentExample.question} = ${correctAnswer}`;
      this.awaitingNext = true;
    } else {
      questionElement.classList.add(status);
      setTimeout(() => this.showNextExample(), 500);
    }
  }

  /**
   * Updates the user's progress for a specific example.
   * @param {string} key - The unique key of the example.
   * @param {string} status - The status of the example after answering.
   */
  updateProgress(key, status) {
    const existingProgress = this.progress[key] || { status: 'gray', attempts: 0 };
    existingProgress.status = status;
    existingProgress.attempts += 1;
    this.progress[key] = existingProgress;

    // Update the example's status in the examples array
    const exampleIndex = this.examples.findIndex(ex => ex.key === key);
    if (exampleIndex !== -1) {
      this.examples[exampleIndex].status = status;
      this.examples[exampleIndex].attempts = existingProgress.attempts;
    }

    // Save progress to localStorage
    localStorage.setItem('progress', JSON.stringify(this.progress));
  }

  /**
   * Displays the results screen with statistics and progress grid.
   */
  showResults() {
    const { gameContainer, resultsContainer } = this.elements;
    gameContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    this.displayResults();
  }

  /**
   * Shows the settings screen.
   */
  showSettings() {
    const { gameContainer, settingsContainer } = this.elements;
    gameContainer.classList.add('hidden');
    settingsContainer.classList.remove('hidden');
    this.elements.enableKeyboardCheckbox.checked = this.settings.enableKeyboard;
  }

  /**
   * Returns to the game screen from the settings.
   */
  backToGame() {
    const { settingsContainer, gameContainer, enableKeyboardCheckbox } = this.elements;
    this.settings.enableKeyboard = enableKeyboardCheckbox.checked;
    localStorage.setItem('enableKeyboard', this.settings.enableKeyboard);
    this.updateKeyboardSettings();
    settingsContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
  }

  /**
   * Closes the results screen and returns to the game.
   */
  closeResults() {
    const { resultsContainer, gameContainer } = this.elements;
    resultsContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    this.elements.answerInput.focus();
  }

  /**
   * Ends the current game session, optionally clearing progress.
   */
  endGame() {
    const { language } = this.settings;
    if (confirm(this.translations[language].confirmEndGame)) {
      this.resetStatistics();
      if (['multiplication', 'division'].includes(this.settings.gameMode)) {
        this.progress = {};
        localStorage.removeItem('progress');
      }
      this.closeResults();
      this.elements.gameContainer.classList.add('hidden');
      this.elements.mainMenu.classList.remove('hidden');
    }
  }

  /**
   * Displays the results, including statistics and a progress grid.
   */
  displayResults() {
    const { resultsContent } = this.elements;
    resultsContent.innerHTML = '';

    // Display statistics
    const stats = document.createElement('div');
    stats.className = 'stats';
    const avgTime = this.statistics.totalExamples > 0 ? (this.statistics.totalTime / this.statistics.totalExamples).toFixed(2) : '0.00';
    stats.innerHTML = `
      <p>${this.translations[this.settings.language].totalExamples} ${this.statistics.totalExamples}</p>
      <p>${this.translations[this.settings.language].correctAnswers} ${this.statistics.correctAnswers}</p>
      <p>${this.translations[this.settings.language].incorrectAnswers} ${this.statistics.incorrectAnswers}</p>
      <p>${this.translations[this.settings.language].averageTime} ${avgTime} sec</p>
      <p>${this.translations[this.settings.language].lastMistakes}</p>
      <ul>${this.statistics.mistakes.map(mistake => `<li>${mistake}</li>`).join('')}</ul>
    `;
    resultsContent.appendChild(stats);

    // Display results grid for multiplication and division modes
    if (['multiplication', 'division'].includes(this.settings.gameMode)) {
      const gridContainer = document.createElement('div');
      gridContainer.id = 'grid-container';

      this.examples.forEach(example => {
        const cell = document.createElement('div');
        cell.classList.add('cell', example.status);
        cell.textContent = example.question;
        gridContainer.appendChild(cell);
      });

      resultsContent.appendChild(gridContainer);
    }
  }

  /**
   * Updates the visibility of the virtual keyboard based on settings.
   */
  updateKeyboardSettings() {
    const { answerInput, virtualKeyboard } = this.elements;
    answerInput.readOnly = this.settings.enableKeyboard;
    virtualKeyboard.classList.toggle('hidden', !this.settings.enableKeyboard);
  }
}

// Initialize the game when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MathGame();
});
