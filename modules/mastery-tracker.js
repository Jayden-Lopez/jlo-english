// mastery-tracker.js - Track skill mastery and suggest focus areas

window.MasteryTracker = (function() {
    
    'use strict';
    
    // Reading comprehension sub-skills to track
    const READING_SKILLS = {
        mainIdea: { name: "Main Ideas", required: 10, level: 'fundamental' },
        causeEffect: { name: "Cause & Effect", required: 8, level: 'fundamental' },
        inference: { name: "Making Inferences", required: 10, level: 'advanced' },
        vocabulary: { name: "Context Clues", required: 8, level: 'fundamental' },
        sequence: { name: "Sequence of Events", required: 6, level: 'basic' },
        characterAnalysis: { name: "Character Analysis", required: 8, level: 'advanced' },
        theme: { name: "Themes & Messages", required: 6, level: 'advanced' }
    };
    
    // Grade level requirements
    const GRADE_LEVELS = {
        grade4: { name: "4th Grade", ixlLevel: 440, required: 20 },
        grade5: { name: "5th Grade", ixlLevel: 520, required: 20 },
        grade6: { name: "6th Grade", ixlLevel: 600, required: 20 }
    };
    
    // Initialize skill tracking for a topic
    function initializeSkillTracking(topicKey) {
        if (!window.userData.skillProgress) {
            window.userData.skillProgress = {};
        }
        
        if (!window.userData.skillProgress[topicKey]) {
            window.userData.skillProgress[topicKey] = {};
            
            // Initialize each reading skill
            if (topicKey === 'comprehension') {
                Object.keys(READING_SKILLS).forEach(skillKey => {
                    window.userData.skillProgress[topicKey][skillKey] = {
                        attempts: 0,
                        correct: 0,
                        accuracy: 0
                    };
                });
            }
        }
    }
    
    // Track a skill-specific question result
    function trackSkillResult(topicKey, skillType, isCorrect) {
        initializeSkillTracking(topicKey);
        
        const skill = window.userData.skillProgress[topicKey][skillType];
        if (skill) {
            skill.attempts++;
            if (isCorrect) {
                skill.correct++;
            }
            skill.accuracy = Math.round((skill.correct / skill.attempts) * 100);
        }
    }
    
    // Check if a specific skill is mastered
    function isSkillMastered(topicKey, skillType) {
        if (!window.userData.skillProgress?.[topicKey]?.[skillType]) {
            return false;
        }
        
        const skill = window.userData.skillProgress[topicKey][skillType];
        const requirement = READING_SKILLS[skillType];
        
        if (!requirement) return false;
        
        // Mastery = completed required number with 80%+ accuracy
        return skill.correct >= requirement.required && skill.accuracy >= 80;
    }
    
    // Check if all skills at a level are mastered
    function isLevelMastered(topicKey, gradeLevel) {
        if (topicKey !== 'comprehension') {
            // For non-comprehension topics, check overall progress
            const progress = window.userData.topicProgress[topicKey];
            const requirement = GRADE_LEVELS[gradeLevel];
            return progress && progress.completed >= requirement.required;
        }
        
        // For comprehension, check all sub-skills
        let allMastered = true;
        Object.keys(READING_SKILLS).forEach(skillKey => {
            if (!isSkillMastered(topicKey, skillKey)) {
                allMastered = false;
            }
        });
        
        return allMastered;
    }
    
    // Get weak areas that need focus
    function getWeakAreas(topicKey) {
        initializeSkillTracking(topicKey);
        
        const weakAreas = [];
        const skillProgress = window.userData.skillProgress[topicKey];
        
        if (!skillProgress) return weakAreas;
        
        Object.entries(READING_SKILLS).forEach(([skillKey, skillInfo]) => {
            const progress = skillProgress[skillKey];
            
            if (!progress || progress.attempts === 0) {
                weakAreas.push({
                    skill: skillKey,
                    name: skillInfo.name,
                    reason: 'Not practiced yet',
                    priority: 'high',
                    correct: 0,
                    required: skillInfo.required
                });
            } else if (progress.accuracy < 70) {
                weakAreas.push({
                    skill: skillKey,
                    name: skillInfo.name,
                    reason: `Low accuracy: ${progress.accuracy}%`,
                    priority: 'high',
                    correct: progress.correct,
                    required: skillInfo.required
                });
            } else if (progress.correct < skillInfo.required) {
                weakAreas.push({
                    skill: skillKey,
                    name: skillInfo.name,
                    reason: `Need more practice: ${progress.correct}/${skillInfo.required}`,
                    priority: 'medium',
                    correct: progress.correct,
                    required: skillInfo.required
                });
            }
        });
        
        // Sort by priority and number needed
        weakAreas.sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (a.priority !== 'high' && b.priority === 'high') return 1;
            return (b.required - b.correct) - (a.required - a.correct);
        });
        
        return weakAreas;
    }
    
    // Get current grade level for a topic
    function getCurrentGradeLevel(topicKey) {
        if (!window.userData.gradeProgress) {
            window.userData.gradeProgress = {};
        }
        
        if (!window.userData.gradeProgress[topicKey]) {
            window.userData.gradeProgress[topicKey] = 'grade4'; // Start at 4th grade
        }
        
        return window.userData.gradeProgress[topicKey];
    }
    
    // Check if ready to advance to next grade level
    function checkGradeAdvancement(topicKey) {
        const currentGrade = getCurrentGradeLevel(topicKey);
        
        if (isLevelMastered(topicKey, currentGrade)) {
            // Move to next grade
            if (currentGrade === 'grade4') {
                window.userData.gradeProgress[topicKey] = 'grade5';
                return {
                    advanced: true,
                    from: '4th Grade',
                    to: '5th Grade',
                    message: '🎉 Congratulations! You\'ve mastered 4th grade reading! Moving to 5th grade level.'
                };
            } else if (currentGrade === 'grade5') {
                window.userData.gradeProgress[topicKey] = 'grade6';
                return {
                    advanced: true,
                    from: '5th Grade',
                    to: '6th Grade',
                    message: '🎉 Amazing! You\'ve mastered 5th grade reading! Moving to 6th grade level.'
                };
            } else if (currentGrade === 'grade6') {
                return {
                    advanced: false,
                    complete: true,
                    message: '🏆 OUTSTANDING! You\'ve mastered 6th grade reading comprehension!'
                };
            }
        }
        
        return { advanced: false };
    }
    
    // Show mastery progress modal
    function showMasteryProgress(topicKey) {
        const currentGrade = getCurrentGradeLevel(topicKey);
        const weakAreas = getWeakAreas(topicKey);
        const gradeInfo = GRADE_LEVELS[currentGrade];
        
        let html = `
            <div style="background: white; padding: 20px; border-radius: 15px; max-width: 600px; margin: 20px auto;">
                <h2 style="color: #667eea; text-align: center;">📊 Your ${gradeInfo.name} Reading Progress</h2>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="margin: 0 0 10px 0;">Skill Breakdown</h3>
        `;
        
        // Show each skill's progress
        Object.entries(READING_SKILLS).forEach(([skillKey, skillInfo]) => {
            const progress = window.userData.skillProgress[topicKey]?.[skillKey] || { correct: 0, attempts: 0, accuracy: 0 };
            const mastered = isSkillMastered(topicKey, skillKey);
            const percent = skillInfo.required > 0 ? Math.round((progress.correct / skillInfo.required) * 100) : 0;
            
            html += `
                <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; margin: 10px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${skillInfo.name} ${mastered ? '✓' : ''}</span>
                        <span>${progress.correct}/${skillInfo.required} (${progress.accuracy}%)</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.3); height: 8px; border-radius: 4px; margin-top: 5px;">
                        <div style="background: ${mastered ? '#10b981' : 'white'}; width: ${Math.min(percent, 100)}%; height: 100%; border-radius: 4px;"></div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        // Show weak areas if any
        if (weakAreas.length > 0) {
            html += `
                <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin: 20px 0; border: 2px solid #ffc107;">
                    <h3 style="color: #856404; margin-top: 0;">🎯 Focus Areas for Improvement</h3>
                    <p style="color: #856404;">Master these skills before advancing to the next grade:</p>
                    <ul style="color: #856404; line-height: 1.8;">
            `;
            
            weakAreas.slice(0, 3).forEach(area => {
                html += `<li><strong>${area.name}:</strong> ${area.reason}</li>`;
            });
            
            html += `
                    </ul>
                    <p style="color: #856404; font-weight: bold; margin-bottom: 0;">
                        Keep practicing! You're making great progress! ⚽
                    </p>
                </div>
            `;
        } else {
            html += `
                <div style="background: #d1fae5; padding: 15px; border-radius: 10px; margin: 20px 0; border: 2px solid #10b981;">
                    <h3 style="color: #065f46; margin-top: 0;">🎉 All Skills Mastered!</h3>
                    <p style="color: #065f46; font-weight: bold;">
                        Great work! You're ready to advance to the next grade level!
                    </p>
                </div>
            `;
        }
        
        html += `
                <button onclick="document.getElementById('masteryModal').style.display='none'" 
                        style="background: #667eea; color: white; padding: 12px 30px; border: none; border-radius: 8px; 
                               cursor: pointer; font-size: 16px; width: 100%;">
                    Continue Practice
                </button>
            </div>
        `;
        
        // Create or update modal
        let modal = document.getElementById('masteryModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'masteryModal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `<div class="modal-content" style="background: transparent; box-shadow: none;">${html}</div>`;
        modal.style.display = 'flex';
    }
    
    // Public API
    return {
        trackSkillResult: trackSkillResult,
        isSkillMastered: isSkillMastered,
        isLevelMastered: isLevelMastered,
        getWeakAreas: getWeakAreas,
        getCurrentGradeLevel: getCurrentGradeLevel,
        checkGradeAdvancement: checkGradeAdvancement,
        showMasteryProgress: showMasteryProgress,
        READING_SKILLS: READING_SKILLS,
        GRADE_LEVELS: GRADE_LEVELS
    };
})();

// Add these two lines right after the })();
export default MasteryTracker;
export { MasteryTracker };
