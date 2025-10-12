// parent-dashboard.js - Parent Dashboard and Controls Module
// Fixed to always read current userData from window object

window.ParentDashboard = (function() {
    'use strict';
    
    let pinAttempts = 0;
    let lockoutEndTime = null;
    
    // Show parent access screen
    function show(parentSettings, userData, topics) {
        // Check if locked out
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
        
        // Show PIN entry screen
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
                lockoutEndTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minute lockout
                errorDiv.textContent = 'Too many attempts. Locked for 5 minutes.';
                setTimeout(() => window.closeParentModal(), 2000);
            } else {
                errorDiv.textContent = `Incorrect PIN. ${3 - pinAttempts} attempts remaining.`;
                document.getElementById('parentPIN').value = '';
            }
        }
    }
    
    // Show main dashboard - FIXED to always read from window.userData
    function showDashboard() {
        const modalContent = document.querySelector('.modal-content');
        
        // Always read from window to get current values
        console.log("Dashboard opening with userData:", window.userData);
        
        // Calculate statistics
        const accuracy = window.userData.totalQuestions > 0 ? 
            Math.round((window.userData.correctAnswers / window.userData.totalQuestions) * 100) : 0;
        
        // Get achievement stats
        let totalAchievements = 0;
        let achievementPoints = 0;
        if (window.AchievementsModule) {
            const allAchievements = window.AchievementsModule.getAllAchievements(window.userData);
            totalAchievements = allAchievements.filter(a => a.earned).length;
            achievementPoints = window.userData.achievementPoints || 0;
        }
        
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
                            <div style="font-size: 2em; font-weight: bold;">${window.getReadingLevelName(window.userData.readingLevel)}</div>
                            <div>Reading Level</div>
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
                
                <!-- IXL Alignment Report -->
                <div class="parent-section">
                    <h3>📈 IXL Skills Alignment</h3>
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
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">440 (4th)</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">600+ (6th)</td>
                            <td style="padding: 10px; text-align: center; border-top: 1px solid #ddd;">
                                <span style="color: #e53e3e;">Needs Work</span>
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
                    <div style="display: flex; gap: 10px;">
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
                        <li><strong>Jordan's Current Challenge:</strong> Reading comprehension at 4th grade level (needs
