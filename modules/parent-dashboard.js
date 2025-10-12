// parent-dashboard.js - Enhanced Parent Dashboard with Skill Tracking

window.ParentDashboard = (function() {
    'use strict';
    
    let pinAttempts = 0;
    let lockoutEndTime = null;
    
    // Show parent access screen
    function show(parentSettings, userData, topics) {
        if (lockoutEndTime && new Date() < lockoutEndTime) {
            const remainingTime = Math.ceil((lockoutEndTime - new Date()) / 1000);
            alert(`Too many incorrect PIN attempts. Please wait ${remainingTime} seconds.`);
            return;
        }
        
        const modal = document.getElementById('parentModal');
        const modalContent = document.querySelector('.modal-content');
        
        if (!modal || !modalContent) {
            alert('Parent Dashboard - Default PIN: 1234\n(Full interface requires modal elements)');
            return;
        }
        
        modalContent.innerHTML = `
            <span class="close" onclick="closeParentModal()">&times;</span>
            <h2>🔐 Parent Access</h2>
            <div style="text-align: center; padding: 20px;">
                ${!window.parentSettings.initialized ? 
                    '<p style="color: #e53e3e; font-weight: bold;">⚠️ First Time Setup: Default PIN is 1234. Please change it!</p>' : 
                    '<p>Enter your 4-digit PIN to access parent controls</p>'}
                <input type="password" id="parentPIN" maxlength="4" pattern="[0-9]*" inputmode="numeric"
                       style="font-size: 24px; padding: 10px; width: 150px; text-align: center; 
                              border: 2px solid #667eea; border-radius: 10px;"
                       onkeypress="if(event.key==='Enter') ParentDashboard.verifyPIN()">
                <br><br>
                <button class="btn btn-primary" onclick="ParentDashboard.verifyPIN()">Submit</button>
                <div id="pinError" style="color: red; margin-top: 10px;"></div>
                <br><br>
                <p style="font-size: 0.9em; color: #666;">
                    Forgot PIN? Clear browser data to reset to default (1234)
                </p>
            </div>
        `;
        
        modal.style.display = 'flex';
        document.getElementById('parentPIN').focus();
    }
    
    // Verify entered PIN
    function verifyPIN() {
        const enteredPIN = document.getElementById('parentPIN').value;
        const errorDiv = document.getElementById('pinError');
        
        if (enteredPIN.length !== 4 || !/^\d{4}$/.test(enteredPIN)) {
            errorDiv.textContent = 'PIN must be exactly 4 digits';
            return;
        }
        
        if (window.hashPIN(enteredPIN) === window.parentSettings.pinHash) {
            pinAttempts = 0;
            showDashboard();
        } else {
            pinAttempts++;
            if (pinAttempts >= 3) {
                lockoutEndTime = new Date(Date.now() + 5 * 60 * 1000);
                errorDiv.textContent = 'Too many attempts. Locked for 5 minutes.';
                setTimeout(() => window.closeParentModal(), 2000);
            } else {
                errorDiv.textContent = `Incorrect PIN. ${3 - pinAttempts} attempts remaining.`;
                document.getElementById('parentPIN').value = '';
            }
        }
    }
    
    // Show main dashboard with skill breakdown
    function showDashboard() {
        const modalContent = document.querySelector('.modal-content');
        
        const accuracy = window.userData.totalQuestions > 0 ? 
            Math.round((window.userData.correctAnswers / window.userData.totalQuestions) * 100) : 0;
        
        let totalAchievements = 0;
        let achievementPoints = 0;
        if (window.AchievementsModule) {
            const allAchievements = window.AchievementsModule.getAllAchievements(window.userData);
            totalAchievements = allAchievements.filter(a => a.earned).length;
            achievementPoints = window.userData.achievementPoints || 0;
        }
        
        // Get current grade level
        const currentGrade = window.MasteryTracker ? 
            window.MasteryTracker.getCurrentGradeLevel('comprehension') : 'grade4';
        const gradeInfo = window.MasteryTracker?.GRADE_LEVELS[currentGrade];
        
        modalContent.innerHTML = `
            <span class="close" onclick="closeParentModal()">&times;</span>
            <h2>👨‍👩‍👦 Parent Dashboard - Jordan's Progress</h2>
            
            <div class="parent-dashboard" style="max-height: 70vh; overflow-y: auto;">
                ${!window.parentSettings.initialized ? `
                    <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #ffc107;">
                        <strong>⚠️ Important Security Notice:</strong><br>
                        You are using the default PIN (1234). Please change it immediately for security!
                    </div>
                ` : ''}
                
                <!-- Quick Stats Overview -->
                <div class="parent-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <h3>📊 Quick Overview</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        <div style="text-align: center; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 10px;">
                            <div style="font-size: 2em; font-weight: bold;">${gradeInfo?.name || window.getReadingLevelName(window.userData.readingLevel)}</div>
                            <div>Current Level</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 10px;">
                            <div style="font-size: 2em; font-weight: bold;">${accuracy}%</div>
                            <div>Accuracy</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 10px;">
                            <div style="font-size: 2em; font-weight: bold;">${window.userData.passagesRead}</div>
                            <div>Passages Read</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 10px;">
                            <div style="font-size: 2em; font-weight: bold;">${window.userData.wordsLearned.length}</div>
                            <div>Words Learned</div>
                        </div>
                    </div>
                </div>
                
                <!-- Grade Progression Path -->
                ${window.MasteryTracker ? `
                <div class="parent-section">
                    <h3>📈 Grade Level Progression</h3>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin: 20px 0;">
                        ${['grade4', 'grade5', 'grade6'].map(grade => {
                            const isCompleted = window.MasteryTracker.isLevelMastered('comprehension', grade);
                            const isCurrent = currentGrade === grade;
                            const gradeNum = grade.replace('grade', '');
                            
                            return `
                                <div style="text-align: center;">
                                    <div style="width: 80px; height: 80px; border-radius: 50%; 
                                         background: ${isCompleted ? '#10b981' : isCurrent ? '#667eea' : '#e2e8f0'};
                                         color: white; display: flex; align-items: center; justify-content: center;
                                         font-size: 1.5em; font-weight: bold; margin-bottom: 10px;
                                         ${isCurrent ? 'box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);' : ''}">
                                        ${isCompleted ? '✓' : gradeNum + 'th'}
                                    </div>
                                    <div style="font-weight: bold; color: ${isCurrent ? '#667eea' : '#666'};">
                                        ${isCurrent ? '→ Current' : isCompleted ? 'Mastered' : 'Locked'}
                                    </div>
                                </div>
                                ${grade !== 'grade6' ? '<div style="font-size: 2em; color: #cbd5e0;">→</div>' : ''}
                            `;
                        }).join('')}
                    </div>
                    <p style="text-align: center; color: #666; margin-top: 20px;">
                        <strong>Goal:</strong> Master all skills at each grade level before advancing to the next
                    </p>
                </div>
                ` : ''}
                
                <!-- Detailed Skill Breakdown -->
                ${window.MasteryTracker && window.userData.skillProgress?.comprehension ? `
                <div class="parent-section">
                    <h3>📚 Reading Comprehension Skills (${gradeInfo?.name})</h3>
                    <p style="margin-bottom: 15px; color: #666;">Each skill must reach 80% accuracy to be considered mastered</p>
                    ${Object.entries(window.MasteryTracker.READING_SKILLS).map(([skillKey, skillInfo]) => {
                        const progress = window.userData.skillProgress.comprehension[skillKey] || { correct: 0, attempts: 0, accuracy: 0 };
                        const isMastered = window.MasteryTracker.isSkillMastered('comprehension', skillKey);
                        const percent = skillInfo.required > 0 ? Math.round((progress.correct / skillInfo.required) * 100) : 0;
                        
                        return `
                            <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 15px;
                                 border: 2px solid ${isMastered ? '#10b981' : progress.accuracy >= 70 ? '#fbbf24' : '#ef4444'};">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <div>
                                        <strong style="color: #2d3748;">${skillInfo.name}</strong>
                                        ${isMastered ? ' <span style="color: #10b981;">✓ Mastered</span>' : ''}
                                        <div style="font-size: 0.85em; color: #666; margin-top: 3px;">
                                            Level: ${skillInfo.level}
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: 1.2em; font-weight: bold; color: ${isMastered ? '#10b981' : '#667eea'};">
                                            ${progress.correct}/${skillInfo.required}
                                        </div>
                                        <div style="font-size: 0.9em; color: #666;">
                                            ${progress.accuracy}% accuracy
                                        </div>
                                    </div>
                                </div>
                                <div style="background: #e5e7eb; height: 10px; border-radius: 5px;">
                                    <div style="background: ${isMastered ? '#10b981' : progress.accuracy >= 70 ? '#fbbf24' : '#ef4444'}; 
                                         width: ${Math.min(percent, 100)}%; height: 100%; border-radius: 5px; transition: width 0.3s;"></div>
                                </div>
                                ${!isMastered && progress.attempts > 0 ? `
                                    <div style="margin-top: 8px; font-size: 0.85em; color: #666;">
                                        ${progress.correct < skillInfo.required ? 
                                            `Need ${skillInfo.required - progress.correct} more correct answers` : 
                                            progress.accuracy < 80 ? 
                                            `Practice to improve accuracy from ${progress.accuracy}% to 80%` : ''}
                                    </div>
                                ` : !isMastered ? `
                                    <div style="margin-top: 8px; font-size: 0.85em; color: #ef4444;">
                                        ⚠️ Not yet practiced - needs attention
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                ` : ''}
                
                <!-- Focus Areas -->
                ${window.MasteryTracker ? `
                <div class="parent-section">
                    <h3>🎯 Current Focus Areas</h3>
                    ${(() => {
                        const weakAreas = window.MasteryTracker.getWeakAreas('comprehension');
                        if (weakAreas.length === 0) {
                            return `
                                <div style="background: #d1fae5; padding: 20px; border-radius: 10px; border: 2px solid #10b981;">
                                    <div style="color: #065f46; font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">
                                        🎉 All Skills Mastered at Current Level!
                                    </div>
                                    <p style="color: #065f46; margin: 0;">
                                        Jordan is ready to advance to the next grade level. Keep up the excellent work!
                                    </p>
                                </div>
                            `;
                        }
                        
                        return `
                            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border: 2px solid #ffc107; margin-bottom: 15px;">
                                <p style="color: #856404; margin-bottom: 15px;">
                                    <strong>Recommended areas for Jordan to practice:</strong>
                                </p>
                                <ol style="color: #856404; line-height: 2; margin: 0; padding-left: 20px;">
                                    ${weakAreas.slice(0, 3).map(area => `
                                        <li>
                                            <strong>${area.name}:</strong> ${area.reason}
                                            <div style="font-size: 0.9em; margin-top: 5px;">
                                                Progress: ${area.correct}/${area.required} correct answers needed
                                            </div>
                                        </li>
                                    `).join('')}
                                </ol>
                            </div>
                            <p style="color: #666; font-size: 0.9em; margin: 0;">
                                💡 <strong>Tip:</strong> The app automatically focuses on these weak areas during practice sessions
                            </p>
                        `;
                    })()}
                </div>
                ` : ''}
                
                <!-- IXL Alignment Report -->
                <div class="parent-section">
                    <h3>📊 IXL Skills Alignment</h3>
                    <p style="margin-bottom: 15px;">Based on IXL assessment (October 2025)</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background: #f0f0f0;">
                            <th style="padding: 10px; text-align: left;">Skill Area</th>
                            <th style="padding: 10px;">IXL Level</th>
                            <th style="padding: 10px;">Target</th>
                            <th style="padding: 10px;">Status</th>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-top: 1px solid #ddd;">Reading Strategies</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">${gradeInfo?.ixlLevel || 440} (${gradeInfo?.name?.split(' ')[0] || '4th'})</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">600+ (6th)</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">
                                <span style="color: ${currentGrade === 'grade6' ? '#10b981' : currentGrade === 'grade5' ? '#f59e0b' : '#e53e3e'};">
                                    ${currentGrade === 'grade6' ? 'On Track ✓' : currentGrade === 'grade5' ? 'Improving' : 'Needs Work'}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-top: 1px solid #ddd;">Vocabulary</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">520 (5th)</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">600+ (6th)</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">
                                <span style="color: #f59e0b;">Improving</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-top: 1px solid #ddd;">Writing</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">500 (5th)</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">600+ (6th)</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">
                                <span style="color: #f59e0b;">Improving</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-top: 1px solid #ddd;">Grammar</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">620 (6th+)</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">600+ (6th)</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">
                                <span style="color: #10b981;">On Track ✓</span>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <!-- Topic Progress -->
                <div class="parent-section">
                    <h3>📚 Topic Progress & Mastery</h3>
                    <div class="skill-report" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        ${Object.entries(window.topics).map(([key, topic]) => {
                            const progress = window.userData.topicProgress[key] || { completed: 0, total: 20 };
                            const percent = Math.round((progress.completed / progress.total) * 100);
                            const isMastered = window.userData.masteredTopics?.includes(key);
                            const isLocked = window.parentSettings.lockedTopics?.includes(key);
                            
                            return `
                                <div class="skill-card" style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                                    <div class="skill-name" style="font-weight: bold; margin-bottom: 10px;">
                                        ${topic.icon} ${topic.name}
                                        ${isLocked ? '🔒' : ''}
                                        ${isMastered ? '🏆' : ''}
                                    </div>
                                    <div style="background: #e5e7eb; height: 10px; border-radius: 5px; margin: 10px 0;">
                                        <div style="background: ${isMastered ? 'gold' : '#667eea'}; width: ${percent}%; height: 100%; border-radius: 5px;"></div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; font-size: 0.9em;">
                                        <span>${progress.completed}/${progress.total} completed</span>
                                        <span>${percent}%</span>
                                    </div>
                                    ${isMastered ? '<div style="color: gold; text-align: center; margin-top: 5px; font-weight: bold;">MASTERED!</div>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <!-- Daily Progress & Goals -->
                <div class="parent-section">
                    <h3>📅 Daily Progress</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <p><strong>Today's Progress:</strong> ${window.userData.completedToday} activities completed</p>
                            <p><strong>Daily Goal:</strong> ${window.parentSettings.dailyGoalOverride || window.userData.dailyGoal} activities</p>
                            <p><strong>Current Streak:</strong> ${window.userData.currentStreak} correct answers in a row</p>
                            <p><strong>Longest Streak:</strong> ${window.userData.longestStreak} answers</p>
                        </div>
                        <div>
                            <p><strong>Total Questions:</strong> ${window.userData.totalQuestions}</p>
                            <p><strong>Correct Answers:</strong> ${window.userData.correctAnswers}</p>
                            <p><strong>Achievements Earned:</strong> ${totalAchievements}</p>
                            <p><strong>Achievement Points:</strong> ${achievementPoints}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Settings & Controls -->
                <div class="parent-section">
                    <h3>⚙️ Settings & Controls</h3>
                    <div class="settings-grid" style="display: grid; gap: 15px;">
                        <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; border-radius: 8px;">
                            <span>Daily Goal (activities per day)</span>
                            <input type="number" value="${window.parentSettings.dailyGoalOverride || window.userData.dailyGoal}" 
                                   min="5" max="50" style="width: 60px; padding: 5px; border: 1px solid #ddd; border-radius: 5px;"
                                   onchange="ParentDashboard.updateDailyGoal(this.value)">
                        </div>
                        
                        <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; border-radius: 8px;">
                            <span>Text Size for Reading</span>
                            <select onchange="ParentDashboard.updateTextSize(this.value)" 
                                    style="padding: 5px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="small" ${window.parentSettings.textSizeOverride === 'small' ? 'selected' : ''}>Small</option>
                                <option value="medium" ${(!window.parentSettings.textSizeOverride || window.parentSettings.textSizeOverride === 'medium') ? 'selected' : ''}>Medium</option>
                                <option value="large" ${window.parentSettings.textSizeOverride === 'large' ? 'selected' : ''}>Large</option>
                            </select>
                        </div>
                        
                        <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; border-radius: 8px;">
                            <span>Difficulty Level</span>
                            <select onchange="ParentDashboard.updateDifficulty(this.value)" 
                                    style="padding: 5px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="adaptive" ${window.parentSettings.difficultyLevel === 'adaptive' ? 'selected' : ''}>Adaptive (Recommended)</option>
                                <option value="easy" ${window.parentSettings.difficultyLevel === 'easy' ? 'selected' : ''}>Easy (Grade 4)</option>
                                <option value="medium" ${window.parentSettings.difficultyLevel === 'medium' ? 'selected' : ''}>Medium (Grade 5)</option>
                                <option value="hard" ${window.parentSettings.difficultyLevel === 'hard' ? 'selected' : ''}>Hard (Grade 6)</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Topic Lock Controls -->
                <div class="parent-section">
                    <h3>🔒 Topic Access Control</h3>
                    <p style="margin-bottom: 15px;">Toggle topics on/off to control what Jordan can practice:</p>
                    <div style="display: grid; gap: 10px;">
                        ${Object.entries(window.topics).map(([key, topic]) => `
                            <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; border-radius: 8px;">
                                <span>${topic.icon} ${topic.name}</span>
                                <button onclick="ParentDashboard.toggleTopicLock('${key}')" 
                                        style="padding: 5px 15px; border-radius: 5px; border: none; cursor: pointer;
                                               background: ${!window.parentSettings.lockedTopics?.includes(key) ? '#10b981' : '#ef4444'};
                                               color: white;">
                                    ${!window.parentSettings.lockedTopics?.includes(key) ? 'Enabled ✓' : 'Locked 🔒'}
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Security Settings -->
                <div class="parent-section">
                    <h3>🔐 Security Settings</h3>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="ParentDashboard.showChangePIN()" 
                                style="background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                            Change PIN
                        </button>
                        <button class="btn btn-secondary" onclick="ParentDashboard.exportData()" 
                                style="background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                            Export Progress Data
                        </button>
                        <button class="btn btn-secondary" onclick="ParentDashboard.resetProgress()" 
                                style="background: #ef4444; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                            Reset All Progress
                        </button>
                    </div>
                </div>
                
                <!-- Tips for Parents -->
                <div class="parent-section" style="background: #e8f4f8; border: 2px solid #667eea;">
                    <h3>💡 Parent Tips & Insights</h3>
                    <ul style="line-height: 1.8; padding-left: 20px;">
                        <li><strong>Jordan's Current Challenge:</strong> Reading comprehension at ${gradeInfo?.name || '4th Grade'} level (target: 6th grade)</li>
                        <li><strong>Learning Path:</strong> Must master all 7 reading skills at each grade level before advancing</li>
                        <li><strong>Focus Areas:</strong> The app automatically targets weak skills during practice</li>
                        <li><strong>Recommended Practice:</strong> 15-20 minutes daily, focusing on identified weak areas</li>
                        <li><strong>Soccer Theme:</strong> We use soccer examples throughout to maintain engagement!</li>
                        <li><strong>Progress Tracking:</strong> Check weekly to monitor improvement trends and skill mastery</li>
                        <li><strong>Next IXL Assessment:</strong> Recommended in 2-3 months to measure growth</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Show change PIN screen
    function showChangePIN() {
        const modalContent = document.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <span class="close" onclick="ParentDashboard.showDashboard()">← Back</span>
            <h2>🔐 Change Security PIN</h2>
            <div style="text-align: center; padding: 20px;">
                <div style="margin-bottom: 20px;">
                    <p>Enter new 4-digit PIN:</p>
                    <input type="password" id="newPIN" maxlength="4" pattern="[0-9]*" inputmode="numeric"
                           style="font-size: 24px; padding: 10px; width: 150px; text-align: center; 
                                  border: 2px solid #667eea; border-radius: 10px;">
                </div>
                <div style="margin-bottom: 20px;">
                    <p>Confirm new PIN:</p>
                    <input type="password" id="confirmPIN" maxlength="4" pattern="[0-9]*" inputmode="numeric"
                           style="font-size: 24px; padding: 10px; width: 150px; text-align: center; 
                                  border: 2px solid #667eea; border-radius: 10px;">
                </div>
                <button class="btn btn-primary" onclick="ParentDashboard.changePIN()" 
                        style="background: #667eea; color: white; padding: 10px 30px; border: none; border-radius: 5px; cursor: pointer;">
                    Save New PIN
                </button>
                <div id="pinChangeError" style="color: red; margin-top: 10px;"></div>
            </div>
        `;
    }
    
    // Change PIN
    function changePIN() {
        const newPIN = document.getElementById('newPIN').value;
        const confirmPIN = document.getElementById('confirmPIN').value;
        const errorDiv = document.getElementById('pinChangeError');
        
        if (newPIN.length !== 4 || !/^\d{4}$/.test(newPIN)) {
            errorDiv.textContent = 'PIN must be exactly 4 digits';
            return;
        }
        
        if (newPIN !== confirmPIN) {
            errorDiv.textContent = 'PINs do not match';
            return;
        }
        
        if (newPIN === '1234') {
            errorDiv.textContent = 'Please choose a PIN other than 1234';
            return;
        }
        
        window.parentSettings.pinHash = window.hashPIN(newPIN);
        window.parentSettings.initialized = true;
        window.parentSettings.lastPinChange = new Date().toISOString();
        window.saveParentSettings();
        
        alert('✅ PIN changed successfully!');
        showDashboard();
    }
    
    // Update daily goal
    function updateDailyGoal(value) {
        const goal = parseInt(value);
        if (goal >= 5 && goal <= 50) {
            window.parentSettings.dailyGoalOverride = goal;
            window.saveParentSettings();
            window.updateDailyProgress();
        }
    }
    
    // Update text size
    function updateTextSize(value) {
        window.parentSettings.textSizeOverride = value;
        window.userData.preferences.textSize = value;
        window.saveParentSettings();
        window.saveUserData();
    }
    
    // Update difficulty
    function updateDifficulty(value) {
        window.parentSettings.difficultyLevel = value;
        
        if (value === 'easy') {
            window.userData.readingLevel = 440;
        } else if (value === 'medium') {
            window.userData.readingLevel = 520;
        } else if (value === 'hard') {
            window.userData.readingLevel = 620;
        }
        
        window.saveParentSettings();
        window.saveUserData();
        window.updateStats();
    }
    
    // Toggle topic lock
    function toggleTopicLock(topic) {
        if (!window.parentSettings.lockedTopics) {
            window.parentSettings.lockedTopics = [];
        }
        
        const index = window.parentSettings.lockedTopics.indexOf(topic);
        if (index === -1) {
            window.parentSettings.lockedTopics.push(topic);
        } else {
            window.parentSettings.lockedTopics.splice(index, 1);
        }
        
        window.saveParentSettings();
        showDashboard();
    }
    
    // Export user data
    function exportData() {
        const dataStr = JSON.stringify(window.userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jordan-english-progress-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
    
    // Reset all progress
    function resetProgress() {
        if (confirm('⚠️ WARNING: This will reset ALL of Jordan\'s progress including achievements, words learned, and statistics. This cannot be undone. Are you sure?')) {
            if (confirm('Are you REALLY sure? All data will be permanently deleted.')) {
                window.userData = {
                    readingLevel: 460,
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
                    preferences: window.userData.preferences,
                    sessionsCompleted: {},
                    masteredTopics: [],
                    skillProgress: {},
                    gradeProgress: {}
                };
                
                window.saveUserData();
                window.updateStats();
                window.updateDailyProgress();
                
                alert('✅ All progress has been reset.');
                showDashboard();
            }
        }
    }
    
    // Public API
    return {
        show: show,
        verifyPIN: verifyPIN,
        showDashboard: showDashboard,
        showChangePIN: showChangePIN,
        changePIN: changePIN,
        updateDailyGoal: updateDailyGoal,
        updateTextSize: updateTextSize,
        updateDifficulty: updateDifficulty,
        toggleTopicLock: toggleTopicLock,
        exportData: exportData,
        resetProgress: resetProgress
    };
})();
