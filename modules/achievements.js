// achievements.js - Achievements and Rewards Module

window.AchievementsModule = (function() {
    'use strict';
    
    // Achievement definitions
    const achievements = {
        // Streak achievements
        streak5: {
            id: 'streak5',
            name: '5-Answer Streak!',
            description: 'Got 5 correct answers in a row',
            icon: '🔥',
            points: 50,
            trigger: (userData) => userData.currentStreak >= 5
        },
        streak10: {
            id: 'streak10',
            name: '10-Answer Streak!',
            description: 'Got 10 correct answers in a row',
            icon: '🔥🔥',
            points: 100,
            trigger: (userData) => userData.currentStreak >= 10
        },
        streak20: {
            id: 'streak20',
            name: 'On Fire!',
            description: 'Got 20 correct answers in a row',
            icon: '🔥🔥🔥',
            points: 200,
            trigger: (userData) => userData.currentStreak >= 20
        },
        
        // Reading achievements
        passages5: {
            id: 'passages5',
            name: 'Reader',
            description: 'Read 5 passages',
            icon: '📖',
            points: 50,
            trigger: (userData) => userData.passagesRead >= 5
        },
        passages10: {
            id: 'passages10',
            name: 'Bookworm',
            description: 'Read 10 passages',
            icon: '📚',
            points: 100,
            trigger: (userData) => userData.passagesRead >= 10
        },
        passages25: {
            id: 'passages25',
            name: 'Reading Champion',
            description: 'Read 25 passages',
            icon: '📚🏆',
            points: 250,
            trigger: (userData) => userData.passagesRead >= 25
        },
        passages50: {
            id: 'passages50',
            name: 'Super Reader',
            description: 'Read 50 passages',
            icon: '📚⭐',
            points: 500,
            trigger: (userData) => userData.passagesRead >= 50
        },
        
        // Vocabulary achievements
        words10: {
            id: 'words10',
            name: 'Vocabulary Builder',
            description: 'Learned 10 new words',
            icon: '🔤',
            points: 50,
            trigger: (userData) => userData.wordsLearned.length >= 10
        },
        words25: {
            id: 'words25',
            name: 'Word Master',
            description: 'Learned 25 new words',
            icon: '🔤⭐',
            points: 100,
            trigger: (userData) => userData.wordsLearned.length >= 25
        },
        words50: {
            id: 'words50',
            name: 'Vocabulary Expert',
            description: 'Learned 50 new words',
            icon: '🔤🏆',
            points: 250,
            trigger: (userData) => userData.wordsLearned.length >= 50
        },
        
        // Accuracy achievements
        accuracy80: {
            id: 'accuracy80',
            name: 'Sharp Mind',
            description: 'Achieved 80% accuracy (20+ questions)',
            icon: '🎯',
            points: 100,
            trigger: (userData) => {
                const accuracy = userData.totalQuestions > 0 ? 
                    (userData.correctAnswers / userData.totalQuestions) * 100 : 0;
                return accuracy >= 80 && userData.totalQuestions >= 20;
            }
        },
        accuracy90: {
            id: 'accuracy90',
            name: 'Accuracy Expert',
            description: 'Achieved 90% accuracy (20+ questions)',
            icon: '🎯⭐',
            points: 200,
            trigger: (userData) => {
                const accuracy = userData.totalQuestions > 0 ? 
                    (userData.correctAnswers / userData.totalQuestions) * 100 : 0;
                return accuracy >= 90 && userData.totalQuestions >= 20;
            }
        },
        accuracy95: {
            id: 'accuracy95',
            name: 'Perfectionist',
            description: 'Achieved 95% accuracy (50+ questions)',
            icon: '🎯🏆',
            points: 500,
            trigger: (userData) => {
                const accuracy = userData.totalQuestions > 0 ? 
                    (userData.correctAnswers / userData.totalQuestions) * 100 : 0;
                return accuracy >= 95 && userData.totalQuestions >= 50;
            }
        },
        
        // Topic mastery achievements
        comprehensionMaster: {
            id: 'comprehensionMaster',
            name: 'Reading Comprehension Master',
            description: 'Completed 20 comprehension activities',
            icon: '📖🏆',
            points: 200,
            trigger: (userData) => {
                const progress = userData.topicProgress.comprehension;
                return progress && progress.completed >= 20;
            }
        },
        vocabularyMaster: {
            id: 'vocabularyMaster',
            name: 'Vocabulary Master',
            description: 'Completed 20 vocabulary activities',
            icon: '🔤🏆',
            points: 200,
            trigger: (userData) => {
                const progress = userData.topicProgress.vocabulary;
                return progress && progress.completed >= 20;
            }
        },
        writingMaster: {
            id: 'writingMaster',
            name: 'Writing Master',
            description: 'Completed 20 writing activities',
            icon: '✍️🏆',
            points: 200,
            trigger: (userData) => {
                const progress = userData.topicProgress.writing;
                return progress && progress.completed >= 20;
            }
        },
        grammarMaster: {
            id: 'grammarMaster',
            name: 'Grammar Master',
            description: 'Completed 20 grammar activities',
            icon: '📝🏆',
            points: 200,
            trigger: (userData) => {
                const progress = userData.topicProgress.grammar;
                return progress && progress.completed >= 20;
            }
        },
        
        // Daily goal achievements
        dailyGoal: {
            id: 'dailyGoal',
            name: 'Daily Goal Reached',
            description: 'Completed daily practice goal',
            icon: '✅',
            points: 50,
            trigger: (userData) => userData.completedToday >= (userData.dailyGoal || 10)
        },
        weekStreak: {
            id: 'weekStreak',
            name: 'Week Warrior',
            description: 'Met daily goal for 7 days in a row',
            icon: '📅⭐',
            points: 300,
            trigger: (userData) => false // This would need date tracking
        },
        
        // Special achievements
        soccerFan: {
            id: 'soccerFan',
            name: 'Soccer Scholar',
            description: 'Read 10 soccer-themed passages',
            icon: '⚽📚',
            points: 100,
            trigger: (userData) => false // Would need to track theme
        },
        earlyBird: {
            id: 'earlyBird',
            name: 'Early Bird',
            description: 'Practiced before 8 AM',
            icon: '🌅',
            points: 50,
            trigger: (userData) => {
                const hour = new Date().getHours();
                return hour < 8;
            }
        },
        nightOwl: {
            id: 'nightOwl',
            name: 'Night Owl',
            description: 'Practiced after 8 PM',
            icon: '🦉',
            points: 50,
            trigger: (userData) => {
                const hour = new Date().getHours();
                return hour >= 20;
            }
        },
        
        // Milestone achievements
        questions100: {
            id: 'questions100',
            name: 'Century Club',
            description: 'Answered 100 questions total',
            icon: '💯',
            points: 100,
            trigger: (userData) => userData.totalQuestions >= 100
        },
        questions500: {
            id: 'questions500',
            name: 'Question Master',
            description: 'Answered 500 questions total',
            icon: '💯⭐',
            points: 500,
            trigger: (userData) => userData.totalQuestions >= 500
        },
        questions1000: {
            id: 'questions1000',
            name: 'Question Legend',
            description: 'Answered 1000 questions total',
            icon: '💯🏆',
            points: 1000,
            trigger: (userData) => userData.totalQuestions >= 1000
        }
    };
    
    // Check for new achievements
    function checkAchievements(userData, currentTopic, topics) {
        if (!userData.achievements) {
            userData.achievements = [];
        }
        
        if (!userData.achievementPoints) {
            userData.achievementPoints = 0;
        }
        
        const newAchievements = [];
        
        // Check each achievement
        for (const [key, achievement] of Object.entries(achievements)) {
            // Skip if already earned
            if (userData.achievements.includes(achievement.id)) {
                continue;
            }
            
            // Check if triggered
            if (achievement.trigger(userData)) {
                userData.achievements.push(achievement.id);
                userData.achievementPoints += achievement.points;
                newAchievements.push(achievement);
            }
        }
        
        // Show notifications for new achievements
        if (newAchievements.length > 0) {
            showMultipleAchievements(newAchievements);
            window.saveUserData();
        }
        
        // Check for topic mastery
        checkTopicMastery(userData, currentTopic, topics);
    }
    
    // Check if a topic has been mastered
    function checkTopicMastery(userData, currentTopic, topics) {
        if (!userData.masteredTopics) {
            userData.masteredTopics = [];
        }
        
        // Check current topic for mastery
        if (currentTopic && topics[currentTopic]) {
            const progress = userData.topicProgress[currentTopic];
            if (progress && progress.completed >= 20 && !userData.masteredTopics.includes(currentTopic)) {
                userData.masteredTopics.push(currentTopic);
                showAchievement(
                    'Topic Mastered!',
                    `You've mastered ${topics[currentTopic].name}! 🏆`
                );
                window.saveUserData();
            }
        }
    }
    
    // Show achievement notification
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
            // Fallback to alert if popup doesn't exist
            alert(`🏆 ${title}\n${message}`);
        }
    }
    
    // Show multiple achievements
    function showMultipleAchievements(achievementsList) {
        if (achievementsList.length === 0) return;
        
        // Show first achievement
        const first = achievementsList[0];
        showAchievement(
            `${first.icon} ${first.name}`,
            `${first.description}\n+${first.points} points!`
        );
        
        // Queue remaining achievements
        for (let i = 1; i < achievementsList.length; i++) {
            setTimeout(() => {
                const achievement = achievementsList[i];
                showAchievement(
                    `${achievement.icon} ${achievement.name}`,
                    `${achievement.description}\n+${achievement.points} points!`
                );
            }, i * 3000); // Show each achievement 3 seconds apart
        }
    }
    
    // Get list of all achievements with status
    function getAllAchievements(userData) {
        const achievementList = [];
        
        for (const [key, achievement] of Object.entries(achievements)) {
            achievementList.push({
                ...achievement,
                earned: userData.achievements?.includes(achievement.id) || false,
                progress: getAchievementProgress(achievement, userData)
            });
        }
        
        return achievementList;
    }
    
    // Get progress toward an achievement
    function getAchievementProgress(achievement, userData) {
        // Calculate progress based on achievement type
        switch(achievement.id) {
            case 'streak5': return `${userData.currentStreak}/5`;
            case 'streak10': return `${userData.currentStreak}/10`;
            case 'streak20': return `${userData.currentStreak}/20`;
            case 'passages5': return `${userData.passagesRead}/5`;
            case 'passages10': return `${userData.passagesRead}/10`;
            case 'passages25': return `${userData.passagesRead}/25`;
            case 'passages50': return `${userData.passagesRead}/50`;
            case 'words10': return `${userData.wordsLearned.length}/10`;
            case 'words25': return `${userData.wordsLearned.length}/25`;
            case 'words50': return `${userData.wordsLearned.length}/50`;
            case 'questions100': return `${userData.totalQuestions}/100`;
            case 'questions500': return `${userData.totalQuestions}/500`;
            case 'questions1000': return `${userData.totalQuestions}/1000`;
            case 'dailyGoal': return `${userData.completedToday}/${userData.dailyGoal || 10}`;
            default: return '';
        }
    }
    
    // Calculate total possible points
    function getTotalPossiblePoints() {
        let total = 0;
        for (const achievement of Object.values(achievements)) {
            total += achievement.points;
        }
        return total;
    }
    
    // Public API
    return {
        checkAchievements: checkAchievements,
        showAchievement: showAchievement,
        getAllAchievements: getAllAchievements,
        getTotalPossiblePoints: getTotalPossiblePoints
    };
})();
