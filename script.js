const texts = {
    beginner: [
        "Hello how are you?",
        "The quick brown fox jumps over the lazy dog.",
        "A quick brown fox jumps over the lazy dog.",
        "The lazy dog sleeps in the sun.",
        "Practice makes perfect.",
        "Type fast and accurately."
    ],
    intermediate: [
        "The quick brown fox jumps over the lazy dog while the sun sets in the west.",
        "Programming is the art of telling another human what one wants the computer to do.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The best way to predict the future is to create it.",
        "Learning to code is learning to create and innovate."
    ],
    advanced: [
        "The quick brown fox jumps over the lazy dog while the sun sets in the west, casting long shadows across the meadow.",
        "In the world of programming, there are no shortcuts to becoming a master. It takes dedication, practice, and continuous learning.",
        "The art of programming is the art of organizing complexity, of mastering multitude and avoiding its bastard chaos as effectively as possible.",
        "Success in programming comes from a combination of technical skills, problem-solving ability, and the willingness to learn from mistakes.",
        "The best programmers are not those who write the most code, but those who write the most elegant solutions to complex problems."
    ]
};


const textDisplay = document.getElementById('textDisplay');
const inputField = document.getElementById('inputField');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timeDisplay = document.getElementById('time');


const practiceBtn = document.getElementById('practiceBtn');
const learnBtn = document.getElementById('learnBtn');
const statsBtn = document.getElementById('statsBtn');


const practiceSection = document.getElementById('practiceSection');
const learnSection = document.getElementById('learnSection');
const statsSection = document.getElementById('statsSection');


let currentText = '';
let startTime;
let timer;
let isTyping = false;
let currentDifficulty = 'beginner';


practiceBtn.addEventListener('click', () => switchSection('practice'));
learnBtn.addEventListener('click', () => switchSection('learn'));
statsBtn.addEventListener('click', () => switchSection('stats'));

function switchSection(section) {
    practiceSection.classList.add('hidden');
    learnSection.classList.add('hidden');
    statsSection.classList.add('hidden');
    
    practiceBtn.classList.remove('active');
    learnBtn.classList.remove('active');
    statsBtn.classList.remove('active');
    
    switch(section) {
        case 'practice':
            practiceSection.classList.remove('hidden');
            practiceBtn.classList.add('active');
            break;
        case 'learn':
            learnSection.classList.remove('hidden');
            learnBtn.classList.add('active');
            break;
        case 'stats':
            statsSection.classList.remove('hidden');
            statsBtn.classList.add('active');
            updateStats();
            break;
    }
}


startBtn.addEventListener('click', startTyping);
resetBtn.addEventListener('click', resetTyping);
inputField.addEventListener('input', checkTyping);

function startTyping() {
    if (!isTyping) {
        isTyping = true;
        inputField.disabled = false;
        inputField.value = '';
        currentText = getRandomText(currentDifficulty);
        textDisplay.textContent = currentText;
        startTime = new Date().getTime();
        timer = setInterval(updateTimer, 1000);
        startBtn.textContent = 'Typing...';
    }
}

function resetTyping() {
    clearInterval(timer);
    isTyping = false;
    inputField.disabled = true;
    inputField.value = '';
    textDisplay.textContent = '';
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '0%';
    timeDisplay.textContent = '0s';
    startBtn.textContent = 'Start';
}

function checkTyping() {
    if (inputField.value === currentText) {
        clearInterval(timer);
        isTyping = false;
        inputField.disabled = true;
        startBtn.textContent = 'Start';
        updateStats();
    }
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
    timeDisplay.textContent = `${timeElapsed}s`;
    
    
    const wordsTyped = inputField.value.trim().split(/\s+/).length;
    const minutes = timeElapsed / 60;
    const wpm = Math.round(wordsTyped / minutes);
    wpmDisplay.textContent = wpm;
    
    const accuracy = calculateAccuracy(inputField.value, currentText);
    accuracyDisplay.textContent = `${accuracy}%`;
}

function calculateAccuracy(input, target) {
    if (input.length === 0) return 0;
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] === target[i]) correct++;
    }
    return Math.round((correct / target.length) * 100);
}

function getRandomText(difficulty) {
    const textArray = texts[difficulty];
    return textArray[Math.floor(Math.random() * textArray.length)];
}

document.querySelectorAll('.start-module').forEach(button => {
    button.addEventListener('click', () => {
        const module = button.closest('.module');
        currentDifficulty = module.dataset.level;
        switchSection('practice');
        startTyping();
    });
});


let stats = {
    sessions: [],
    bestWpm: 0,
    averageWpm: 0,
    averageAccuracy: 0
};

function updateStats() {
    const wpm = parseInt(wpmDisplay.textContent);
    const accuracy = parseInt(accuracyDisplay.textContent);
    
    stats.sessions.push({ wpm, accuracy });
    stats.bestWpm = Math.max(stats.bestWpm, wpm);
    
    
    const totalWpm = stats.sessions.reduce((sum, session) => sum + session.wpm, 0);
    stats.averageWpm = Math.round(totalWpm / stats.sessions.length);
    
   
    const totalAccuracy = stats.sessions.reduce((sum, session) => sum + session.accuracy, 0);
    stats.averageAccuracy = Math.round(totalAccuracy / stats.sessions.length);
    
    
    document.getElementById('avgWpm').textContent = stats.averageWpm;
    document.getElementById('bestWpm').textContent = stats.bestWpm;
    document.getElementById('avgAccuracy').textContent = `${stats.averageAccuracy}%`;
    
   
    localStorage.setItem('typingStats', JSON.stringify(stats));
}


function loadStats() {
    const savedStats = localStorage.getItem('typingStats');
    if (savedStats) {
        stats = JSON.parse(savedStats);
    }
}


loadStats();
