// app.js - Jordan's English Practice App Core
// Version 1.0.0

const APP_VERSION = '1.0.0';

// Firebase Configuration - Use your existing config from math app
// const firebaseConfig = {
//     apiKey: "YOUR_KEY",
//     authDomain: "jordan-math-practice.firebaseapp.com",
//     projectId: "jordan-math-practice",
//     storageBucket: "jordan-math-practice.appspot.com",
//     messagingSenderId: "YOUR_ID",
//     appId: "YOUR_APP_ID"
// };

// Comment out Firebase for now - app will use localStorage
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// Global Variables
let currentTopic = '';
let currentPassage = null;
let currentQuestionIndex = 0;
let sessionQuestions = [];
let currentStreak = 0;
let startTime = null;
let usedPassages = [];
let parentAccessAttempts = 0;
let lockoutTime = null;

// User Data Structure
let userData = {
    readingLevel: 460, // From IXL assessment
    wordsLearned: [],
    passagesRead: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    longestStreak: 0,
    dailyGoal: 10,
    completedToday: 0,
    lastActivity: new Date().toISOString(),
    topicProgress: {},
    vocabularyMastery: {},
    achievements: [],
    preferences: {
        textSize: 'medium',
        showDefinitions: true,
        audioSupport: false
    },
    sessionsCompleted: {},
    masteredTopics: []
};

// Parent Settings
let parentSettings = {
    pinHash: null,
    initialized: false,
    lockedTopics: [],
    difficultyLevel: 'adaptive',
    dailyGoalOverride: null,
    textSizeOverride: null,
    lastPinChange: null,
    reportEmails: [],
    weeklyReportEnabled: false
};

// Topic Definitions
const topics = {
    comprehension: {
        name: "Reading Comprehension",
        icon: "📖",
        skills: ["Main ideas", "Cause & effect", "Character analysis", "Inferences", "Themes"],
        level: 440,
        generator: window.PassagesModule
    },
    vocabulary: {
        name: "Vocabulary Building",
        icon: "🔤",
        skills: ["Context clues", "Word meanings", "Idioms", "Synonyms", "Antonyms"],
        level: 520,
        generator: window.VocabularyModule
    },
    writing: {
        name: "Writing Skills",
        icon: "✍️",
        skills: ["Sentence ordering", "Supporting details", "Conclusions", "Opinion writing"],
        level: 500,
        generator: window.WritingModule
    },
    grammar: {
        name: "Grammar Practice",
        icon: "📝",
        skills: ["Verb tenses", "Sentence structure", "Punctuation", "Parts of speech"],
        level: 620,
        generator: window.GrammarModule
    }
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadParentSettings();
    checkDailyReset();
    initializeTopics();
    updateStats();
    updateDailyProgress();
});

// ========== DATA MANAGEMENT ==========
function loadUserData() {
    // Using localStorage for now (Firebase can be added later)
    const saved = localStorage.getItem('jordanEnglishData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            userData = { ...userData, ...data, version: APP_VERSION };
            updateStats();
        } catch (e) {
            console.error("Error parsing saved data:", e);
        }
    }
}

function saveUserData() {
    userData.lastActivity = new Date().toISOString();
    localStorage.setItem('jordanEnglishData', JSON.stringify(userData));
    console.log('User data saved');
}

function loadParentSettings() {
    const saved = localStorage.getItem('jordanEnglishParentSettings');
    if (saved) {
        try {
            parentSettings = JSON.parse(saved);
        } catch (e) {
            console.error("Error parsing parent settings:", e);
        }
    }
    
    // Set default PIN if not initialized
    if (!parentSettings.pinHash) {
        parentSettings.pinHash = hashPIN('1234');
        parentSettings.initialized = false;
        saveParentSettings();
    }
}

function saveParentSettings() {
    localStorage.setItem('jordanEnglishParentSettings', JSON.stringify(parentSettings));
    console.log('Parent settings saved');
}

// ========== UTILITY FUNCTIONS ==========
function hashPIN(pin) {
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
        hash = ((hash << 5) - hash) + pin.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash).toString();
}

function checkDailyReset() {
    const today = new Date().toDateString();
    const lastActivity = userData.lastActivity ? new Date(userData.lastActivity).toDateString() : '';
    
    if (today !== lastActivity) {
        userData.completedToday = 0;
        userData.lastActivity = new Date().toISOString();
        saveUserData();
    }
}

