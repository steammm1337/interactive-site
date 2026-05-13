// Matrix Rain Effect
const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas.getContext('2d');

matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';
const fontSize = 16;
const columns = matrixCanvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}

function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    matrixCtx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const hue = (drops[i] * 2) % 360;
        matrixCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;

        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        matrixCtx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
});

// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Todo List
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
            <span>${todo.text}</span>
            <button onclick="deleteTodo(${index})">DELETE</button>
        `;
        todoList.appendChild(li);
    });
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        localStorage.setItem('todos', JSON.stringify(todos));
        todoInput.value = '';
        renderTodos();
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

renderTodos();

// Calculator
const calcDisplay = document.getElementById('calc-display');
const calcBtns = document.querySelectorAll('.calc-btn');

let currentValue = '0';
let previousValue = '';
let operation = null;

calcBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.dataset.value;

        if (value === 'C') {
            currentValue = '0';
            previousValue = '';
            operation = null;
        } else if (value === '=') {
            if (operation && previousValue) {
                currentValue = calculate(previousValue, currentValue, operation);
                operation = null;
                previousValue = '';
            }
        } else if (['+', '-', '*', '/'].includes(value)) {
            if (operation && previousValue) {
                currentValue = calculate(previousValue, currentValue, operation);
            }
            previousValue = currentValue;
            currentValue = '0';
            operation = value;
        } else {
            if (currentValue === '0' && value !== '.') {
                currentValue = value;
            } else {
                currentValue += value;
            }
        }

        calcDisplay.textContent = currentValue;
    });
});

function calculate(a, b, op) {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);

    switch(op) {
        case '+': return String(num1 + num2);
        case '-': return String(num1 - num2);
        case '*': return String(num1 * num2);
        case '/': return String(num1 / num2);
        default: return b;
    }
}

// Timer
const timerDisplay = document.getElementById('timer-display');
const timerMinutes = document.getElementById('timer-minutes');
const timerSeconds = document.getElementById('timer-seconds');
const timerStart = document.getElementById('timer-start');
const timerPause = document.getElementById('timer-pause');
const timerReset = document.getElementById('timer-reset');

let timerInterval = null;
let timeLeft = 0;
let isRunning = false;

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        if (timeLeft === 0) {
            const mins = parseInt(timerMinutes.value) || 0;
            const secs = parseInt(timerSeconds.value) || 0;
            timeLeft = mins * 60 + secs;
        }

        if (timeLeft > 0) {
            isRunning = true;
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();

                if (timeLeft === 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    alert('⏰ Time is up!');
                }
            }, 1000);
        }
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 0;
    timerMinutes.value = '';
    timerSeconds.value = '';
    updateTimerDisplay();
}

timerStart.addEventListener('click', startTimer);
timerPause.addEventListener('click', pauseTimer);
timerReset.addEventListener('click', resetTimer);

updateTimerDisplay();

// Notes
const notesArea = document.getElementById('notes-area');
const saveNoteBtn = document.getElementById('save-note');
const clearNoteBtn = document.getElementById('clear-note');
const savedNotesDiv = document.getElementById('saved-notes');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function renderNotes() {
    savedNotesDiv.innerHTML = '';
    notes.forEach((note, index) => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <div class="note-date">${note.date}</div>
            <div class="note-content">${note.content}</div>
            <button onclick="deleteNote(${index})">DELETE</button>
        `;
        savedNotesDiv.appendChild(noteCard);
    });
}

function saveNote() {
    const content = notesArea.value.trim();
    if (content) {
        const date = new Date().toLocaleString('ru-RU');
        notes.unshift({ content, date });
        localStorage.setItem('notes', JSON.stringify(notes));
        notesArea.value = '';
        renderNotes();
    }
}

function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function clearNote() {
    notesArea.value = '';
}

saveNoteBtn.addEventListener('click', saveNote);
clearNoteBtn.addEventListener('click', clearNote);

renderNotes();

// Drawing Canvas
const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveCanvasBtn = document.getElementById('save-canvas');
const rainbowModeBtn = document.getElementById('rainbow-mode');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let rainbowMode = false;
let hue = 0;

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

rainbowModeBtn.addEventListener('click', () => {
    rainbowMode = !rainbowMode;
    rainbowModeBtn.textContent = rainbowMode ? 'NORMAL MODE' : 'RAINBOW MODE';
    rainbowModeBtn.style.background = rainbowMode ? 'linear-gradient(90deg, #ff0000, #00ff00, #0000ff)' : '';
});

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    if (rainbowMode) {
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        hue = (hue + 2) % 360;
    } else {
        ctx.strokeStyle = colorPicker.value;
    }

    ctx.lineWidth = brushSize.value;
    ctx.shadowBlur = 15;
    ctx.shadowColor = ctx.strokeStyle;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDrawing = true;
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();

    if (rainbowMode) {
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        hue = (hue + 2) % 360;
    } else {
        ctx.strokeStyle = colorPicker.value;
    }

    ctx.lineWidth = brushSize.value;
    ctx.shadowBlur = 15;
    ctx.shadowColor = ctx.strokeStyle;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();

    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
});

