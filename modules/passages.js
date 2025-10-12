// passages.js - Reading Comprehension Passages Module

window.PassagesModule = (function() {
    'use strict';
    
    // Track used passages to avoid repetition
    let usedPassages = [];
    let currentPassage = null;
    let currentQuestionIndex = 0;
    
    // Passage Database (30+ passages)
    const passages = {
        level4: [
            // Soccer themed
            {
                id: "soccer_big_game",
                title: "The Big Game",
                theme: "soccer",
                text: "Jordan loved soccer more than any other sport. Every Saturday morning, he would wake up early and practice in his backyard. He would dribble the ball between orange cones his dad had set up. His dog, Max, would chase after the ball, barking happily. Jordan dreamed of playing for his school team one day. He knew that practice was the key to success. His coach always said, 'Hard work beats talent when talent doesn't work hard.' Jordan believed this was true.",
                questions: [
                    {
                        question: "What is the main idea of this passage?",
                        options: [
                            "Jordan has a dog named Max",
                            "Jordan is dedicated to improving at soccer",
                            "Soccer is played on Saturdays",
                            "Jordan's dad helps him practice"
                        ],
                        correct: 1,
                        explanation: "The passage focuses on Jordan's love for soccer and his dedication to practicing."
                    },
                    {
                        question: "What does Jordan's coach mean by 'Hard work beats talent'?",
                        options: [
                            "Talented players never win",
                            "Working hard is more important than natural ability",
                            "You don't need talent to play soccer",
                            "Practice is not important"
                        ],
                        correct: 1,
                        explanation: "The coach means that someone who works hard can succeed more than someone with natural talent who doesn't practice."
                    }
                ],
                vocabulary: {
                    "dribble": "to move a ball forward with small kicks",
                    "key": "the most important part",
                    "talent": "natural skill or ability"
                }
            },
            {
                id: "soccer_tournament",
                title: "The Soccer Tournament",
                theme: "soccer",
                text: "The city soccer tournament was coming up next month. Teams from all over would compete for the championship trophy. Sarah's team, the Lightning Bolts, had been practicing every day after school. Their coach taught them new strategies for passing and defending. The team worked on communication, calling out to each other during plays. Sarah was nervous but excited. She had been chosen as team captain because of her leadership skills. The first game would be against their rivals, the Thunder Hawks.",
                questions: [
                    {
                        question: "Why was Sarah chosen as team captain?",
                        options: [
                            "She was the oldest player",
                            "She had leadership skills",
                            "She scored the most goals",
                            "She knew the coach"
                        ],
                        correct: 1,
                        explanation: "The text states that Sarah was chosen as team captain 'because of her leadership skills.'"
                    },
                    {
                        question: "What were the Lightning Bolts preparing for?",
                        options: [
                            "A practice game",
                            "School tryouts",
                            "A city tournament",
                            "A team party"
                        ],
                        correct: 2,
                        explanation: "The passage mentions 'The city soccer tournament was coming up next month.'"
                    }
                ],
                vocabulary: {
                    "tournament": "a competition with many teams or players",
                    "strategies": "plans to achieve a goal",
                    "rivals": "competitors or opponents"
                }
            },
            {
                id: "goalkeeper_challenge",
                title: "The Goalkeeper's Challenge",
                theme: "soccer",
                text: "Being a goalkeeper was the hardest position on the field. Tom had to watch every player and predict where the ball would go. His reflexes needed to be lightning fast. During practice, his teammates would take penalty shots while he defended the goal. Some days he stopped every shot, and other days the ball flew past him. But Tom never gave up. He studied videos of professional goalkeepers to learn their techniques. By the end of the season, he had become one of the best goalkeepers in the league.",
                questions: [
                    {
                        question: "What made Tom improve as a goalkeeper?",
                        options: [
                            "He was naturally talented",
                            "He never gave up and studied professionals",
                            "His teammates were bad at shooting",
                            "He had expensive equipment"
                        ],
                        correct: 1,
                        explanation: "Tom improved because he 'never gave up' and 'studied videos of professional goalkeepers.'"
                    },
                    {
                        question: "What does 'predict' mean in this passage?",
                        options: [
                            "To guess what will happen",
                            "To kick the ball",
                            "To run fast",
                            "To catch something"
                        ],
                        correct: 0,
                        explanation: "Predict means to guess or figure out what will happen before it does."
                    }
                ],
                vocabulary: {
                    "reflexes": "automatic responses to something",
                    "predict": "to guess what will happen",
                    "techniques": "special ways of doing something"
                }
            },
            // Science themed
            {
                id: "water_cycle",
                title: "The Water Cycle",
                theme: "science",
                text: "Water moves in a continuous cycle on Earth. First, the sun heats water in oceans, lakes, and rivers, causing it to evaporate and turn into water vapor. This vapor rises into the atmosphere where it cools down. As it cools, the vapor condenses into tiny water droplets that form clouds. When the droplets become too heavy, they fall back to Earth as precipitation - rain, snow, or hail. The water then flows back into bodies of water or soaks into the ground, and the cycle begins again.",
                questions: [
                    {
                        question: "What causes water to evaporate?",
                        options: ["Wind", "The sun's heat", "Clouds", "Rain"],
                        correct: 1,
                        explanation: "The passage states 'the sun heats water... causing it to evaporate.'"
                    },
                    {
                        question: "What happens after water vapor cools in the atmosphere?",
                        options: [
                            "It disappears",
                            "It becomes ice immediately",
                            "It condenses into water droplets that form clouds",
                            "It falls as rain right away"
                        ],
                        correct: 2,
                        explanation: "The text explains that when vapor cools, it 'condenses into tiny water droplets that form clouds.'"
                    }
                ],
                vocabulary: {
                    "evaporate": "to change from liquid to gas",
                    "condense": "to change from gas to liquid",
                    "precipitation": "water falling from clouds as rain, snow, or hail"
                }
            },
            {
                id: "animal_adaptations",
                title: "Amazing Animal Adaptations",
                theme: "science",
                text: "Animals have developed incredible adaptations to survive in their environments. The Arctic fox changes its fur color from brown in summer to white in winter, helping it blend in with the snow. Camels store fat in their humps, which they can use for energy when food is scarce in the desert. Penguins have special feathers that trap air, keeping them warm and helping them float in icy water. These adaptations didn't happen overnight. They developed over thousands of years through evolution, helping each species survive in its unique habitat.",
                questions: [
                    {
                        question: "Why does the Arctic fox change its fur color?",
                        options: [
                            "To look prettier",
                            "To stay warm",
                            "To blend in with its surroundings",
                            "To attract mates"
                        ],
                        correct: 2,
                        explanation: "The fox changes color to 'blend in with the snow' for camouflage."
                    },
                    {
                        question: "How do adaptations develop?",
                        options: [
                            "They happen overnight",
                            "Over thousands of years through evolution",
                            "Animals choose them",
                            "Scientists create them"
                        ],
                        correct: 1,
                        explanation: "The passage states adaptations 'developed over thousands of years through evolution.'"
                    }
                ],
                vocabulary: {
                    "adaptations": "special features that help animals survive",
                    "evolution": "gradual change over time",
                    "habitat": "the natural home of an animal or plant"
                }
            },
            // Adventure themed
            {
                id: "hidden_cave",
                title: "The Hidden Cave",
                theme: "adventure",
                text: "Maya and her brother Alex discovered a hidden cave while hiking in the mountains. The entrance was covered by thick vines and bushes. Inside, their flashlights revealed sparkling crystals on the walls. The cave was cool and damp, with the sound of dripping water echoing through the chambers. They found ancient drawings on one wall, showing people hunting animals that no longer existed. Maya took photos while Alex made notes in his journal. They marked the location on their map, planning to return with their science teacher to learn more about their discovery.",
                questions: [
                    {
                        question: "What did Maya and Alex find on the cave walls?",
                        options: [
                            "Modern graffiti",
                            "Ancient drawings and crystals",
                            "Gold coins",
                            "Animal bones"
                        ],
                        correct: 1,
                        explanation: "They found 'sparkling crystals' and 'ancient drawings' on the walls."
                    },
                    {
                        question: "What did they plan to do after their discovery?",
                        options: [
                            "Keep it secret forever",
                            "Sell the crystals",
                            "Return with their science teacher",
                            "Move into the cave"
                        ],
                        correct: 2,
                        explanation: "They planned 'to return with their science teacher to learn more.'"
                    }
                ],
                vocabulary: {
                    "chambers": "rooms or enclosed spaces",
                    "ancient": "very old, from long ago",
                    "echoing": "sounds bouncing off walls"
                }
            },
            // More passages to reach 10+ for level 4...
            {
                id: "school_garden",
                title: "The School Garden Project",
                theme: "school",
                text: "Mrs. Chen's class started a vegetable garden behind the school. Each student was responsible for one plant. They learned to prepare the soil, plant seeds, and water them carefully. Tommy chose to grow tomatoes, while Lisa planted carrots. Every day, they checked their plants for bugs and weeds. After two months, the vegetables were ready to harvest. The class made a fresh salad with their crops and shared it with the whole school. Everyone was proud of what they had grown together. The principal was so impressed that she asked them to expand the garden next year.",
                questions: [
                    {
                        question: "What was each student responsible for?",
                        options: ["The whole garden", "One plant", "Watering all plants", "Buying seeds"],
                        correct: 1,
                        explanation: "Each student was responsible for one plant."
                    },
                    {
                        question: "How did the principal react to the garden?",
                        options: [
                            "She was angry",
                            "She ignored it",
                            "She was impressed and wanted it expanded",
                            "She made them remove it"
                        ],
                        correct: 2,
                        explanation: "The principal was impressed and asked them to expand the garden next year."
                    }
                ],
                vocabulary: {
                    "harvest": "to gather crops when they're ready",
                    "expand": "to make bigger",
                    "responsible": "in charge of taking care of something"
                }
            }
        ],
        level5: [
            {
                id: "pro_soccer_dreams",
                title: "Professional Soccer Dreams",
                theme: "soccer",
                text: "Marcus watched the World Cup final with intense concentration. The players moved with incredible speed and precision, passing the ball as if they could read each other's minds. He observed how the midfielder controlled the game's tempo, speeding up attacks and slowing down when necessary. The goalkeeper's reflexes were lightning-fast, diving to block shots that seemed impossible to stop. Marcus took notes in his journal, writing down the techniques he wanted to practice. His local coach had told him that studying professional players was just as important as physical training. Understanding the mental aspect of soccer could elevate his game to the next level.",
                questions: [
                    {
                        question: "According to the passage, what makes watching professional soccer valuable for Marcus?",
                        options: [
                            "It's entertaining and fun",
                            "It helps him understand techniques and mental aspects",
                            "His parents want him to watch",
                            "It's better than practicing"
                        ],
                        correct: 1,
                        explanation: "The coach said studying professionals is important, and Marcus learns techniques and mental aspects."
                    },
                    {
                        question: "What does 'tempo' mean in the context of this passage?",
                        options: [
                            "The temperature of the game",
                            "The score of the match",
                            "The speed and rhythm of play",
                            "The time remaining"
                        ],
                        correct: 2,
                        explanation: "Tempo refers to the pace or speed of the game, as shown by 'speeding up attacks and slowing down.'"
                    }
                ],
                vocabulary: {
                    "precision": "exactness and accuracy",
                    "tempo": "the speed or pace of activity",
                    "elevate": "to raise or improve"
                }
            },
            // Add more level 5 passages...
        ],
        level6: [
            {
                id: "science_of_soccer",
                title: "The Science of Soccer",
                theme: "soccer",
                text: "Professional soccer players utilize advanced scientific methods to enhance their performance. Sports scientists analyze players' movements using high-speed cameras and GPS trackers, gathering data about sprint speeds, distances covered, and energy expenditure. This information helps coaches develop personalized training programs. Nutrition specialists create customized meal plans to optimize energy levels and recovery. Players undergo biomechanical assessments to improve their kicking technique and prevent injuries. Mental performance coaches work with athletes on visualization techniques and stress management. The modern game has evolved far beyond simple physical training, incorporating elements from multiple scientific disciplines to create complete athletes.",
                questions: [
                    {
                        question: "What is the main purpose of using scientific methods in soccer?",
                        options: [
                            "To make the game more complicated",
                            "To enhance player performance",
                            "To impress the fans",
                            "To increase ticket prices"
                        ],
                        correct: 1,
                        explanation: "Scientific methods are used 'to enhance their performance.'"
                    },
                    {
                        question: "How has soccer training changed according to the passage?",
                        options: [
                            "It now includes multiple scientific disciplines",
                            "It focuses only on running",
                            "It has become less important",
                            "It only uses traditional methods"
                        ],
                        correct: 0,
                        explanation: "Modern soccer incorporates 'elements from multiple scientific disciplines.'"
                    }
                ],
                vocabulary: {
                    "utilize": "to make use of",
                    "expenditure": "the amount used or spent",
                    "biomechanical": "relating to the mechanics of body movements"
                }
            }
            // Add more level 6 passages...
        ]
    };
    
    // Module functions
    function startComprehension(userData, parentSettings) {
        // Select appropriate level
        let passageSet = passages.level4;
        if (userData.readingLevel >= 500) passageSet = passages.level5;
        if (userData.readingLevel >= 600) passageSet = passages.level6;
        
        // Filter out recently used passages
        let availablePassages = passageSet.filter(p => !usedPassages.includes(p.id));
        
        // Reset if all passages have been used
        if (availablePassages.length === 0) {
            usedPassages = [];
            availablePassages = passageSet;
        }
        
        // Select random passage
        currentPassage = availablePassages[Math.floor(Math.random() * availablePassages.length)];
        usedPassages.push(currentPassage.id);
        
        // Keep only last 5 used passages in memory
        if (usedPassages.length > 5) {
            usedPassages.shift();
        }
        
        currentQuestionIndex = 0;
        showPassageAndQuestion(userData, parentSettings);
    }
    
    function showPassageAndQuestion(userData, parentSettings) {
        const container = document.getElementById('questionContainer');
        const question = currentPassage.questions[currentQuestionIndex];
        
        // Process passage text to highlight vocabulary
        let processedText = currentPassage.text;
        if (currentPassage.vocabulary) {
            for (const [word, definition] of Object.entries(currentPassage.vocabulary)) {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                processedText = processedText.replace(regex, 
                    `<span class="highlight-vocab">${word}<span class="vocab-tooltip">${definition}</span></span>`
                );
            }
        }
        
        // Apply text size preference
        const textSizeClass = parentSettings.textSizeOverride || userData.preferences.textSize || 'medium';
        
        container.innerHTML = `
            <button class="btn btn-secondary" onclick="backToTopics()">← Back to Topics</button>
            
            <div class="passage-container">
                <div class="passage-title">
                    ${currentPassage.title}
                    <span class="reading-level-indicator">Level ${window.getReadingLevelName(userData.readingLevel)}</span>
                </div>
                <div class="passage-text ${textSizeClass}">${processedText}</div>
            </div>
            
            <div class="progress-tracker">
                ${currentPassage.questions.map((_, i) => 
                    `<div class="progress-dot ${i < currentQuestionIndex ? 'completed' : ''} ${i === currentQuestionIndex ? 'current' : ''}"></div>`
                ).join('')}
            </div>
            
            <div class="question-section">
                <div class="question-number">Question ${currentQuestionIndex + 1} of ${currentPassage.questions.length}</div>
                <div class="question-text">${question.question}</div>
                
                <div class="answer-options" id="answerOptions">
                    ${question.options.map((option, i) => 
                        `<div class="answer-option" onclick="PassagesModule.selectAndCheck(${i})" data-index="${i}">${option}</div>`
                    ).join('')}
                </div>
                
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn btn-hint" onclick="PassagesModule.showHint()">💡 Get Hint</button>
                    <button class="btn btn-primary" onclick="PassagesModule.checkAnswer()" id="submitBtn">Submit Answer</button>
                </div>
                
                <div id="feedbackArea"></div>
            </div>
        `;
    }
    
    function selectAndCheck(index) {
        window.selectAnswer(index);
    }
    
    function checkAnswer() {
        const selected = document.querySelector('.answer-option.selected');
        if (!selected) {
            alert('Please select an answer!');
            return;
        }
        
        const selectedIndex = parseInt(selected.dataset.index);
        const question = currentPassage.questions[currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        // Update progress through main app
        window.updateProgress(isCorrect);
        
        // Show feedback
        showFeedback(isCorrect, question.explanation, question.correct);
        
        // Disable further interaction
        document.getElementById('submitBtn').disabled = true;
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
        
        // Highlight correct/incorrect
        const options = document.querySelectorAll('.answer-option');
        options[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) {
            options[question.correct].classList.add('correct');
        }
    }
    
    function showFeedback(isCorrect, explanation) {
        const feedbackArea = document.getElementById('feedbackArea');
        
        const messages = isCorrect ? 
            ["⭐ Excellent work!", "🎉 Perfect!", "💪 Great job!", "🚀 You're on fire!", "⚽ GOAL! Nice work!"] :
            ["Keep trying!", "You'll get the next one!", "Good effort!", "Learn and improve!"];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        feedbackArea.innerHTML = `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                ${message}
                ${!isCorrect ? `
                    <div class="explanation-box">
                        <strong>Explanation:</strong><br>
                        ${explanation}
                    </div>
                ` : ''}
            </div>
            <button class="btn btn-primary" onclick="PassagesModule.nextQuestion()" style="margin-top: 15px;">
                ${currentQuestionIndex < currentPassage.questions.length - 1 ? 'Next Question →' : 'Finish Activity ✓'}
            </button>
        `;
    }
    
    function showHint() {
        alert("💡 Hint: Look for the answer in the passage! Find the part that talks about what the question is asking.");
    }
    
    function nextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex >= currentPassage.questions.length) {
            // Activity complete
            window.userData.passagesRead++;
            window.saveUserData();
            
            if (window.userData.completedToday >= window.userData.dailyGoal) {
                window.showAchievement("Daily Goal Reached!", "You've completed your daily goal! 🎉");
            }
            
            window.backToTopics();
        } else {
            showPassageAndQuestion(window.userData, window.parentSettings);
        }
    }
    
    // Public API
    return {
        startComprehension: startComprehension,
        selectAndCheck: selectAndCheck,
        checkAnswer: checkAnswer,
        showHint: showHint,
        nextQuestion: nextQuestion
    };
})();
