// writing.js - Writing Skills Module

window.WritingModule = (function() {
    'use strict';
    
    // Writing exercises database
    const exercises = [
        // ========== SENTENCE SEQUENCING EXERCISES ==========
        {
            type: "sequence",
            title: "Put these sentences in the correct order to make a paragraph:",
            topic: "soccer",
            sentences: [
                "Finally, he scored the winning goal in overtime.",
                "First, Jordan arrived at the field early to warm up.",
                "During the game, he made several great passes to his teammates.",
                "Next, the coach gave the team their positions."
            ],
            correct: [1, 3, 2, 0],
            explanation: "The paragraph should follow chronological order: arrival, coach's instructions, game play, and finally the winning goal."
        },
        {
            type: "sequence",
            title: "Arrange these instructions for making a sandwich:",
            topic: "instructions",
            sentences: [
                "Finally, cut the sandwich in half.",
                "First, get two slices of bread.",
                "Then, add your favorite toppings.",
                "Next, spread peanut butter on one slice."
            ],
            correct: [1, 3, 2, 0],
            explanation: "Instructions should follow the logical order of making a sandwich."
        },
        {
            type: "sequence",
            title: "Order these sentences about a science experiment:",
            topic: "science",
            sentences: [
                "In conclusion, the plant with sunlight grew taller.",
                "To begin, we placed one plant in sunlight.",
                "After one week, we measured both plants.",
                "Then, we put another plant in a dark closet."
            ],
            correct: [1, 3, 2, 0],
            explanation: "Scientific writing follows a clear sequence: setup, process, observation, conclusion."
        },
        {
            type: "sequence",
            title: "Arrange this story in order:",
            topic: "narrative",
            sentences: [
                "Eventually, they found their way home using the stars.",
                "Once upon a time, two friends went hiking.",
                "Suddenly, they realized they were lost.",
                "As darkness fell, they started to worry."
            ],
            correct: [1, 2, 3, 0],
            explanation: "Stories follow a narrative arc: introduction, problem, rising action, resolution."
        },
        {
            type: "sequence",
            title: "Put these steps for studying in order:",
            topic: "education",
            sentences: [
                "Finally, review your notes before the test.",
                "Start by reading the chapter carefully.",
                "Then, write down the main ideas.",
                "Next, make flashcards for important terms."
            ],
            correct: [1, 2, 3, 0],
            explanation: "Study steps should progress from reading to note-taking to review."
        },
        
        // ========== SUPPORTING DETAILS EXERCISES ==========
        {
            type: "supporting-details",
            title: "Which sentence best supports the main idea?",
            mainIdea: "Exercise is important for health",
            options: [
                "Many people own gym memberships.",
                "Regular exercise reduces the risk of heart disease by 40%.",
                "Gym equipment can be expensive.",
                "Some exercises require special shoes."
            ],
            correct: 1,
            explanation: "This sentence provides specific evidence about a health benefit of exercise."
        },
        {
            type: "supporting-details",
            title: "Choose the best supporting detail for this topic sentence:",
            mainIdea: "Soccer requires teamwork to succeed",
            options: [
                "Soccer balls are made of leather.",
                "Players must communicate and pass to create scoring opportunities.",
                "The field is 100 yards long.",
                "Soccer is played in many countries."
            ],
            correct: 1,
            explanation: "This detail explains HOW teamwork is necessary in soccer."
        },
        {
            type: "supporting-details",
            title: "Which detail supports the claim?",
            mainIdea: "Reading improves vocabulary",
            options: [
                "Books come in many sizes.",
                "Students who read 20 minutes daily learn 1,800 new words per year.",
                "Libraries are quiet places.",
                "Some people prefer audiobooks."
            ],
            correct: 1,
            explanation: "This provides specific data showing how reading leads to vocabulary growth."
        },
        {
            type: "supporting-details",
            title: "Select the strongest evidence:",
            mainIdea: "Breakfast is the most important meal of the day",
            options: [
                "Many people skip breakfast.",
                "Studies show students who eat breakfast score 17% higher on tests.",
                "Cereal is a popular breakfast food.",
                "Breakfast can be eaten at home or school."
            ],
            correct: 1,
            explanation: "Statistical evidence from studies provides the strongest support."
        },
        {
            type: "supporting-details",
            title: "Which fact best supports this statement?",
            mainIdea: "Technology has changed how we communicate",
            options: [
                "Computers come in different colors.",
                "Over 5 billion people now use mobile phones worldwide.",
                "Some phones are expensive.",
                "Technology companies have offices."
            ],
            correct: 1,
            explanation: "This statistic shows the widespread adoption of communication technology."
        },
        
        // ========== CONCLUSION EXERCISES ==========
        {
            type: "conclusion",
            title: "Choose the best conclusion for a paragraph about recycling:",
            setup: "Recycling helps save natural resources. It reduces pollution in our air and water. Many items can be recycled including paper, plastic, and glass.",
            options: [
                "Recycling bins come in different colors.",
                "Therefore, everyone should make recycling a daily habit to protect our planet.",
                "Some people don't like recycling.",
                "Garbage trucks come once a week."
            ],
            correct: 1,
            explanation: "A good conclusion summarizes the main point and calls for action."
        },
        {
            type: "conclusion",
            title: "Select the best ending for this paragraph about teamwork:",
            setup: "Working in teams helps students learn from each other. Team members can share different skills and ideas. Problems are solved faster when people work together.",
            options: [
                "Some students prefer to work alone.",
                "Teams can have many members.",
                "Clearly, teamwork is an essential skill for success in school and life.",
                "Teachers often assign group projects."
            ],
            correct: 2,
            explanation: "This conclusion reinforces the main idea and extends it to a broader context."
        },
        {
            type: "conclusion",
            title: "Pick the best conclusion about healthy eating:",
            setup: "Eating vegetables provides important vitamins. Fruits give us natural energy. Whole grains help our bodies stay strong.",
            options: [
                "By choosing nutritious foods, we can improve our health and feel better every day.",
                "Fast food is convenient.",
                "Some vegetables are green.",
                "Grocery stores sell many foods."
            ],
            correct: 0,
            explanation: "This conclusion ties together all the points about healthy eating benefits."
        },
        
        // ========== OPINION WRITING EXERCISES ==========
        {
            type: "opinion",
            title: "Choose the best reason to support this opinion:",
            opinion: "Schools should have longer recess periods",
            options: [
                "Because I like recess.",
                "Studies show physical activity improves focus and academic performance.",
                "The playground has swings.",
                "Recess happens outside."
            ],
            correct: 1,
            explanation: "Using research and evidence makes opinion writing more convincing."
        },
        {
            type: "opinion",
            title: "Select the strongest argument:",
            opinion: "Students should read for 30 minutes every day",
            options: [
                "Reading is fun.",
                "Books have pages.",
                "Daily reading improves test scores and builds critical thinking skills.",
                "The library is open after school."
            ],
            correct: 2,
            explanation: "Specific benefits and outcomes provide strong support for opinions."
        },
        {
            type: "opinion",
            title: "Which evidence best supports this claim?",
            opinion: "PE class is important for all students",
            options: [
                "PE teachers wear sneakers.",
                "Physical education reduces obesity and teaches lifelong fitness habits.",
                "The gym is large.",
                "Some students don't like PE."
            ],
            correct: 1,
            explanation: "Citing health benefits and long-term impacts makes the argument stronger."
        },
        
        // ========== TRANSITION WORDS EXERCISES ==========
        {
            type: "transition",
            title: "Choose the best transition word:",
            sentence: "Jordan practiced every day. _____, he made the team.",
            options: [
                "However",
                "As a result",
                "Although",
                "Meanwhile"
            ],
            correct: 1,
            explanation: "'As a result' shows the cause-and-effect relationship between practice and making the team."
        },
        {
            type: "transition",
            title: "Select the appropriate transition:",
            sentence: "The team was tired. _____, they kept playing hard.",
            options: [
                "Therefore",
                "However",
                "Because",
                "Finally"
            ],
            correct: 1,
            explanation: "'However' shows contrast between being tired and continuing to play hard."
        },
        {
            type: "transition",
            title: "Pick the correct transition word:",
            sentence: "First, we studied the vocabulary. _____, we read the story.",
            options: [
                "However",
                "Then",
                "Although",
                "But"
            ],
            correct: 1,
            explanation: "'Then' shows the sequence of events in time order."
        },
        {
            type: "transition",
            title: "Choose the best connecting word:",
            sentence: "She loves to read. _____, her brother prefers videos.",
            options: [
                "Similarly",
                "In contrast",
                "Therefore",
                "Next"
            ],
            correct: 1,
            explanation: "'In contrast' shows the difference between two preferences."
        }
    ];
    
    let currentExercise = null;
    let usedExercises = [];
    let selectedOrder = [];
    
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
        
        // Keep only last 8 used exercises in memory
        if (usedExercises.length > 8) {
            usedExercises.shift();
        }
        
        showExercise();
    }
    
    function showExercise() {
        const container = document.getElementById('questionContainer');
        
        if (currentExercise.type === 'sequence') {
            selectedOrder = [];
            container.innerHTML = `
                <button class="btn btn-secondary" onclick="backToTopics()">← Back to Topics</button>
                
                <div class="question-section">
                    <h2>Writing Practice: Sentence Ordering</h2>
                    <p style="margin: 20px 0; font-size: 1.1em;">${currentExercise.title}</p>
                    
                    <div style="background: #f0f4f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin-bottom: 15px; color: #667eea; font-weight: bold;">
                            📝 Click the sentences in the correct order:
                        </p>
                        <div id="sentenceOptions">
                            ${currentExercise.sentences.map((sentence, i) => 
                                `<div class="answer-option" onclick="WritingModule.selectSentence(${i})" 
                                      data-index="${i}" style="margin: 10px 0; cursor: pointer;">
                                    ${sentence}
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div style="background: #e8f4f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin-bottom: 15px; font-weight: bold;">Your paragraph:</p>
                        <div id="selectedOrder" style="min-height: 100px;">
                            <p style="color: #999; font-style: italic;">Click sentences above to build your paragraph...</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="btn btn-secondary" onclick="WritingModule.resetOrder()">🔄 Reset Order</button>
                        <button class="btn btn-primary" onclick="WritingModule.checkSequence()">✓ Check Answer</button>
                    </div>
                    
                    <div id="feedbackArea"></div>
                </div>
            `;
            
        } else if (currentExercise.type === 'supporting-details' || 
                   currentExercise.type === 'conclusion' || 
                   currentExercise.type === 'opinion' ||
                   currentExercise.type === 'transition') {
            
            let title = "Writing Practice: ";
            if (currentExercise.type === 'supporting-details') title += "Supporting Details";
            else if (currentExercise.type === 'conclusion') title += "Writing Conclusions";
            else if (currentExercise.type === 'opinion') title += "Opinion Writing";
            else if (currentExercise.type === 'transition') title += "Transition Words";
            
            container.innerHTML = `
                <button class="btn btn-secondary" onclick="backToTopics()">← Back to Topics</button>
                
                <div class="question-section">
                    <h2>${title}</h2>
                    <p style="margin: 20px 0; font-size: 1.1em;">${currentExercise.title}</p>
                    
                    ${currentExercise.setup ? `
                        <div style="background: #f7f7f7; padding: 15px; border-radius: 10px; margin: 20px 0;">
                            ${currentExercise.setup}
                        </div>
                    ` : ''}
                    
                    ${currentExercise.mainIdea ? `
                        <div style="background: #667eea; color: white; padding: 15px; border-radius: 10px; margin: 20px 0;">
                            <strong>Main Idea:</strong> ${currentExercise.mainIdea}
                        </div>
                    ` : ''}
                    
                    ${currentExercise.opinion ? `
                        <div style="background: #667eea; color: white; padding: 15px; border-radius: 10px; margin: 20px 0;">
                            <strong>Opinion:</strong> ${currentExercise.opinion}
                        </div>
                    ` : ''}
                    
                    ${currentExercise.sentence ? `
                        <div style="background: #f7f7f7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 1.2em;">
                            ${currentExercise.sentence}
                        </div>
                    ` : ''}
                    
                    <div class="answer-options">
                        ${currentExercise.options.map((option, i) => 
                            `<div class="answer-option" onclick="WritingModule.checkAnswer(${i})" data-index="${i}">
                                ${option}
                            </div>`
                        ).join('')}
                    </div>
                    
                    <div id="feedbackArea"></div>
                </div>
            `;
        }
    }
    
    function selectSentence(index) {
        const sentence = currentExercise.sentences[index];
        const option = document.querySelector(`[data-index="${index}"]`);
        
        if (selectedOrder.includes(index)) {
            // Remove if already selected
            selectedOrder = selectedOrder.filter(i => i !== index);
            option.classList.remove('selected');
        } else {
            // Add to selection
            selectedOrder.push(index);
            option.classList.add('selected');
        }
        
        updateSelectedDisplay();
    }
    
    function updateSelectedDisplay() {
        const display = document.getElementById('selectedOrder');
        if (selectedOrder.length === 0) {
            display.innerHTML = '<p style="color: #999; font-style: italic;">Click sentences above to build your paragraph...</p>';
        } else {
            display.innerHTML = selectedOrder.map((index, position) => 
                `<div style="margin: 10px 0; padding: 10px; background: white; border-radius: 5px; border-left: 3px solid #667eea;">
                    <strong>${position + 1}.</strong> ${currentExercise.sentences[index]}
                </div>`
            ).join('');
        }
    }
    
    function resetOrder() {
        selectedOrder = [];
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        updateSelectedDisplay();
    }
    
    function checkSequence() {
        if (selectedOrder.length !== currentExercise.sentences.length) {
            alert('Please arrange all sentences before checking your answer.');
            return;
        }
        
        const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(currentExercise.correct);
        
        // Update progress
        window.updateProgress(isCorrect);
        
        // Show feedback
        const feedbackArea = document.getElementById('feedbackArea');
        const correctOrder = currentExercise.correct.map(i => currentExercise.sentences[i]);
        
        feedbackArea.innerHTML = `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '⭐ Perfect! You arranged the sentences correctly!' : '💭 Not quite right. Here\'s the correct order:'}
                ${!isCorrect ? `
                    <ol style="margin: 15px 0; padding-left: 20px; background: white; padding: 15px; border-radius: 5px;">
                        ${correctOrder.map(s => `<li style="margin: 8px 0;">${s}</li>`).join('')}
                    </ol>
                ` : ''}
                <div class="explanation-box">
                    <strong>Why this order?</strong><br>
                    ${currentExercise.explanation}
                </div>
            </div>
            <button class="btn btn-primary" onclick="WritingModule.startPractice()" style="margin-top: 15px;">
                Try Another Exercise →
            </button>
        `;
        
        // Disable further interaction
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
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
                ${isCorrect ? '⭐ Excellent choice! You understand this writing concept!' : '💭 Not quite. Let me explain:'}
                <div class="explanation-box">
                    <strong>Explanation:</strong><br>
                    ${currentExercise.explanation}
                </div>
            </div>
            <button class="btn btn-primary" onclick="WritingModule.startPractice()" style="margin-top: 15px;">
                Try Another Exercise →
            </button>
        `;
    }
    
    // Public API
    return {
        startPractice: startPractice,
        checkAnswer: checkAnswer,
        selectSentence: selectSentence,
        resetOrder: resetOrder,
        checkSequence: checkSequence
    };
})();