canvas.addEventListener('touchend', () => isDrawing = false);

clearCanvasBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveCanvasBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `artwork-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

// Weather
const cityInput = document.getElementById('city-input');
const getWeatherBtn = document.getElementById('get-weather');
const weatherDisplay = document.getElementById('weather-display');

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    weatherDisplay.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        const data = await response.json();

        const current = data.current_condition[0];
        const location = data.nearest_area[0];

        weatherDisplay.innerHTML = `
            <div class="weather-info">
                <h3>${location.areaName[0].value}, ${location.country[0].value}</h3>
                <div class="weather-temp">${current.temp_C}°C</div>
                <div class="weather-desc">${current.weatherDesc[0].value}</div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <strong>Feels Like:</strong><br>${current.FeelsLikeC}°C
                    </div>
                    <div class="weather-detail">
                        <strong>Humidity:</strong><br>${current.humidity}%
                    </div>
                    <div class="weather-detail">
                        <strong>Wind Speed:</strong><br>${current.windspeedKmph} km/h
                    </div>
                    <div class="weather-detail">
                        <strong>Pressure:</strong><br>${current.pressure} mb
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        weatherDisplay.innerHTML = '<p>Error loading data. Check city name.</p>';
    }
}

getWeatherBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});

// Password Generator
const passwordDisplay = document.getElementById('password-display');
const passwordLength = document.getElementById('password-length');
const lengthValue = document.getElementById('length-value');
const includeUppercase = document.getElementById('include-uppercase');
const includeLowercase = document.getElementById('include-lowercase');
const includeNumbers = document.getElementById('include-numbers');
const includeSymbols = document.getElementById('include-symbols');
const generatePasswordBtn = document.getElementById('generate-password');
const copyPasswordBtn = document.getElementById('copy-password');

passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
});

function generatePassword() {
    const length = parseInt(passwordLength.value);
    let chars = '';

    if (includeUppercase.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers.checked) chars += '0123456789';
    if (includeSymbols.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (chars === '') {
        passwordDisplay.textContent = 'Select at least one option';
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    passwordDisplay.textContent = password;
}

function copyPassword() {
    const password = passwordDisplay.textContent;
    if (password && password !== 'Click Generate') {
        navigator.clipboard.writeText(password);
        copyPasswordBtn.textContent = 'COPIED!';
        setTimeout(() => {
            copyPasswordBtn.textContent = 'COPY';
        }, 2000);
    }
}

generatePasswordBtn.addEventListener('click', generatePassword);
copyPasswordBtn.addEventListener('click', copyPassword);

// Currency Converter
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const resultInput = document.getElementById('result');
const convertBtn = document.getElementById('convert-btn');
const conversionRate = document.getElementById('conversion-rate');

async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (!amount || amount <= 0) {
        resultInput.value = '';
        conversionRate.textContent = 'Please enter a valid amount';
        return;
    }

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await response.json();

        const rate = data.rates[to];
        const result = (amount * rate).toFixed(2);

        resultInput.value = result;
        conversionRate.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    } catch (error) {
        conversionRate.textContent = 'Error fetching rates';
    }
}

convertBtn.addEventListener('click', convertCurrency);
amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') convertCurrency();
});

// Snake Game
const gameCanvas = document.getElementById('game-canvas');
const gameCtx = gameCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const startGameBtn = document.getElementById('start-game');
const pauseGameBtn = document.getElementById('pause-game');

const gridSize = 20;
const tileCount = gameCanvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop = null;
let gamePaused = false;

highScoreDisplay.textContent = highScore;

function drawGame() {
    if (gamePaused) return;

    // Move snake
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;

        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }

        // Generate new food
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } else {
        snake.pop();
    }

    // Clear canvas
    gameCtx.fillStyle = '#000';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw snake with RGB effect
    snake.forEach((segment, index) => {
        const hue = (index * 10) % 360;
        gameCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        gameCtx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw food
    gameCtx.fillStyle = '#ff0000';
    gameCtx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function gameOver() {
    clearInterval(gameLoop);
    gameLoop = null;
    alert(`Game Over! Score: ${score}`);
    startGameBtn.textContent = 'START GAME';
}

function startGame() {
    if (gameLoop) {
        // Reset game
        clearInterval(gameLoop);
        snake = [{x: 10, y: 10}];
        dx = 0;
        dy = 0;
        score = 0;
        scoreDisplay.textContent = score;
        gamePaused = false;
        pauseGameBtn.textContent = 'PAUSE';
    }

    gameLoop = setInterval(drawGame, 100);
    startGameBtn.textContent = 'RESTART';
}

function pauseGame() {
    if (gameLoop) {
        gamePaused = !gamePaused;
        pauseGameBtn.textContent = gamePaused ? 'RESUME' : 'PAUSE';
    }
}

startGameBtn.addEventListener('click', startGame);
pauseGameBtn.addEventListener('click', pauseGame);

// Game controls
document.addEventListener('keydown', (e) => {
    if (!gameLoop) return;

    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});