function getReadingLevelName(level) {
    if (level < 400) return "3rd Grade";
    if (level < 500) return "4th Grade";
    if (level < 600) return "5th Grade";
    if (level < 700) return "6th Grade";
    return "7th Grade+";
}

// ========== UI FUNCTIONS ==========
function initializeTopics() {
    const topicSelection = document.getElementById('topicSelection');
    if (!topicSelection) return;
    
    createTopicCards();
    updateDailyProgress();
}

function createTopicCards() {
    const grid = document.getElementById('topicGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (const [key, topic] of Object.entries(topics)) {
        const progress = userData.topicProgress[key] || { completed: 0, total: 20 };
        const card = document.createElement('div');
        card.className = `topic-card ${key}`;
        
        // Check if locked
        if (parentSettings.lockedTopics && parentSettings.lockedTopics.includes(key)) {
            card.className += ' locked';
        }
        
        // Check if mastered
        if (userData.masteredTopics && userData.masteredTopics.includes(key)) {
            card.className += ' mastered';
        }
        
        const progressPercent = (progress.completed / progress.total) * 100;
        
        card.innerHTML = `
            <span class="soccer-theme">⚽</span>
            <div class="topic-name">${topic.icon} ${topic.name} ${parentSettings.lockedTopics?.includes(key) ? '🔒' : ''}</div>
            <div class="topic-progress">
                <div class="topic-progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            <div class="topic-stats">
                Progress: ${progress.completed}/${progress.total} activities
                <br>Level: ${getReadingLevelName(topic.level)}
                ${userData.masteredTopics?.includes(key) ? '<br><strong>🏆 MASTERED!</strong>' : ''}
            </div>
        `;
        
        // Set click handler
        if (parentSettings.lockedTopics?.includes(key)) {
            card.onclick = () => alert("This topic is locked by parent controls");
        } else {
            card.onclick = () => startTopic(key);
        }
        
        grid.appendChild(card);
    }
}

// ========== TOPIC MANAGEMENT ==========
function startTopic(topicKey) {
    currentTopic = topicKey;
    document.getElementById('topicSelection').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    
    const topic = topics[topicKey];
    if (topic && topic.generator) {
        if (topicKey === 'comprehension') {
            // Check if PassagesModule is loaded
            if (window.PassagesModule && window.PassagesModule.startComprehension) {
                window.PassagesModule.startComprehension(userData, parentSettings);
            } else {
                alert("Reading module is loading... Please try again.");
                backToTopics();
            }
        } else if (topic.generator && topic.generator.startPractice) {
            topic.generator.startPractice();
        } else {
            alert(`${topic.name} module coming soon!`);
            backToTopics();
        }
    }
    
    startTime = Date.now();
}

// ========== ANSWER CHECKING ==========
function updateProgress(isCorrect) {
    userData.totalQuestions++;
    
    if (isCorrect) {
        userData.correctAnswers++;
        currentStreak++;
        userData.currentStreak = currentStreak;
        if (currentStreak > userData.longestStreak) {
            userData.longestStreak = currentStreak;
        }
    } else {
        currentStreak = 0;
        userData.currentStreak = 0;
    }
    
    // Update topic progress
    if (!userData.topicProgress[currentTopic]) {
        userData.topicProgress[currentTopic] = { completed: 0, total: 20 };
    }
    if (isCorrect) {
        userData.topicProgress[currentTopic].completed++;
    }
    
    userData.completedToday++;
    saveUserData();
    updateStats();
    updateDailyProgress();
    
    // Check achievements
    checkAchievements();
}

