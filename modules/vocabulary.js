// vocabulary.js - Vocabulary Practice Module

window.VocabularyModule = (function() {
    'use strict';
    
    // Vocabulary exercise database
    const exercises = [
        // Context clues exercises
        {
            type: "context",
            sentence: "The player's _____ performance in the championship game earned him the MVP award.",
            word: "stellar",
            options: ["terrible", "average", "outstanding", "boring"],
            correct: 2,
            hint: "Think about what kind of performance would win an MVP award."
        },
        {
            type: "context",
            sentence: "The coach's _____ instructions confused the players, who didn't understand what to do.",
            word: "ambiguous",
            options: ["clear", "loud", "unclear", "written"],
            correct: 2,
            hint: "If the players were confused, the instructions must have been..."
        },
        {
            type: "context",
            sentence: "After hours of practice, the team was _____ and needed a long rest.",
            word: "exhausted",
            options: ["energized", "very tired", "excited", "confused"],
            correct: 1,
            hint: "How would you feel after hours of hard practice?"
        },
        {
            type: "context",
            sentence: "The referee made an _____ decision that both teams accepted as fair.",
            word: "impartial",
            options: ["unfair", "quick", "unbiased", "wrong"],
            correct: 2,
            hint: "What kind of decision would both teams accept as fair?"
        },
        {
            type: "context",
            sentence: "The storm _____ the soccer game, forcing it to be rescheduled.",
            word: "postponed",
            options: ["improved", "delayed", "started", "watched"],
            correct: 1,
            hint: "What happens when bad weather affects a game?"
        },
        {
            type: "context",
            sentence: "The team showed great _____ by coming back from a 3-0 deficit.",
            word: "resilience",
            options: ["weakness", "ability to recover", "anger", "confusion"],
            correct: 1,
            hint: "What quality helps a team come back from being behind?"
        },
        {
            type: "context",
            sentence: "The goalkeeper's _____ allowed her to block shots from any angle.",
            word: "agility",
            options: ["slowness", "quick movement ability", "height", "uniform"],
            correct: 1,
            hint: "What physical quality helps a goalkeeper move quickly?"
        },
        // Idiom exercises
        {
            type: "idiom",
            sentence: "When Jordan scored the winning goal, he was _____.",
            idiom: "on cloud nine",
            options: ["very sad", "extremely happy", "very tired", "confused"],
            correct: 1,
            hint: "How would someone feel after scoring a winning goal?"
        },
        {
            type: "idiom",
            sentence: "The underdog team won against all odds - it was a real _____.",
            idiom: "David and Goliath story",
            options: ["expected victory", "surprising upset", "boring game", "tie game"],
            correct: 1,
            hint: "David and Goliath refers to a small person defeating a giant."
        },
        {
            type: "idiom",
            sentence: "Before the big game, the coach told everyone to _____.",
            idiom: "give it their all",
            options: ["quit early", "try their hardest", "go home", "eat lunch"],
            correct: 1,
            hint: "What would a coach want players to do in an important game?"
        },
        {
            type: "idiom",
            sentence: "The new player was a _____ and surprised everyone with her skills.",
            idiom: "dark horse",
            options: ["famous star", "unexpected winner", "slow runner", "team captain"],
            correct: 1,
            hint: "Someone who surprises people with unexpected abilities."
        },
        // Synonym exercises
        {
            type: "synonym",
            sentence: "The player showed great _____ by never giving up. (synonym of determination)",
            word: "perseverance",
            options: ["weakness", "persistence", "speed", "anger"],
            correct: 1,
            hint: "What word means the same as determination?"
        },
        {
            type: "synonym",
            sentence: "The crowd was _____ after the home team won. (synonym of happy)",
            word: "elated",
            options: ["sad", "extremely joyful", "quiet", "angry"],
            correct: 1,
            hint: "A stronger word for being very happy."
        },
        {
            type: "synonym",
            sentence: "The player's _____ mistake cost them the game. (synonym of important)",
            word: "crucial",
            options: ["tiny", "critical", "funny", "slow"],
            correct: 1,
            hint: "Another word for very important."
        },
        // Antonym exercises
        {
            type: "antonym",
            sentence: "Unlike the _____ defense, our offense was very aggressive. (antonym of aggressive)",
            word: "passive",
            options: ["active", "passive", "strong", "quick"],
            correct: 1,
            hint: "What's the opposite of aggressive?"
        },
        {
            type: "antonym",
            sentence: "The _____ player contrasted with his energetic teammate. (antonym of energetic)",
            word: "lethargic",
            options: ["excited", "sluggish", "happy", "tall"],
            correct: 1,
            hint: "The opposite of having lots of energy."
        },
        {
            type: "antonym",
            sentence: "Her _____ response differed from his hasty decision. (antonym of hasty)",
            word: "deliberate",
            options: ["quick", "careful and slow", "angry", "confused"],
            correct: 1,
            hint: "The opposite of doing something quickly without thinking."
        },
        // More context exercises
        {
            type: "context",
            sentence: "The team's _____ improved after they won three games in a row.",
            word: "morale",
            options: ["equipment", "field", "team spirit", "uniforms"],
            correct: 2,
            hint: "What improves when a team is winning?"
        },
        {
            type: "context",
            sentence: "The coach's _____ helped the team stay focused during tough times.",
            word: "encouragement",
            options: ["criticism", "support and motivation", "whistle", "clipboard"],
            correct: 1,
            hint: "What does a coach give to help players feel better?"
        },
        {
            type: "context",
            sentence: "The player's _____ was evident when he helped opponents who fell.",
            word: "sportsmanship",
            options: ["anger", "fair play and respect", "speed", "strength"],
            correct: 1,
            hint: "What do we call good behavior in sports?"
        }
    ];
    
    let currentExercise = null;
    let usedExercises = [];
    
    function startPractice() {
        // Get a random exercise that hasn't been used recently
        let availableExercises = exercises.filter(e => !usedExercises.includes(exercises.indexOf(e)));
        
        if (availableExercises.length === 0) {
            usedExercises = [];
            availableExercises = exercises;
        }
        
        currentExercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
        const exerciseIndex = exercises.indexOf(currentExercise);
        usedExercises.push(exerciseIndex);
        
        if (usedExercises.length > 10) {
            usedExercises.shift();
        }
        
        showExercise();
    }
    
    function showExercise() {
        const container = document.getElementById('questionContainer');
        
        let title = "Vocabulary Practice: ";
        if (currentExercise.type === 'context') {
            title += "Context Clues";
        } else if (currentExercise.type === 'idiom') {
            title += "Idioms & Expressions";
        } else if (currentExercise.type === 'synonym') {
            title += "Synonyms";
        } else if (currentExercise.type === 'antonym') {
            title += "Antonyms";
        }
        
        container.innerHTML = `
            <button class="btn btn-secondary" onclick="backToTopics()">← Back to Topics</button>
            
            <div class="question-section">
                <h2>${title}</h2>
                <p style="margin: 20px 0; font-size: 1.1em;">
                    ${currentExercise.type === 'context' || currentExercise.type === 'idiom' ? 
                      'Choose the word or phrase that best fits the blank:' : 
                      'Choose the correct answer:'}
                </p>
                
                <div style="background: #f7f7f7; padding: 20px; border-radius: 10px; font-size: 1.2em; margin: 20px 0;">
                    ${currentExercise.sentence}
                </div>
                
                <div class="answer-options" id="answerOptions">
                    ${currentExercise.options.map((option, i) => 
                        `<div class="answer-option" onclick="VocabularyModule.checkAnswer(${i})" data-index="${i}">
                            ${option}
                        </div>`
                    ).join('')}
                </div>
                
                <div style="margin-top: 20px;">
                    <button class="btn btn-hint" onclick="VocabularyModule.showHint()">💡 Get Hint</button>
                </div>
                
                <div id="feedbackArea"></div>
            </div>
        `;
    }
    
    function checkAnswer(index) {
        const isCorrect = index === currentExercise.correct;
        const word = currentExercise.word || currentExercise.idiom;
        
        // Update user progress
        window.updateProgress(isCorrect);
        
        if (isCorrect && !window.userData.wordsLearned.includes(word)) {
            window.userData.wordsLearned.push(word);
            window.saveUserData();
            window.updateStats();
        }
        
        // Visual feedback
        const options = document.querySelectorAll('.answer-option');
        options[index].classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) {
            options[currentExercise.correct].classList.add('correct');
        }
        
        // Disable further clicks
        options.forEach(opt => opt.style.pointerEvents = 'none');
        
        // Show feedback
        const feedbackArea = document.getElementById('feedbackArea');
        const correctAnswer = currentExercise.options[currentExercise.correct];
        
        let explanationText = '';
        if (currentExercise.type === 'context') {
            explanationText = `The word "${word}" means "${correctAnswer}". In this context, it describes ${currentExercise.hint.toLowerCase()}`;
        } else if (currentExercise.type === 'idiom') {
            explanationText = `"${word}" is an idiom that means "${correctAnswer}". ${currentExercise.hint}`;
        } else if (currentExercise.type === 'synonym') {
            explanationText = `"${word}" is a synonym (similar meaning) for the word mentioned. Both mean "${correctAnswer}".`;
        } else if (currentExercise.type === 'antonym') {
            explanationText = `"${word}" is an antonym (opposite) of the word mentioned. It means "${correctAnswer}".`;
        }
        
        feedbackArea.innerHTML = `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '⭐ Excellent! You got it right!' : '💭 Not quite, but you\'re learning!'}
                <div class="explanation-box">
                    ${explanationText}
                </div>
            </div>
            <button class="btn btn-primary" onclick="VocabularyModule.startPractice()" style="margin-top: 15px;">
                Try Another Word →
            </button>
        `;
    }
    
    function showHint() {
        alert(`💡 Hint: ${currentExercise.hint}`);
    }
    
    // Public API
    return {
        startPractice: startPractice,
        checkAnswer: checkAnswer,
        showHint: showHint
    };
})();
