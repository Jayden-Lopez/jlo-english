// passages.js - Reading Comprehension Module with Mastery Tracking

window.PassagesModule = (function() {
    'use strict';
    
    let currentPassageIndex = 0;
    let currentQuestionIndex = 0;
    let currentPassage = null;
    let sessionQuestions = [];
    let questionsPerSession = 5;
    let sessionCorrect = 0;
    let sessionTotal = 0;
    
    // Grade-appropriate passages with skill tags
    const passages = {
        grade4: [
            {
                title: "The Soccer Championship",
                text: `The Tigers soccer team had been practicing all season for the championship game. Every player worked hard, running drills and practicing their skills. On game day, the stadium was packed with excited fans. The Tigers played their best, but they were losing 2-1 with only five minutes left. Then, Maria received a perfect pass and scored the tying goal! In the final minute, the team worked together and scored the winning goal. The crowd cheered as the Tigers won their first championship.`,
                questions: [
                    {
                        question: "What is the main idea of this passage?",
                        skill: "mainIdea",
                        options: [
                            "Soccer is a popular sport",
                            "The Tigers won the championship through teamwork",
                            "Maria is the best player",
                            "Practice makes perfect"
                        ],
                        correct: 1,
                        explanation: "The passage focuses on how the Tigers team won the championship game."
                    },
                    {
                        question: "Why did the Tigers win the game?",
                        skill: "causeEffect",
                        options: [
                            "They had the best uniforms",
                            "The other team gave up",
                            "They worked together and didn't give up",
                            "Maria scored all the goals"
                        ],
                        correct: 2,
                        explanation: "The passage shows the team working together, especially in the final minute."
                    },
                    {
                        question: "How do you think the Tigers felt when they were losing?",
                        skill: "inference",
                        options: [
                            "Happy and excited",
                            "Worried but determined",
                            "Ready to quit",
                            "Angry at the coach"
                        ],
                        correct: 1,
                        explanation: "We can infer they were worried about losing but kept trying hard to win."
                    }
                ]
            },
            {
                title: "The Science Fair Project",
                text: `Emma wanted to win the science fair. She decided to test which type of soil helps plants grow best. First, she planted three identical bean seeds in different types of soil: sandy soil, clay soil, and potting soil. She watered each plant the same amount every day and placed them in the same sunny window. After two weeks, Emma measured the plants. The plant in potting soil grew the tallest at 8 inches. The plant in sandy soil grew 5 inches, and the plant in clay soil only grew 3 inches. Emma learned that potting soil has the nutrients plants need to grow strong.`,
                questions: [
                    {
                        question: "What was Emma trying to find out?",
                        skill: "mainIdea",
                        options: [
                            "Which plant grows fastest",
                            "How much water plants need",
                            "Which soil is best for plant growth",
                            "Why plants need sunlight"
                        ],
                        correct: 2,
                        explanation: "Emma's experiment was specifically about testing different types of soil."
                    },
                    {
                        question: "What happened first in Emma's experiment?",
                        skill: "sequence",
                        options: [
                            "She measured the plants",
                            "She watered the plants daily",
                            "She planted three seeds in different soils",
                            "She placed them in a window"
                        ],
                        correct: 2,
                        explanation: "The passage says 'First, she planted three identical bean seeds.'"
                    },
                    {
                        question: "Based on the passage, what does 'nutrients' probably mean?",
                        skill: "vocabulary",
                        options: [
                            "Water that plants drink",
                            "Substances that help plants grow",
                            "Different types of soil",
                            "Sunlight from the window"
                        ],
                        correct: 1,
                        explanation: "The context tells us nutrients are in the soil and help plants 'grow strong.'"
                    }
                ]
            },
            {
                title: "The Lost Puppy",
                text: `Jake was walking home from school when he heard a soft whimpering sound. Behind a bush, he found a small, muddy puppy with no collar. The puppy looked scared and hungry. Jake didn't know what to do, but he knew he couldn't leave the puppy alone. He gently picked up the puppy and carried it home. His mom helped him give the puppy a bath and some food. They checked for a microchip at the vet, but there wasn't one. Jake's family posted pictures online and put up flyers around the neighborhood. After three days, a worried family called. They had been searching everywhere for their lost puppy. Jake was sad to say goodbye, but he was happy the puppy was going home.`,
                questions: [
                    {
                        question: "What kind of person is Jake?",
                        skill: "characterAnalysis",
                        options: [
                            "Selfish and mean",
                            "Caring and responsible",
                            "Lazy and forgetful",
                            "Brave and strong"
                        ],
                        correct: 1,
                        explanation: "Jake showed he was caring by helping the puppy and responsible by trying to find its owners."
                    },
                    {
                        question: "Why did Jake feel both sad and happy at the end?",
                        skill: "inference",
                        options: [
                            "He wanted to keep the puppy but knew it belonged to someone else",
                            "He didn't like the puppy",
                            "The puppy bit him",
                            "His mom made him give it back"
                        ],
                        correct: 0,
                        explanation: "We can infer Jake got attached to the puppy but understood it needed to go home to its family."
                    },
                    {
                        question: "What lesson does this story teach?",
                        skill: "theme",
                        options: [
                            "All puppies are cute",
                            "It's important to help others, even when it's hard",
                            "Never pick up strange animals",
                            "Always check for microchips"
                        ],
                        correct: 1,
                        explanation: "The main theme is about doing the right thing by helping the puppy, even though Jake had to give it up."
                    }
                ]
            }
        ],
        grade5: [
            {
                title: "The Mystery of the Missing Trophy",
                text: `The school's championship trophy had vanished from the display case overnight. Principal Martinez was baffled. The case hadn't been broken into, and only three people had keys: herself, the janitor Mr. Williams, and the coach Mr. Rodriguez. Detective Amy, a curious fifth-grader, decided to investigate. She interviewed all three people. The principal had been at a conference. Mr. Williams said he saw the trophy at 6 PM when he cleaned. Coach Rodriguez mentioned he had photos from the game that morning. Amy realized something was wrong with Coach Rodriguez's story. If he took photos in the morning, why didn't he notice the trophy was missing? She checked the timestamp on his photos—they were taken at 7 PM. Coach Rodriguez confessed he had taken the trophy home to polish it for a ceremony but was too embarrassed to admit it.`,
                questions: [
                    {
                        question: "What is the main problem in this story?",
                        skill: "mainIdea",
                        options: [
                            "Amy wants to be a detective",
                            "The championship trophy has disappeared mysteriously",
                            "The principal needs better security",
                            "Coach Rodriguez takes too many photos"
                        ],
                        correct: 1,
                        explanation: "The central problem that drives the story is the missing trophy."
                    },
                    {
                        question: "How did Amy figure out Coach Rodriguez was lying?",
                        skill: "inference",
                        options: [
                            "She found the trophy at his house",
                            "Someone told her the truth",
                            "His photo timestamps didn't match his story",
                            "He looked guilty"
                        ],
                        correct: 2,
                        explanation: "Amy used logic—if he took photos at 7 PM (after the janitor saw it at 6 PM), he should have noticed it was missing."
                    },
                    {
                        question: "Based on context, what does 'baffled' mean?",
                        skill: "vocabulary",
                        options: [
                            "Angry and upset",
                            "Confused and puzzled",
                            "Happy and relieved",
                            "Scared and worried"
                        ],
                        correct: 1,
                        explanation: "The principal was confused because she couldn't figure out how the trophy disappeared."
                    }
                ]
            }
        ],
        grade6: [
            {
                title: "The Power of Perseverance",
                text: `Elena had failed her math test three times. Each time, she felt more discouraged. Her friends told her to give up on honors math and take the regular class instead. However, Elena remembered what her grandmother always said: "Challenges are opportunities in disguise." She decided to try a different approach. Instead of just memorizing formulas, she started understanding why they worked. She formed a study group with classmates who explained concepts differently than the teacher. She watched online videos and practiced problems every single day, even on weekends. The fourth test arrived. Elena's hands trembled as she worked through the problems, but this time, the concepts clicked. When she received her test back, she saw a B+. It wasn't perfect, but it represented months of hard work and determination. More importantly, she had learned that failure isn't permanent—it's just part of the learning process.`,
                questions: [
                    {
                        question: "What is the central theme of this passage?",
                        skill: "theme",
                        options: [
                            "Math is difficult and not worth the effort",
                            "Friends always give good advice",
                            "Persistence and different strategies can lead to success",
                            "Online videos are better than teachers"
                        ],
                        correct: 2,
                        explanation: "The story demonstrates how Elena's determination and willingness to try new approaches led to success."
                    },
                    {
                        question: "How did Elena's approach to studying change?",
                        skill: "causeEffect",
                        options: [
                            "She studied more hours",
                            "She switched from memorizing to understanding concepts",
                            "She copied her friends' work",
                            "She asked the teacher for easier tests"
                        ],
                        correct: 1,
                        explanation: "The passage explicitly states she moved from memorization to understanding the 'why' behind formulas."
                    },
                    {
                        question: "What does the grandmother's saying 'Challenges are opportunities in disguise' suggest?",
                        skill: "inference",
                        options: [
                            "Difficult situations can lead to growth and learning",
                            "All problems are actually good things",
                            "You should hide from challenges",
                            "Opportunities are hard to find"
                        ],
                        correct: 0,
                        explanation: "The saying means that difficult situations, like Elena's math struggles, can teach valuable lessons."
                    }
                ]
            }
        ]
    };
    
    // Start comprehension practice
    function startComprehension() {
        console.log("Starting Reading Comprehension...");
        
        // Get current grade level from mastery tracker
        const currentGrade = window.MasteryTracker ? 
            window.MasteryTracker.getCurrentGradeLevel('comprehension') : 'grade4';
        
        // Get weak areas to focus on
        const weakAreas = window.MasteryTracker ? 
            window.MasteryTracker.getWeakAreas('comprehension') : [];
        
        // Select passage based on weak areas or randomly
        const gradePassages = passages[currentGrade] || passages.grade4;
        currentPassageIndex = Math.floor(Math.random() * gradePassages.length);
        currentPassage = gradePassages[currentPassageIndex];
        
        currentQuestionIndex = 0;
        sessionCorrect = 0;
        sessionTotal = 0;
        
        // Show passage first
        showPassage();
    }
    
    // Show the reading passage
    function showPassage() {
        const container = document.getElementById('questionContainer');
        
        const currentGrade = window.MasteryTracker ? 
            window.MasteryTracker.getCurrentGradeLevel('comprehension') : 'grade4';
        const gradeInfo = window.MasteryTracker ? 
            window.MasteryTracker.GRADE_LEVELS[currentGrade] : { name: '4th Grade' };
        
        container.innerHTML = `
            <div class="passage-container" style="max-width: 800px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #667eea; margin: 0;">📖 ${currentPassage.title}</h2>
                    <span style="background: #667eea; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9em;">
                        ${gradeInfo.name}
                    </span>
                </div>
                
                <div class="passage-text" style="background: #f8f9fa; padding: 30px; border-radius: 15px; 
                     line-height: 1.8; font-size: 1.1em; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    ${currentPassage.text}
                </div>
                
                <div style="text-align: center;">
                    <button class="btn btn-primary" onclick="PassagesModule.startQuestions()" 
                            style="font-size: 1.1em; padding: 15px 40px;">
                        Start Questions →
                    </button>
                </div>
            </div>
        `;
    }
    
    // Start showing questions
    function startQuestions() {
        sessionQuestions = currentPassage.questions;
        currentQuestionIndex = 0;
        showQuestion();
    }
    
    // Show current question
    function showQuestion() {
        if (currentQuestionIndex >= sessionQuestions.length) {
            showSessionResults();
            return;
        }
        
        const question = sessionQuestions[currentQuestionIndex];
        const container = document.getElementById('questionContainer');
        
        const skillInfo = window.MasteryTracker ? 
            window.MasteryTracker.READING_SKILLS[question.skill] : null;
        
        container.innerHTML = `
            <div class="question-view" style="max-width: 800px; margin: 0 auto;">
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <span style="color: #667eea; font-weight: bold;">
                            Question ${currentQuestionIndex + 1} of ${sessionQuestions.length}
                        </span>
                        ${skillInfo ? `<span style="background: #e8f4f8; padding: 5px 15px; border-radius: 15px; font-size: 0.85em; color: #667eea;">
                            Skill: ${skillInfo.name}
                        </span>` : ''}
                    </div>
                    
                    <div style="background: #667eea; height: 4px; border-radius: 2px; margin-bottom: 20px;">
                        <div style="background: #48bb78; height: 100%; width: ${(currentQuestionIndex / sessionQuestions.length) * 100}%; 
                             border-radius: 2px; transition: width 0.3s;"></div>
                    </div>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h3 style="color: #2d3748; margin-bottom: 25px; font-size: 1.2em;">
                        ${question.question}
                    </h3>
                    
                    <div class="answer-options" style="display: grid; gap: 15px;">
                        ${question.options.map((option, index) => `
                            <div class="answer-option" onclick="PassagesModule.selectAnswer(${index})"
                                 data-index="${index}"
                                 style="padding: 20px; border: 2px solid #e2e8f0; border-radius: 10px; 
                                        cursor: pointer; transition: all 0.2s; background: white;">
                                <span style="color: #667eea; font-weight: bold; margin-right: 10px;">
                                    ${String.fromCharCode(65 + index)}.
                                </span>
                                ${option}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div id="feedbackArea" style="margin-top: 25px;"></div>
                    
                    <div style="display: flex; gap: 15px; margin-top: 25px;">
                        <button class="btn btn-secondary" onclick="PassagesModule.showPassageAgain()"
                                style="flex: 1;">
                            📖 Re-read Passage
                        </button>
                        <button id="submitBtn" class="btn btn-primary" onclick="PassagesModule.checkAnswer()"
                                style="flex: 2;" disabled>
                            Submit Answer
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Select an answer
    function selectAnswer(index) {
        const options = document.querySelectorAll('.answer-option');
        options.forEach(opt => {
            opt.style.background = 'white';
            opt.style.borderColor = '#e2e8f0';
        });
        
        options[index].style.background = '#e8f4f8';
        options[index].style.borderColor = '#667eea';
        
        document.getElementById('submitBtn').disabled = false;
    }
    
    // Show passage again
    function showPassageAgain() {
        const container = document.getElementById('questionContainer');
        const currentQuestion = sessionQuestions[currentQuestionIndex];
        
        container.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <h3 style="color: #667eea;">📖 ${currentPassage.title}</h3>
                <div class="passage-text" style="background: #f8f9fa; padding: 30px; border-radius: 15px; 
                     line-height: 1.8; font-size: 1.1em; margin-bottom: 30px;">
                    ${currentPassage.text}
                </div>
                <button class="btn btn-primary" onclick="PassagesModule.showQuestion()">
                    Back to Question
                </button>
            </div>
        `;
    }
    
    // Check the answer
    function checkAnswer() {
        const selected = document.querySelector('.answer-option[style*="background: rgb(232, 244, 248)"]');
        if (!selected) {
            alert("Please select an answer!");
            return;
        }
        
        const selectedIndex = parseInt(selected.dataset.index);
        const question = sessionQuestions[currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        // Update stats
        sessionTotal++;
        if (isCorrect) {
            sessionCorrect++;
        }
        
        // Track with mastery tracker
        if (window.MasteryTracker) {
            window.MasteryTracker.trackSkillResult('comprehension', question.skill, isCorrect);
        }
        
        // Update global progress
        window.updateProgress(isCorrect);
        
        // Show feedback
        showFeedback(isCorrect, question);
    }
    
    // Show feedback
    function showFeedback(isCorrect, question) {
        const feedbackArea = document.getElementById('feedbackArea');
        const submitBtn = document.getElementById('submitBtn');
        
        submitBtn.disabled = true;
        
        // Disable all options
        const options = document.querySelectorAll('.answer-option');
        options.forEach(opt => opt.style.pointerEvents = 'none');
        
        if (isCorrect) {
            feedbackArea.innerHTML = `
                <div style="background: #d1fae5; border: 2px solid #10b981; border-radius: 10px; padding: 20px;">
                    <div style="color: #065f46; font-size: 1.3em; font-weight: bold; margin-bottom: 10px;">
                        ✓ Correct! Great job! 🎉
                    </div>
                    <div style="color: #065f46;">
                        ${question.explanation}
                    </div>
                    <button class="btn btn-primary" onclick="PassagesModule.nextQuestion()" 
                            style="margin-top: 15px; width: 100%;">
                        Next Question →
                    </button>
                </div>
            `;
        } else {
            feedbackArea.innerHTML = `
                <div style="background: #fee; border: 2px solid #ef4444; border-radius: 10px; padding: 20px;">
                    <div style="color: #991b1b; font-size: 1.3em; font-weight: bold; margin-bottom: 10px;">
                        Not quite right. Let's learn from this! 📚
                    </div>
                    <div style="color: #991b1b; margin-bottom: 10px;">
                        <strong>The correct answer is:</strong> ${question.options[question.correct]}
                    </div>
                    <div style="color: #991b1b;">
                        <strong>Explanation:</strong> ${question.explanation}
                    </div>
                    <button class="btn btn-primary" onclick="PassagesModule.nextQuestion()" 
                            style="margin-top: 15px; width: 100%;">
                        Next Question →
                    </button>
                </div>
            `;
        }
    }
    
    // Next question
    function nextQuestion() {
        currentQuestionIndex++;
        showQuestion();
    }
    
    // Show session results
    function showSessionResults() {
        const container = document.getElementById('questionContainer');
        const accuracy = Math.round((sessionCorrect / sessionTotal) * 100);
        
        // Check for grade advancement
        let advancementMessage = '';
        if (window.MasteryTracker) {
            const advancement = window.MasteryTracker.checkGradeAdvancement('comprehension');
            if (advancement.advanced) {
                advancementMessage = `
                    <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); 
                         color: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; 
                         box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);">
                        <h2 style="margin: 0 0 10px 0; font-size: 1.8em;">🎉 ${advancement.message}</h2>
                    </div>
                `;
                // Save the advancement
                window.saveUserData();
            } else if (advancement.complete) {
                advancementMessage = `
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                         color: white; padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                        <h2 style="margin: 0 0 10px 0; font-size: 1.8em;">${advancement.message}</h2>
                        <p style="margin: 0; font-size: 1.1em;">You've achieved the 6th grade reading level!</p>
                    </div>
                `;
            }
        }
        
        container.innerHTML = `
            <div style="max-width: 700px; margin: 0 auto; text-align: center;">
                ${advancementMessage}
                
                <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    <h2 style="color: #667eea; margin-bottom: 30px;">📊 Session Complete!</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
                        <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                            <div style="font-size: 3em; color: #667eea; font-weight: bold;">
                                ${sessionCorrect}/${sessionTotal}
                            </div>
                            <div style="color: #666; margin-top: 10px;">Questions Correct</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 25px; border-radius: 15px;">
                            <div style="font-size: 3em; color: ${accuracy >= 70 ? '#10b981' : '#ef4444'}; font-weight: bold;">
                                ${accuracy}%
                            </div>
                            <div style="color: #666; margin-top: 10px;">Accuracy</div>
                        </div>
                    </div>
                    
                    ${accuracy >= 80 ? `
                        <div style="background: #d1fae5; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                            <div style="font-size: 1.5em; margin-bottom: 10px;">🏆</div>
                            <div style="color: #065f46; font-weight: bold;">Excellent work! Keep it up!</div>
                        </div>
                    ` : accuracy >= 60 ? `
                        <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                            <div style="font-size: 1.5em; margin-bottom: 10px;">⚽</div>
                            <div style="color: #92400e; font-weight: bold;">Good effort! Practice makes perfect!</div>
                        </div>
                    ` : `
                        <div style="background: #fee; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                            <div style="font-size: 1.5em; margin-bottom: 10px;">💪</div>
                            <div style="color: #991b1b; font-weight: bold;">Keep practicing! You're learning!</div>
                        </div>
                    `}
                    
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <button class="btn btn-primary" onclick="PassagesModule.startComprehension()"
                                style="width: 100%; font-size: 1.1em; padding: 15px;">
                            📖 Practice More Reading
                        </button>
                        
                        ${window.MasteryTracker ? `
                            <button class="btn btn-secondary" onclick="MasteryTracker.showMasteryProgress('comprehension')"
                                    style="width: 100%; padding: 15px;">
                                📊 View Skill Progress
                            </button>
                        ` : ''}
                        
                        <button class="btn btn-secondary" onclick="backToTopics()"
                                style="width: 100%; padding: 15px;">
                            ← Back to Topics
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Public API
    return {
        startComprehension: startComprehension,
        startQuestions: startQuestions,
        showQuestion: showQuestion,
        selectAnswer: selectAnswer,
        showPassageAgain: showPassageAgain,
        checkAnswer: checkAnswer,
        nextQuestion: nextQuestion
    };
})();