// ========== ACHIEVEMENTS ==========
function checkAchievements() {
    // Check for mastery
    for (const [key, topic] of Object.entries(topics)) {
        const progress = userData.topicProgress[key];
        if (progress && progress.completed >= 20 && !userData.masteredTopics.includes(key)) {
            userData.masteredTopics.push(key);
            showAchievement("Topic Mastered!", `You've mastered ${topic.name}! 🏆`);
        }
    }
    
    // Streak achievements
    if (userData.currentStreak === 5 && !userData.achievements.includes('streak5')) {
        userData.achievements.push('streak5');
        showAchievement("5-Answer Streak!", "You got 5 correct in a row! ⚽");
    }
    
    if (userData.currentStreak === 10 && !userData.achievements.includes('streak10')) {
        userData.achievements.push('streak10');
        showAchievement("10-Answer Streak!", "Amazing! 10 correct answers in a row!");
    }
    
    // Vocabulary achievements
    if (userData.wordsLearned.length === 10 && !userData.achievements.includes('words10')) {
        userData.achievements.push('words10');
        showAchievement("Vocabulary Builder!", "You've learned 10 new words!");
    }
    
    // Reading achievements
    if (userData.passagesRead === 10 && !userData.achievements.includes('passages10')) {
        userData.achievements.push('passages10');
        showAchievement("Bookworm!", "You've read 10 passages! 📚");
    }
    
    // Accuracy achievement
    const accuracy = userData.totalQuestions > 0 ? 
        (userData.correctAnswers / userData.totalQuestions) * 100 : 0;
    if (accuracy >= 90 && userData.totalQuestions >= 20 && !userData.achievements.includes('accuracy90')) {
        userData.achievements.push('accuracy90');
        showAchievement("Accuracy Expert!", "90%+ accuracy achieved!");
    }
    
    saveUserData();
}

function showAchievement(title, message) {
    const popup = document.getElementById('achievementPopup');
    if (popup) {
        document.getElementById('achievementMessage').textContent = message;
        document.querySelector('.achievement-title').textContent = title;
        popup.style.display = 'block';
    } else {
        alert(`🏆 ${title}\n${message}`);
    }
}

