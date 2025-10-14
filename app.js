// app.js - Jordan's English Practice App Core with Firebase
// Version 1.0.0

const APP_VERSION = '1.0.0';
const CACHE_BUSTER = Date.now(); 

// Firebase Configuration - Using your existing math practice project
const firebaseConfig = {
    apiKey: "AIzaSyDYpd-RQ3G7fiAZvT8Crx3lU5gVjbvLjHU",
    authDomain: "jordan-math-practice.firebaseapp.com",
    projectId: "jordan-math-practice",
    storageBucket: "jordan-math-practice.appspot.com",
    messagingSenderId: "482301964012",
    appId: "1:482301964012:web:7e2b3f89e0da431e2b8c9e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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

// User Data Structure with defaults
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
    achievementPoints: 0,
    preferences: {
        textSize: 'medium',
        showDefinitions: true,
        audioSupport: false
    },
    sessionsCompleted: {},
    masteredTopics: [],
    version: APP_VERSION
};

// Parent Settings with defaults
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
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Jordan\'s English Practice App v' + APP_VERSION + ' loading...');
    
    // Load data
    await loadUserData();
    await loadParentSettings();
    
    // Initialize app
    checkDailyReset();
    initializeTopics();
    updateStats();
    updateDailyProgress();
    
    console.log('App loaded successfully!');
});

// ========== DATA MANAGEMENT WITH FIREBASE ==========

// Load user data from Firebase with localStorage fallback
async function loadUserData() {
    try {
        const doc = await db.collection('english-users').doc('jordan').get();
        if (doc.exists) {
            const data = doc.data();
            // Merge with defaults to ensure all fields exist
            userData = { 
                ...userData,  // Default values
                ...data,      // Override with saved data
                version: APP_VERSION  // Update version
            };
            console.log('User data loaded from Firebase');
        } else {
            // First time user - create document
            console.log('Creating new user document in Firebase');
            await saveUserData();
        }
    } catch (error) {
        console.error("Error loading from Firebase:", error);
        // Fallback to localStorage
        const localData = localStorage.getItem('jordanEnglishData');
        if (localData) {
            try {
                const parsedData = JSON.parse(localData);
                userData = { ...userData, ...parsedData, version: APP_VERSION };
                console.log('User data loaded from localStorage');
            } catch (e) {
                console.error("Error parsing localStorage data:", e);
            }
        }
    }
    updateStats();
}

// Save user data to Firebase and localStorage
async function saveUserData() {
    userData.lastActivity = new Date().toISOString();
    userData.version = APP_VERSION;
    
    try {
        // Save to Firebase
        await db.collection('english-users').doc('jordan').set(userData);
        console.log('Data saved to Firebase');
        
        // Also save to localStorage as backup
        localStorage.setItem('jordanEnglishData', JSON.stringify(userData));
    } catch (error) {
        console.error("Firebase save error:", error);
        // If Firebase fails, at least save locally
        localStorage.setItem('jordanEnglishData', JSON.stringify(userData));
        console.log('Data saved to localStorage only');
    }
}

// Load parent settings from Firebase
async function loadParentSettings() {
    try {
        const doc = await db.collection('english-settings').doc('parent').get();
        if (doc.exists) {
            parentSettings = doc.data();
            window.parentSettings = parentSettings;
            console.log('Parent settings loaded from Firebase');
            // Save to localStorage as backup
            localStorage.setItem('jordanEnglishParentSettings', JSON.stringify(parentSettings));
        } else {
            // Check localStorage
            const localSettings = localStorage.getItem('jordanEnglishParentSettings');
            if (localSettings) {
                parentSettings = JSON.parse(localSettings);
                window.parentSettings = parentSettings;
                console.log('Parent settings loaded from localStorage');
                // Try to save to Firebase
                await saveParentSettings();
            }
        }
    } catch (error) {
        console.error("Error loading parent settings:", error);
        // Fallback to localStorage
        const localSettings = localStorage.getItem('jordanEnglishParentSettings');
        if (localSettings) {
            try {
                parentSettings = JSON.parse(localSettings);
                window.parentSettings = parentSettings;
            } catch (e) {
                console.error("Error parsing parent settings:", e);
            }
        }
    }
    
    // Set default PIN if not initialized
    if (!parentSettings.pinHash) {
        parentSettings.pinHash = hashPIN('1234');
        parentSettings.initialized = false;
        await saveParentSettings();
    }
}

// Save parent settings to Firebase and localStorage
async function saveParentSettings() {
    try {
        // Save to Firebase
        await db.collection('english-settings').doc('parent').set(parentSettings);
        console.log('Parent settings saved to Firebase');
        
        // Also save to localStorage
        localStorage.setItem('jordanEnglishParentSettings', JSON.stringify(parentSettings));
    } catch (error) {
        console.error("Error saving parent settings:", error);
        // If Firebase fails, at least save locally
        localStorage.setItem('jordanEnglishParentSettings', JSON.stringify(parentSettings));
    }
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
        console.log('New day - resetting daily progress');
        userData.completedToday = 0;
        userData.lastActivity = new Date().toISOString();
        // Don't await here to avoid blocking initialization
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
    if (!topicSelection) {
        console.error('Topic selection container not found');
        return;
    }
    
    createTopicCards();
    updateDailyProgress();
}

