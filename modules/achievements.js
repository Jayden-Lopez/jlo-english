// achievements.js - Enhanced Achievement System with Skill-Based Achievements

window.AchievementsModule = (function() {
    'use strict';
    
    // Define all achievements
    const ACHIEVEMENTS = {
        // Reading Comprehension Achievements
        firstPassage: {
            id: 'firstPassage',
            name: 'First Steps',
            description: 'Complete your first reading passage',
            icon: '📖',
            points: 10,
            check: (userData) => userData.passagesRead >= 1
        },
        passages10: {
            id: 'passages10',
            name: 'Bookworm',
            description: 'Read 10 passages',
            icon: '🐛',
            points: 25,
            check: (userData) => userData.passagesRead >= 10
        },
        passages25: {
            id: 'passages25',
            name: 'Reading Champion',
            description: 'Read 25 passages',
            icon: '🏆',
            points: 50,
            check: (userData) => userData.passagesRead >= 25
        },
        passages50: {
            id: 'passages50',
            name: 'Literature Master',
            description: 'Read 50 passages',
            icon: '📚',
            points: 100,
            check: (userData) => userData.passagesRead >= 50
        },
        
        // Skill Mastery Achievements
        masteredMainIdea: {
            id: 'masteredMainIdea',
            name: 'Main Idea Master',
            description: 'Master the Main Ideas skill',
            icon: '🎯',
            points: 30,
            check: (userData) => {
                if (!window.MasteryTracker) return false;
                return window.MasteryTracker.isSkillMastered('comprehension', 'mainIdea');
            }
        },
        masteredCauseEffect: {
            id: 'masteredCauseEffect',
            name: 'Cause & Effect Expert',
            description: 'Master the Cause & Effect skill',
            icon: '⚡',
            points: 30,
            check: (userData) => {
                if (!window.MasteryTracker) return false;
                return window.MasteryTracker.isSkillMastered('comprehension', 'causeEffect');
            }
        },
        masteredInference: {
            id: 'masteredInference',
            name: 'Inference Detective',
            description: 'Master the Making Inferences skill',
            icon: '🔍',
            points: 35,
            check: (userData) => {
                if (!window.MasteryTracker) return false;
                return window.MasteryTracker.isSkillMastered('comprehension', 'inference');
            }
        },
        masteredVocabulary: {
            id: 'masteredVocabulary',
            name: 'Vocabulary Virtuoso',
            description: 'Master the Context Clues skill',
            icon: '💬',
            points: 30,
            check: (userData) => {
                if (!window.MasteryTracker) return false;
                return window.MasteryTracker.isSkillMastered('comprehension', 'vocabulary');
            }
        },
        masteredSequence: {
            id: 'masteredSequence',
            name: 'Sequence Specialist',
            description: 'Master the Sequence of Events skill',
            icon: '🔢',
            points: 25,
            check: (userData) => {
                if (!window.MasteryTracker) return false;
                return window.MasteryTracker.isSkillMastered('comprehension', 'sequence');
            }
        },
        masteredCharacter: {
            id: 'masteredCharacter',
            name: 'Character Analyst',
            description: 'Master the Character Analysis skill',
            icon: '👤',
            points: 35,
            check: (userData) => {
                if (!window.MasteryTracker) return false;
                return window.MasteryTracker.isSkillMastered('comprehension', 'characterAnalysis');
            }
        },
        masteredTheme: {
            id: 'masteredTheme',
            name: 'Theme Thinker',
            description: 'Master the Themes & Messages skill',
            icon: '💡',
            points: 35,
            check: (userData) => {
                if (!window.MasteryTracker) return false;
                return window.MasteryTracker.isSkillMastered('comprehension', 'theme');
            }
        },
        
        // Grade Level Achievements
        mastered4thGrade: {
            id: 'mastered4thGrade',
            name: '4th Grade Champion',
            description: 'Master all skills at 4th grade level',
            icon: '🥉',
            points: 100,
            check: (userData) => {
                if (!window.MasteryTracker) return false;
                return window.MasteryTracker.isLevelMastered('comprehension', 'grade4');
            }
        },
        mastered5thGrade: {
            id: 'mastered5thGrade',
            name: '5th Grade Hero',
            description: 'Master all skills at 5th grade level',
            icon: '🥈',
            points: 150,
            check: (userData) => {
                if (!window.MasteryTracker) return false;
                return window.MasteryTracker.isLevelMastered('comprehension', 'grade5');
            }
        },
        mastered6thGrade: {
            id: 'mastered6thGrade',
            name: '6th Grade Legend',
            description: 'Master all skills at 6th grade level',
            icon: '🥇',
            points: 200,
            check: (userData) => {
                if (!window.MasteryTracker) return false;
                return window.MasteryTracker.isLevelMastered('comprehension', 'grade6');
            }
        },
        
        // Streak Achievements
        streak5: {
            id: 'streak5',
            name: 'On Fire!',
            description: 'Get 5 correct answers in a row',
            icon: '🔥',
            points: 15,
            check: (userData) => userData.currentStreak >= 5
        },
        streak10: {
            id: 'streak10',
            name: 'Unstoppable!',
            description: 'Get 10 correct answers in a row',
            icon: '⚡',
            points: 30,
            check: (userData) => userData.currentStreak >= 10
        },
        streak20: {
            id: 'streak20',
            name: 'Legendary Streak',
            description: 'Get 20 correct answers in a row',
            icon: '🌟',
            points: 60,
            check: (userData) => userData.currentStreak >= 20
        },
        
        // Accuracy Achievements
        perfect10: {
            id: 'perfect10',
            name: 'Perfect 10',
            description: 'Answer 10 questions with 100% accuracy',
            icon: '💯',
            points: 25,
            check: (userData) => {
                return userData.totalQuestions >= 10 && 
                       userData.correctAnswers === userData.totalQuestions;
            }
        },
        accuracy90: {
            id: 'accuracy90',
            name: 'Excellence',
            description: 'Maintain 90%+ accuracy over 50 questions',
            icon: '⭐',
            points: 50,
            check: (userData) => {
                return userData.totalQuestions >= 50 && 
                       (userData.correctAnswers / userData.totalQuestions) >= 0.90;
            }
        },
        
        // Daily Goals
        daily7days: {
            id: 'daily7days',
            name: 'Week Warrior',
            description: 'Complete your daily goal for 7 days in a row',
            icon: '📅',
            points: 40,
            check: (userData) => {
                // This would need streak tracking - simplified for now
                return userData.completedToday >= userData.dailyGoal;
            }
        },
        
        // Vocabulary
        words25: {
            id: 'words25',
            name: 'Word Collector',
            description: 'Learn 25 new vocabulary words',
            icon: '📝',
            points: 30,
            check: (userData) => userData.wordsLearned.length >= 25
        },
        words50: {
            id: 'words50',
            name: 'Vocabulary Expert',
            description: 'Learn 50 new vocabulary words',
            icon: '📖',
            points: 60,
            check: (userData) => userData.wordsLearned.length >= 50
        },
        
        // Topic Mastery
        topicMaster1: {
            id: 'topicMaster1',
            name: 'Topic Champion',
            description: 'Master your first topic',
            icon: '🎖️',
            points: 50,
            check: (userData) => {
                return userData.masteredTopics && userData.masteredTopics.length >= 1;
            }
        },
        allTopicsMastered: {
            id: 'allTopicsMastered',
            name: 'Ultimate Master',
            description: 'Master all available topics',
            icon: '👑',
            points: 300,
            check: (userData) => {
                if (!window.topics) return false;
                const totalTopics = Object.keys(window.topics).length;
                return userData.masteredTopics && userData.masteredTopics.length >= totalTopics;
            }
        }
    };
    
    // Check for new achievements
    function checkAchievements(userData) {
        if (!userData.achievements) {
            userData.achievements = [];
        }
        if (!userData.achievementPoints) {
            userData.achievementPoints = 0;
        }
        
        const newAchievements = [];
        
        // Check each achievement
        for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
            // Skip if already earned
            if (userData.achievements.includes(achievement.id)) {
                continue;
            }
            
            // Check if earned now
            if (achievement.check(userData)) {
                userData.achievements.push(achievement.id);
                userData.achievementPoints += achievement.points;
                newAchievements.push(achievement);
            }
        }
        
        // Show new achievements
        if (newAchievements.length > 0) {
            showNewAchievements(newAchievements);
            window.saveUserData();
        }
    }
    
    // Show new achievement popup
    function showNewAchievements(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                showAchievementPopup(achievement);
            }, index * 3000); // Stagger by 3 seconds if multiple
        });
    }
    
    // Show single achievement popup
    function showAchievementPopup(achievement) {
        const popup = document.getElementById('achievementPopup');
        if (!popup) return;
        
        const icon = popup.querySelector('.achievement-icon');
        const title = popup.querySelector('.achievement-title');
        const message = document.getElementById('achievementMessage');
        
        if (icon) icon.textContent = achievement.icon;
        if (title) title.textContent = achievement.name;
        if (message) message.innerHTML = `
            ${achievement.description}<br>
            <strong>+${achievement.points} points!</strong>
        `;
        
        popup.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            popup.style.display = 'none';
        }, 5000);
    }
    
    // Get all achievements with earned status
    function getAllAchievements(userData) {
        if (!userData.achievements) {
            userData.achievements = [];
        }
        
        return Object.values(ACHIEVEMENTS).map(achievement => ({
            ...achievement,
            earned: userData.achievements.includes(achievement.id)
        }));
    }
    
    // Get achievement stats
    function getAchievementStats(userData) {
        const all = Object.values(ACHIEVEMENTS);
        const earned = userData.achievements ? userData.achievements.length : 0;
        const total = all.length;
        const points = userData.achievementPoints || 0;
        const maxPoints = all.reduce((sum, ach) => sum + ach.points, 0);
        
        return {
            earned,
            total,
            points,
            maxPoints,
            percentage: Math.round((earned / total) * 100)
        };
    }
    
    // Show achievements gallery
    function showAchievementsGallery() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'achievementsGallery';
        modal.style.display = 'flex';
        
        const stats = getAchievementStats(window.userData);
        const achievements = getAllAchievements(window.userData);
        
        // Group achievements by category
        const categories = {
            'Reading Progress': ['firstPassage', 'passages10', 'passages25', 'passages50'],
            'Skill Mastery': ['masteredMainIdea', 'masteredCauseEffect', 'masteredInference', 
                             'masteredVocabulary', 'masteredSequence', 'masteredCharacter', 'masteredTheme'],
            'Grade Levels': ['mastered4thGrade', 'mastered5thGrade', 'mastered6thGrade'],
            'Streaks': ['streak5', 'streak10', 'streak20'],
            'Accuracy': ['perfect10', 'accuracy90'],
            'Vocabulary': ['words25', 'words50'],
            'Topics': ['topicMaster1', 'allTopicsMastered']
        };
        
        let html = `
            <div class="modal-content" style="max-width: 900px;">
                <span class="close" onclick="document.getElementById('achievementsGallery').remove()">×</span>
                <h2>🏆 Achievements Gallery</h2>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; padding: 20px; border-radius: 15px; margin-bottom: 30px;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
                        <div>
                            <div style="font-size: 2.5em; font-weight: bold;">${stats.earned}/${stats.total}</div>
                            <div>Achievements Earned</div>
                        </div>
                        <div>
                            <div style="font-size: 2.5em; font-weight: bold;">${stats.points}</div>
                            <div>Achievement Points</div>
                        </div>
                        <div>
                            <div style="font-size: 2.5em; font-weight: bold;">${stats.percentage}%</div>
                            <div>Completion</div>
                        </div>
                    </div>
                </div>
                
                <div style="max-height: 60vh; overflow-y: auto;">
        `;
        
        // Display achievements by category
        for (const [category, achIds] of Object.entries(categories)) {
            const categoryAchs = achievements.filter(a => achIds.includes(a.id));
            
            html += `
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                        ${category}
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
            `;
            
            categoryAchs.forEach(ach => {
                html += `
                    <div style="background: ${ach.earned ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : '#f0f0f0'}; 
                         padding: 15px; border-radius: 10px; text-align: center;
                         ${!ach.earned ? 'opacity: 0.5;' : ''}
                         box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <div style="font-size: 3em; margin-bottom: 10px;">${ach.icon}</div>
                        <div style="font-weight: bold; margin-bottom: 5px; color: ${ach.earned ? 'white' : '#333'};">
                            ${ach.name}
                        </div>
                        <div style="font-size: 0.85em; margin-bottom: 10px; color: ${ach.earned ? 'white' : '#666'};">
                            ${ach.description}
                        </div>
                        <div style="font-weight: bold; color: ${ach.earned ? 'white' : '#667eea'};">
                            ${ach.earned ? '✓ EARNED' : ach.points + ' pts'}
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        html += `
                </div>
                
                <button class="btn btn-primary" onclick="document.getElementById('achievementsGallery').remove()"
                        style="width: 100%; margin-top: 20px;">
                    Close
                </button>
            </div>
        `;
        
        modal.innerHTML = html;
        document.body.appendChild(modal);
    }
    
    // Public API
    return {
        checkAchievements: checkAchievements,
        getAllAchievements: getAllAchievements,
        getAchievementStats: getAchievementStats,
        showAchievementsGallery: showAchievementsGallery
    };
})();
