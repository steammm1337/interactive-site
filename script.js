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

    matrixCtx.fillStyle = '#00ff41';
    matrixCtx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
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

        // Terminal boot sound effect (visual)
        const content = document.getElementById(tabId);
        content.style.animation = 'none';
        setTimeout(() => {
            content.style.animation = 'terminalBoot 0.5s ease';
        }, 10);
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
            <button onclick="deleteTodo(${index})">[DELETE]</button>
        `;
        li.style.animation = 'slideInLeft 0.3s ease';
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

                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('⚡ CYBER HUB ALERT', {
                            body: 'COUNTDOWN COMPLETE!',
                        });
                    }
                    alert('⚡ COUNTDOWN COMPLETE!');
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

if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

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
        noteCard.style.animation = 'slideInLeft 0.3s ease';
        noteCard.innerHTML = `
            <div class="note-date">> ${note.date}</div>
            <div class="note-content">${note.content}</div>
            <button onclick="deleteNote(${index})">[DELETE]</button>
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

let isDrawing = false;
let lastX = 0;
let lastY = 0;

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Add glow effect to drawing
ctx.shadowBlur = 10;
ctx.shadowColor = '#00ff41';

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;
    ctx.shadowColor = colorPicker.value;

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

    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;
    ctx.shadowColor = colorPicker.value;

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
    link.download = `cyber-drawing-${Date.now()}.png`;
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

    weatherDisplay.innerHTML = '<p>> SCANNING LOCATION...</p>';

    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        const data = await response.json();

        const current = data.current_condition[0];
        const location = data.nearest_area[0];

        weatherDisplay.innerHTML = `
            <div class="weather-info">
                <h3>> LOCATION: ${location.areaName[0].value}, ${location.country[0].value}</h3>
                <div class="weather-temp">${current.temp_C}°C</div>
                <div class="weather-desc">${current.weatherDesc[0].value}</div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <strong>FEELS LIKE:</strong><br>${current.FeelsLikeC}°C
                    </div>
                    <div class="weather-detail">
                        <strong>HUMIDITY:</strong><br>${current.humidity}%
                    </div>
                    <div class="weather-detail">
                        <strong>WIND SPEED:</strong><br>${current.windspeedKmph} KM/H
                    </div>
                    <div class="weather-detail">
                        <strong>PRESSURE:</strong><br>${current.pressure} MB
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        weatherDisplay.innerHTML = '<p>> ERROR: LOCATION NOT FOUND</p>';
    }
}

getWeatherBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Typing effect for header
const terminalLine = document.querySelector('.terminal-line');
const originalText = terminalLine.textContent;
let charIndex = 0;

function typeWriter() {
    if (charIndex < originalText.length) {
        terminalLine.textContent = originalText.substring(0, charIndex + 1) + '█';
        charIndex++;
        setTimeout(typeWriter, 50);
    } else {
        terminalLine.textContent = originalText;
    }
}

setTimeout(typeWriter, 1000);