function createTopicCards() {
    const grid = document.getElementById('topicGrid');
    if (!grid) {
        console.error('Topic grid not found');
        return;
    }
    
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
        
        const progressPercent = Math.min((progress.completed / progress.total) * 100, 100);
        
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
    console.log('🎯 Starting topic:', topicKey);
    console.log('📦 PassagesModule exists?', !!window.PassagesModule);
    console.log('🚀 startComprehension exists?', !!window.PassagesModule?.startComprehension);
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

// ========== ANSWER CHECKING & PROGRESS ==========

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
    
    // Save progress (don't await to keep UI responsive)
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
            if (!userData.masteredTopics) userData.masteredTopics = [];
            userData.masteredTopics.push(key);
            showAchievement("Topic Mastered!", `You've mastered ${topic.name}! 🏆`);
            saveUserData();
        }
    }
    
    // Use achievements module if available
    if (window.AchievementsModule) {
        window.AchievementsModule.checkAchievements(userData, currentTopic, topics);
    } else {
        // Basic achievement checks
        if (userData.currentStreak === 5 && !userData.achievements.includes('streak5')) {
            userData.achievements.push('streak5');
            showAchievement("5-Answer Streak!", "You got 5 correct in a row! ⚽");
        }
        
        if (userData.currentStreak === 10 && !userData.achievements.includes('streak10')) {
            userData.achievements.push('streak10');
            showAchievement("10-Answer Streak!", "Amazing! 10 correct answers in a row!");
        }
        
        if (userData.wordsLearned.length === 10 && !userData.achievements.includes('words10')) {
            userData.achievements.push('words10');
            showAchievement("Vocabulary Builder!", "You've learned 10 new words!");
        }
        
        if (userData.passagesRead === 10 && !userData.achievements.includes('passages10')) {
            userData.achievements.push('passages10');
            showAchievement("Bookworm!", "You've read 10 passages! 📚");
        }
    }
}

function showAchievement(title, message) {
    const popup = document.getElementById('achievementPopup');
    if (popup) {
        const titleEl = popup.querySelector('.achievement-title');
        const messageEl = document.getElementById('achievementMessage');
        
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        
        popup.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            popup.style.display = 'none';
        }, 5000);
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
        if (!userData.achievements) userData.achievements = [];
        userData.achievements.push(`daily${new Date().toDateString()}`);
        showAchievement("Daily Goal Reached!", "Great job completing your daily practice! 🎉");
        saveUserData();
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
    
    // Use ParentDashboard module if available
    if (window.ParentDashboard) {
        window.ParentDashboard.show(parentSettings, userData, topics);
    } else {
        // Fallback to basic PIN prompt
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
            alert("Parent Dashboard - Default PIN: 1234");
        }
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
    if (window.ParentDashboard) {
        window.ParentDashboard.showDashboard();
    } else {
        // Basic dashboard
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

Full dashboard available when all modules are loaded.
        `);
    }
    
    closeParentModal();
}

function closeParentModal() {
    const modal = document.getElementById('parentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========== TEST FIREBASE CONNECTION ==========

async function testFirebaseConnection() {
    try {
        // Try to write a test field
        await db.collection('english-users').doc('test-connection').set({
            testField: 'Connection successful',
            timestamp: new Date().toISOString(),
            version: APP_VERSION
        });
        
        // Try to read it back
        const doc = await db.collection('english-users').doc('test-connection').get();
        if (doc.exists) {
            console.log('✅ Firebase connection test successful!');
            // Clean up test document
            await db.collection('english-users').doc('test-connection').delete();
        }
    } catch (error) {
        console.error('❌ Firebase connection test failed:', error);
        console.log('App will use localStorage as fallback');
    }
}

// Run connection test on load
window.addEventListener('load', testFirebaseConnection);

// ========== GLOBAL EXPORTS ==========
// Make functions available globally for modules and onclick handlers

// Use getters to ensure we always get current values
Object.defineProperty(window, 'userData', {
    get: function() { return userData; },
    set: function(val) { userData = val; }
});

Object.defineProperty(window, 'parentSettings', {
    get: function() { return parentSettings; },
    set: function(val) { parentSettings = val; }
});

Object.defineProperty(window, 'currentStreak', {
    get: function() { return currentStreak; },
    set: function(val) { currentStreak = val; }
});

Object.defineProperty(window, 'currentTopic', {
    get: function() { return currentTopic; },
    set: function(val) { currentTopic = val; }
});

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
window.showParentDashboard = showParentDashboard;
