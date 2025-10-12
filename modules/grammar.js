// grammar.js - Grammar Practice Module

window.GrammarModule = (function() {
    'use strict';
    
    // Grammar exercises database
    const exercises = [
        // Verb tense exercises
        {
            type: "verb-tense",
            sentence: "Yesterday, Jordan _____ three goals in the soccer match.",
            options: ["scores", "scored", "will score", "is scoring"],
            correct: 1,
            explanation: "'Yesterday' indicates past tense, so 'scored' is correct."
        },
        {
            type: "verb-tense",
            sentence: "By next week, we _____ all our games.",
            options: ["played", "play", "will have played", "playing"],
            correct: 2,
            explanation: "'By next week' indicates future perfect tense - an action that will be completed in the future."
        },
        {
            type: "verb-tense",
            sentence: "Right now, the team _____ on the field.",
            options: ["practiced", "is practicing", "will practice", "practice"],
            correct: 1,
            explanation: "'Right now' indicates present continuous tense - something happening at this moment."
        },
        {
            type: "verb-tense",
            sentence: "Every Saturday, she _____ soccer with her friends.",
            options: ["played", "plays", "will play", "is playing"],
            correct: 1,
            explanation: "'Every Saturday' indicates a regular habit, so we use simple present tense 'plays'."
        },
        {
            type: "verb-tense",
            sentence: "The coach _____ the team for three years before retiring.",
            options: ["has trained", "trains", "had trained", "is training"],
            correct: 2,
            explanation: "Past perfect 'had trained' shows an action completed before another past action (retiring)."
        },
        // Subject-verb agreement
        {
            type: "subject-verb",
            sentence: "The team _____ practicing every day this week.",
            options: ["are", "is", "were", "be"],
            correct: 1,
            explanation: "'Team' is a singular collective noun, so it takes the singular verb 'is'."
        },
        {
            type: "subject-verb",
            sentence: "Each of the players _____ their own equipment.",
            options: ["bring", "brings", "bringing", "have brought"],
            correct: 1,
            explanation: "'Each' is singular, so it takes the singular verb 'brings'."
        },
        {
            type: "subject-verb",
            sentence: "Neither the coach nor the players _____ happy with the result.",
            options: ["was", "were", "is", "has been"],
            correct: 1,
            explanation: "With 'neither...nor', the verb agrees with the closer subject (players = plural = were)."
        },
        {
            type: "subject-verb",
            sentence: "Everyone on the team _____ to win the championship.",
            options: ["want", "wants", "wanting", "are wanting"],
            correct: 1,
            explanation: "'Everyone' is singular, so it takes the singular verb 'wants'."
        },
        // Pronoun usage
        {
            type: "pronoun",
            sentence: "Each player must bring _____ own water bottle.",
            options: ["their", "his or her", "its", "them"],
            correct: 1,
            explanation: "'Each' is singular, so technically 'his or her' is grammatically correct, though 'their' is becoming acceptable."
        },
        {
            type: "pronoun",
            sentence: "The team celebrated _____ victory with pizza.",
            options: ["their", "it's", "its", "there"],
            correct: 2,
            explanation: "'Its' (without apostrophe) is the possessive form for the team."
        },
        {
            type: "pronoun",
            sentence: "Between you and _____, we can win this game.",
            options: ["I", "me", "myself", "mine"],
            correct: 1,
            explanation: "After prepositions like 'between', use object pronouns like 'me'."
        },
        // Adjective vs. Adverb
        {
            type: "adjective-adverb",
            sentence: "The goalkeeper moved _____ to block the shot.",
            options: ["quick", "quickly", "quicker", "quickest"],
            correct: 1,
            explanation: "We need an adverb 'quickly' to describe how the goalkeeper moved (modifying the verb)."
        },
        {
            type: "adjective-adverb",
            sentence: "She plays soccer very _____.",
            options: ["good", "well", "better", "best"],
            correct: 1,
            explanation: "'Well' is an adverb describing how she plays. 'Good' is an adjective."
        },
        {
            type: "adjective-adverb",
            sentence: "The team felt _____ about their performance.",
            options: ["bad", "badly", "worse", "worst"],
            correct: 0,
            explanation: "After linking verbs like 'felt', use adjectives ('bad'), not adverbs."
        },
        // Punctuation and sentence structure
        {
            type: "punctuation",
            sentence: "Which sentence is punctuated correctly?",
            options: [
                "Jordan, the team captain, scored two goals.",
                "Jordan the team captain scored two goals.",
                "Jordan, the team captain scored two goals.",
                "Jordan the team, captain, scored two goals."
            ],
            correct: 0,
            explanation: "Appositives (the team captain) should be set off with commas on both sides."
        },
        {
            type: "punctuation",
            sentence: "Choose the correctly punctuated sentence:",
            options: [
                "We need: shoes, socks, and shin guards.",
                "We need shoes, socks, and shin guards.",
                "We need, shoes socks and shin guards.",
                "We need shoes socks and shin guards."
            ],
            correct: 1,
            explanation: "Use commas to separate items in a list, not colons or incorrect placement."
        },
        // Commonly confused words
        {
            type: "confused-words",
            sentence: "_____ going to practice at the park.",
            options: ["Their", "There", "They're", "Thier"],
            correct: 2,
            explanation: "'They're' is a contraction of 'they are'. 'Their' is possessive. 'There' indicates location."
        },
        {
            type: "confused-words",
            sentence: "The game had a positive _____ on team morale.",
            options: ["affect", "effect", "effected", "affected"],
            correct: 1,
            explanation: "'Effect' is a noun (the result). 'Affect' is usually a verb (to influence)."
        },
        {
            type: "confused-words",
            sentence: "Please _____ your uniform to practice.",
            options: ["bring", "take", "brought", "took"],
            correct: 0,
            explanation: "'Bring' means to carry toward the speaker. 'Take' means to carry away from the speaker."
        },
        // Sentence fragments and run-ons
        {
            type: "sentence-structure",
            sentence: "Which is a complete sentence?",
            options: [
                "Running down the field with the ball.",
                "The player scored.",
                "Because the game was important.",
                "After the whistle blew loudly."
            ],
            correct: 1,
            explanation: "A complete sentence needs a subject and a predicate. 'The player scored' has both."
        },
        {
            type: "sentence-structure",
            sentence: "How should this run-on be fixed? 'The game started late it ended after dark.'",
            options: [
                "The game started late, it ended after dark.",
                "The game started late. It ended after dark.",
                "The game started late it, ended after dark.",
                "The game, started late it ended after dark."
            ],
            correct: 1,
            explanation: "Separate two independent clauses with a period or semicolon, not a comma (which creates a comma splice)."
        },
        // Comparative and superlative
        {
            type: "comparative",
            sentence: "Jordan is the _____ player on the team.",
            options: ["faster", "fastest", "more fast", "most fast"],
            correct: 1,
            explanation: "Use superlative 'fastest' when comparing more than two things (the whole team)."
        },
        {
            type: "comparative",
            sentence: "This game is _____ than the last one.",
            options: ["more exciting", "most exciting", "excitinger", "more excite"],
            correct: 0,
            explanation: "Use comparative 'more exciting' when comparing two things."
        }
    ];
    
    let currentExercise = null;
    let usedExercises = [];
    
    function startPractice() {
        // Get a random exercise
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
        
        let title = "Grammar Practice: ";
        switch(currentExercise.type) {
            case 'verb-tense': title += "Verb Tenses"; break;
            case 'subject-verb': title += "Subject-Verb Agreement"; break;
            case 'pronoun': title += "Pronoun Usage"; break;
            case 'adjective-adverb': title += "Adjectives vs. Adverbs"; break;
            case 'punctuation': title += "Punctuation"; break;
            case 'confused-words': title += "Commonly Confused Words"; break;
            case 'sentence-structure': title += "Sentence Structure"; break;
            case 'comparative': title += "Comparatives & Superlatives"; break;
            default: title += "Grammar Skills";
        }
        
        container.innerHTML = `
            <button class="btn btn-secondary" onclick="backToTopics()">← Back to Topics</button>
            
            <div class="question-section">
                <h2>${title}</h2>
                
                <p style="margin: 20px 0; font-size: 1.1em;">
                    ${currentExercise.type === 'sentence-structure' || currentExercise.type === 'punctuation' ? 
                      currentExercise.sentence : 
                      'Choose the correct answer to complete the sentence:'}
                </p>
                
                ${currentExercise.type !== 'sentence-structure' && currentExercise.type !== 'punctuation' ? `
                    <div style="background: #f7f7f7; padding: 20px; border-radius: 10px; font-size: 1.2em; margin: 20px 0;">
                        ${currentExercise.sentence}
                    </div>
                ` : ''}
                
                <div class="answer-options">
                    ${currentExercise.options.map((option, i) => 
                        `<div class="answer-option" onclick="GrammarModule.checkAnswer(${i})" data-index="${i}">
                            ${option}
                        </div>`
                    ).join('')}
                </div>
                
                <div style="margin-top: 20px;">
                    <button class="btn btn-hint" onclick="GrammarModule.showHint()">💡 Grammar Tip</button>
                </div>
                
                <div id="feedbackArea"></div>
            </div>
        `;
    }
    
    function checkAnswer(index) {
        const isCorrect = index === currentExercise.correct;
        
        // Update progress
        window.updateProgress(isCorrect);
        
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
        feedbackArea.innerHTML = `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '⭐ Perfect grammar!' : '💭 Let me explain the rule:'}
                <div class="explanation-box">
                    <strong>Grammar Rule:</strong><br>
                    ${currentExercise.explanation}
                </div>
            </div>
            <button class="btn btn-primary" onclick="GrammarModule.startPractice()" style="margin-top: 15px;">
                Try Another Grammar Question →
            </button>
        `;
    }
    
    function showHint() {
        let hint = "";
        switch(currentExercise.type) {
            case 'verb-tense':
                hint = "Look for time words (yesterday, tomorrow, now) to identify the correct tense.";
                break;
            case 'subject-verb':
                hint = "Identify if the subject is singular or plural, then match the verb form.";
                break;
            case 'pronoun':
                hint = "Check if you need a subject pronoun (I, he) or object pronoun (me, him).";
                break;
            case 'adjective-adverb':
                hint = "Adjectives describe nouns. Adverbs describe verbs, adjectives, or other adverbs.";
                break;
            case 'punctuation':
                hint = "Commas separate items in a list and set off extra information.";
                break;
            case 'confused-words':
                hint = "Think about the meaning: possession (their), location (there), or contraction (they're).";
                break;
            case 'sentence-structure':
                hint = "A complete sentence needs both a subject (who/what) and a predicate (what they do).";
                break;
            case 'comparative':
                hint = "Use -er/more for comparing two things, -est/most for comparing three or more.";
                break;
            default:
                hint = "Read the sentence carefully and think about standard grammar rules.";
        }
        alert(`💡 Grammar Tip: ${hint}`);
    }
    
    // Public API
    return {
        startPractice: startPractice,
        checkAnswer: checkAnswer,
        showHint: showHint
    };
})();