function closeAchievement() {
    const popup = document.getElementById('achievementPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// ========== STATISTICS ==========
function updateStats() {
    const readingLevelEl = document.getElementById('readingLevel');
    if (readingLevelEl) {
        readingLevelEl.textContent = getReadingLevelName(userData.readingLevel);
    }
    
    const wordsLearnedEl = document.getElementById('wordsLearned');
    if (wordsLearnedEl) {
        wordsLearnedEl.textContent = userData.wordsLearned.length;
    }
    
    const passagesReadEl = document.getElementById('passagesRead');
    if (passagesReadEl) {
        passagesReadEl.textContent = userData.passagesRead;
    }
    
    const accuracy = userData.totalQuestions > 0 ? 
        Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0;
    
    const accuracyEl = document.getElementById('accuracy');
    if (accuracyEl) {
        accuracyEl.textContent = accuracy + '%';
    }
    
    const streakEl = document.getElementById('streak');
    if (streakEl) {
        streakEl.textContent = userData.currentStreak + ' 🔥';
    }
}

function updateDailyProgress() {
    const goalAmount = parentSettings.dailyGoalOverride || userData.dailyGoal;
    const progress = Math.min((userData.completedToday / goalAmount) * 100, 100);
    const progressBar = document.getElementById('dailyProgress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
        progressBar.textContent = `Daily Goal: ${userData.completedToday}/${goalAmount} activities`;
    }
    
    // Check if daily goal reached
    if (userData.completedToday >= goalAmount && !userData.achievements.includes(`daily${new Date().toDateString()}`)) {
        userData.achievements.push(`daily${new Date().toDateString()}`);
        showAchievement("Daily Goal Reached!", "Great job completing your daily practice! 🎉");
    }
}

// ========== NAVIGATION ==========
function backToTopics() {
    document.getElementById('topicSelection').style.display = 'block';
    document.getElementById('questionContainer').style.display = 'none';
    createTopicCards();
    updateDailyProgress();
}

function selectAnswer(index) {
    const options = document.querySelectorAll('.answer-option');
    options.forEach(opt => opt.classList.remove('selected'));
    if (options[index]) {
        options[index].classList.add('selected');
    }
}

function showHint() {
    alert("💡 Hint: Read the passage carefully and look for key words from the question!");
}

// ========== PARENT ACCESS ==========
function showParentAccess() {
    if (!parentSettings.pinHash) {
        parentSettings.pinHash = hashPIN('1234');
        parentSettings.initialized = false;
        saveParentSettings();
    }
    
    if (lockoutTime && new Date() < lockoutTime) {
        const remainingTime = Math.ceil((lockoutTime - new Date()) / 1000);
        alert(`Too many incorrect attempts. Please wait ${remainingTime} seconds.`);
        return;
    }
    
    const modal = document.getElementById('parentModal');
    const modalContent = document.querySelector('.modal-content');
    
    if (modal && modalContent) {
        modalContent.innerHTML = `
            <span class="close" onclick="closeParentModal()">&times;</span>
            <h2>🔐 Parent Access</h2>
            <div style="text-align: center; padding: 20px;">
                ${!parentSettings.initialized ? 
                    '<p style="color: #e53e3e; font-weight: bold;">First Time Setup: Default PIN is 1234. Please change it!</p>' : 
                    '<p>Enter your 4-digit PIN to access parent controls</p>'}
                <input type="password" id="parentPIN" maxlength="4" pattern="[0-9]*" inputmode="numeric"
                       style="font-size: 24px; padding: 10px; width: 150px; text-align: center; border: 2px solid #667eea; border-radius: 10px;"
                       onkeypress="if(event.key==='Enter') verifyParentPIN()">
                <br><br>
                <button class="btn btn-primary" onclick="verifyParentPIN()">Submit</button>
                <div id="pinError" style="color: red; margin-top: 10px;"></div>
            </div>
        `;
        
        modal.style.display = 'flex';
        document.getElementById('parentPIN').focus();
    } else {
        alert("Parent Dashboard - Default PIN: 1234\n(Full dashboard interface coming soon)");
    }
}

function verifyParentPIN() {
    const enteredPIN = document.getElementById('parentPIN').value;
    const errorDiv = document.getElementById('pinError');
    
    if (enteredPIN.length !== 4) {
        errorDiv.textContent = 'PIN must be 4 digits';
        return;
    }
    
    if (hashPIN(enteredPIN) === parentSettings.pinHash) {
        parentAccessAttempts = 0;
        showParentDashboard();
    } else {
        parentAccessAttempts++;
        if (parentAccessAttempts >= 3) {
            lockoutTime = new Date(Date.now() + 5 * 60 * 1000);
            errorDiv.textContent = 'Too many attempts. Locked for 5 minutes.';
            setTimeout(() => closeParentModal(), 2000);
        } else {
            errorDiv.textContent = `Incorrect PIN. ${3 - parentAccessAttempts} attempts remaining.`;
            document.getElementById('parentPIN').value = '';
        }
    }
}

function showParentDashboard() {
    // Simple parent dashboard for now
    const accuracy = userData.totalQuestions > 0 ? 
        Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0;
    
    alert(`
📊 Jordan's Progress Report
━━━━━━━━━━━━━━━━━━━━━
Reading Level: ${getReadingLevelName(userData.readingLevel)}
Passages Read: ${userData.passagesRead}
Words Learned: ${userData.wordsLearned.length}
Overall Accuracy: ${accuracy}%
Current Streak: ${userData.currentStreak}
Daily Progress: ${userData.completedToday}/${userData.dailyGoal}

Target: 6th Grade Reading Level
Current: 4th Grade (needs improvement)

Focus Areas:
• Reading comprehension strategies
• Vocabulary building with context clues
• Main idea identification

Full dashboard interface coming soon!
    `);
    
    closeParentModal();
}

function closeParentModal() {
    const modal = document.getElementById('parentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========== GLOBAL EXPORTS ==========
// Make functions available globally for modules and onclick handlers
window.userData = userData;
window.parentSettings = parentSettings;
window.currentTopic = currentTopic;
window.currentStreak = currentStreak;
window.topics = topics;
window.saveUserData = saveUserData;
window.saveParentSettings = saveParentSettings;
window.hashPIN = hashPIN;
window.updateStats = updateStats;
window.updateDailyProgress = updateDailyProgress;
window.updateProgress = updateProgress;
window.backToTopics = backToTopics;
window.selectAnswer = selectAnswer;
window.showHint = showHint;
window.showParentAccess = showParentAccess;
window.verifyParentPIN = verifyParentPIN;
window.closeParentModal = closeParentModal;
window.showAchievement = showAchievement;
window.closeAchievement = closeAchievement;
window.getReadingLevelName = getReadingLevelName;
window.checkAchievements = checkAchievements;

console.log('Jordan\'s English Practice App v' + APP_VERSION + ' loaded');
