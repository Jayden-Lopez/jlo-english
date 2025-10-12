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
    
    // Adaptive passage selection based on weak skills
    function selectAdaptivePassage(gradeLevel, weakAreas) {
        let allPassages = passages[gradeLevel] || passages.grade4;
        
        // If there are weak areas, try to find passages that target those skills
        if (weakAreas && weakAreas.length > 0) {
            const targetSkills = weakAreas.slice(0, 2).map(area => area.skill);
            
            // Find passages with questions targeting weak skills
            const targetedPassages = allPassages.filter(passage => 
                passage.questions.some(q => targetSkills.includes(q.skill))
            );
            
            if (targetedPassages.length > 0) {
                return targetedPassages[Math.floor(Math.random() * targetedPassages.length)];
            }
        }
        
        // Otherwise, return random passage
        return allPassages[Math.floor(Math.random() * allPassages.length)];
    }
    
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
            },
            {
                title: "The Community Garden",
                text: `Mrs. Chen's class started a community garden in an empty lot near their school. Each student chose a vegetable to plant. Marcus picked tomatoes, while Sarah chose carrots. They learned that plants need sunlight, water, and good soil to grow. Every day after school, students took turns watering the garden. Some pulled weeds, and others checked for insects. After two months, the garden was full of colorful vegetables. The class harvested the food and donated it to a local food bank. Everyone felt proud knowing they helped feed families in their neighborhood.`,
                questions: [
                    {
                        question: "What is the main purpose of the class garden project?",
                        skill: "mainIdea",
                        options: [
                            "To learn about different vegetables",
                            "To create something beautiful",
                            "To grow food and help the community",
                            "To get students outside more"
                        ],
                        correct: 2,
                        explanation: "The passage emphasizes both learning and helping the community by donating to the food bank."
                    },
                    {
                        question: "What happened as a result of students caring for the garden daily?",
                        skill: "causeEffect",
                        options: [
                            "The garden became full of weeds",
                            "The vegetables grew successfully",
                            "The students got tired of gardening",
                            "The school closed the lot"
                        ],
                        correct: 1,
                        explanation: "Because students watered, weeded, and cared for it daily, the garden produced vegetables."
                    },
                    {
                        question: "In the passage, what does 'harvested' mean?",
                        skill: "vocabulary",
                        options: [
                            "Planted the seeds",
                            "Watered the plants",
                            "Gathered the grown vegetables",
                            "Sold at a market"
                        ],
                        correct: 2,
                        explanation: "Context shows harvesting happened after the vegetables grew, meaning gathering them."
                    }
                ]
            },
            {
                title: "The Thunderstorm Adventure",
                text: `Jake and his dad were hiking when dark clouds suddenly filled the sky. Thunder rumbled in the distance. "We need to get to the car quickly," Dad said. They started walking faster down the trail. Rain began to fall, lightly at first, then harder. Lightning flashed across the sky. Jake felt scared, but Dad stayed calm and led the way. They found a small shelter made of rock and waited inside until the storm passed. Thirty minutes later, the sun came out. A beautiful rainbow appeared in the sky. "See, Jake," Dad said with a smile, "after every storm comes something beautiful." Jake learned that staying calm and being prepared helps you handle difficult situations.`,
                questions: [
                    {
                        question: "What happened first in the story?",
                        skill: "sequence",
                        options: [
                            "It started raining",
                            "Dark clouds appeared",
                            "They found shelter",
                            "A rainbow appeared"
                        ],
                        correct: 1,
                        explanation: "The passage clearly states dark clouds appeared first, before anything else."
                    },
                    {
                        question: "How did Jake's dad help him during the storm?",
                        skill: "characterAnalysis",
                        options: [
                            "He complained about the weather",
                            "He stayed calm and found shelter",
                            "He got scared too",
                            "He blamed Jake for the storm"
                        ],
                        correct: 1,
                        explanation: "The passage shows Dad remained calm and took action to keep them safe."
                    },
                    {
                        question: "What lesson does the story teach?",
                        skill: "theme",
                        options: [
                            "Never go hiking",
                            "Storms are dangerous and scary",
                            "Staying calm helps you handle challenges",
                            "Always bring an umbrella"
                        ],
                        correct: 2,
                        explanation: "The story's message is about staying calm during difficult times, as shown by Dad's actions."
                    }
                ]
            },
            {
                title: "The Library Mystery",
                text: `Every Monday, books mysteriously appeared on students' desks at Lincoln Elementary. No one knew who was leaving them. The books were always perfect matches for each student. Emma, who loved animals, found a book about dolphins. Kevin, who enjoyed building things, discovered a book about famous architects. The librarian, Ms. Rodriguez, always smiled when students asked about the mystery books. One day, Maya arrived early and saw Ms. Rodriguez placing books on desks. "You've been the mystery book fairy!" Maya exclaimed. Ms. Rodriguez winked. "I love matching students with books they'll enjoy. Reading should be an adventure." Maya promised to keep the secret and help spread the love of reading.`,
                questions: [
                    {
                        question: "Why did Ms. Rodriguez leave books for students?",
                        skill: "inference",
                        options: [
                            "She had too many books",
                            "She wanted to encourage reading by matching books to interests",
                            "The school required it",
                            "She was cleaning out the library"
                        ],
                        correct: 1,
                        explanation: "Her comment about matching students with books they'll enjoy shows her motivation."
                    },
                    {
                        question: "What can you tell about Ms. Rodriguez's personality?",
                        skill: "characterAnalysis",
                        options: [
                            "She is thoughtful and cares about students",
                            "She is mysterious and secretive",
                            "She is strict and serious",
                            "She is forgetful and disorganized"
                        ],
                        correct: 0,
                        explanation: "She carefully selected books for each student, showing she pays attention and cares."
                    },
                    {
                        question: "What is the main idea of this passage?",
                        skill: "mainIdea",
                        options: [
                            "Libraries have many books",
                            "A caring librarian finds creative ways to inspire reading",
                            "Students should arrive at school early",
                            "Mysteries are exciting"
                        ],
                        correct: 1,
                        explanation: "The story focuses on Ms. Rodriguez's thoughtful way of encouraging students to read."
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
            },
            {
                title: "The Robotics Competition",
                text: `The Johnson Middle School robotics team had worked for three months on their robot, "Lightning." The regional competition was tomorrow, and everything seemed ready. During final testing, disaster struck. Lightning's main motor burned out. "We can't compete without it," said team captain Alex. The hardware store had closed for the day, and online ordering would take too long. Then Maya remembered her older brother's robotics kit in their garage. She called home, and within an hour, her brother arrived with a compatible motor. The team worked until midnight installing and testing it. The next day, Lightning not only competed but won second place. The team learned that resourcefulness and teamwork matter more than having perfect equipment.`,
                questions: [
                    {
                        question: "What is the central conflict in this story?",
                        skill: "mainIdea",
                        options: [
                            "The team doesn't work well together",
                            "A critical robot part breaks right before competition",
                            "The competition is too difficult",
                            "Alex doesn't want to be team captain"
                        ],
                        correct: 1,
                        explanation: "The main problem that drives the story is the motor burning out before the competition."
                    },
                    {
                        question: "How did the team solve their problem?",
                        skill: "causeEffect",
                        options: [
                            "They bought a new motor online",
                            "They borrowed a motor from another team",
                            "Maya remembered her brother had a compatible motor",
                            "They competed without the motor"
                        ],
                        correct: 2,
                        explanation: "Maya's quick thinking about her brother's robotics kit provided the solution."
                    },
                    {
                        question: "Based on the story, what does 'resourcefulness' mean?",
                        skill: "vocabulary",
                        options: [
                            "Having a lot of money to buy things",
                            "Being able to find creative solutions to problems",
                            "Working very hard on something",
                            "Following instructions carefully"
                        ],
                        correct: 1,
                        explanation: "The team showed resourcefulness by finding a creative solution (the brother's motor) instead of giving up."
                    }
                ]
            },
            {
                title: "The Coral Reef Crisis",
                text: `Dr. Martinez, a marine biologist, had been studying the same coral reef for fifteen years. Recently, she noticed something alarming. The vibrant colors of the coral were fading to white, a process called coral bleaching. She explained to her research team that warming ocean temperatures were stressing the coral, causing them to expel the algae that gave them color and food. "If this continues," she said, "the entire reef ecosystem could collapse." The reef was home to thousands of fish species and other marine life. Dr. Martinez and her team began documenting the changes and sharing their findings with scientists worldwide. They also worked with local communities to reduce pollution and protect the remaining healthy coral. While they couldn't control ocean temperatures alone, they knew every small action mattered.`,
                questions: [
                    {
                        question: "What is causing the coral bleaching?",
                        skill: "causeEffect",
                        options: [
                            "Too many tourists visiting the reef",
                            "Pollution from local communities",
                            "Warming ocean temperatures stressing the coral",
                            "Overfishing in the area"
                        ],
                        correct: 2,
                        explanation: "The passage explicitly states that warming ocean temperatures cause coral to expel their algae."
                    },
                    {
                        question: "Why is the coral reef crisis important?",
                        skill: "inference",
                        options: [
                            "Thousands of species depend on the reef for survival",
                            "Coral is valuable and can be sold",
                            "It makes the ocean look pretty",
                            "Dr. Martinez needs it for her job"
                        ],
                        correct: 0,
                        explanation: "The passage mentions the reef is home to thousands of species, making its health critical."
                    },
                    {
                        question: "What theme does this passage convey?",
                        skill: "theme",
                        options: [
                            "Science is difficult and complicated",
                            "Individual actions can contribute to solving big problems",
                            "Ocean life is dangerous",
                            "Only scientists can help the environment"
                        ],
                        correct: 1,
                        explanation: "The ending emphasizes that every small action matters, showing individual contribution is important."
                    }
                ]
            },
            {
                title: "The Time Capsule Discovery",
                text: `During renovations at Washington Elementary, construction workers discovered a metal box buried beneath the old playground. The principal called the oldest retired teacher, Mr. Henderson, who had taught at the school for forty years. When they opened the time capsule, they found letters, photographs, and drawings from students in 1975. One letter caught everyone's attention. It was written by a girl named Rosa Martinez, who described her dream of becoming a doctor to help people in her community. Mr. Henderson gasped. "Rosa Martinez is now Dr. Martinez, the director of County General Hospital," he said. "She achieved her dream!" The school decided to create a new time capsule, and every student wrote about their dreams for the future. The discovery reminded everyone that dreams written down and worked toward can come true.`,
                questions: [
                    {
                        question: "What can we infer about Rosa Martinez from the story?",
                        skill: "inference",
                        options: [
                            "She forgot about her childhood dream",
                            "She stayed determined and achieved her goal",
                            "She had an easy path to success",
                            "She became a teacher instead"
                        ],
                        correct: 1,
                        explanation: "The fact that she achieved the exact dream she wrote about shows her determination and persistence."
                    },
                    {
                        question: "What is the main message of this story?",
                        skill: "theme",
                        options: [
                            "Old schools should be renovated",
                            "Time capsules are interesting to find",
                            "Dreams and goals are worth pursuing",
                            "Doctors are important in communities"
                        ],
                        correct: 2,
                        explanation: "The story emphasizes how Rosa's written dream came true, inspiring current students to dream big."
                    },
                    {
                        question: "What happened as a result of finding the time capsule?",
                        skill: "causeEffect",
                        options: [
                            "The school was renamed",
                            "Students created a new time capsule and wrote their dreams",
                            "Mr. Henderson retired",
                            "Dr. Martinez returned to teach"
                        ],
                        correct: 1,
                        explanation: "The discovery inspired the school to create a new time capsule with student dreams."
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
            },
            {
                title: "The Ethics of Artificial Intelligence",
                text: `As artificial intelligence becomes more advanced, society faces complex ethical questions. When a self-driving car encounters an unavoidable accident, how should it be programmed to respond? Should it prioritize the safety of passengers or pedestrians? Tech companies developing AI argue that these decisions should be made by programmers based on logical algorithms. However, philosophers and ethicists point out that these are moral questions that reflect our values as a society. Some countries are developing regulatory frameworks to govern AI decision-making, while others believe innovation should not be restricted. Dr. Sarah Chen, an AI researcher, explains, "We're not just creating technology; we're embedding our values into machines that will affect millions of lives. Every line of code is a moral choice." As AI continues to evolve, these discussions become increasingly urgent. The decisions made today will shape the relationship between humans and intelligent machines for generations to come.`,
                questions: [
                    {
                        question: "What is the central ethical dilemma discussed in the passage?",
                        skill: "mainIdea",
                        options: [
                            "Whether AI should exist at all",
                            "How AI should make moral decisions that affect human lives",
                            "Who should own AI technology",
                            "Whether self-driving cars are safe"
                        ],
                        correct: 1,
                        explanation: "The passage focuses on the ethical questions of how AI should be programmed to make moral decisions."
                    },
                    {
                        question: "What does Dr. Chen's quote suggest about AI development?",
                        skill: "inference",
                        options: [
                            "AI development is purely technical with no moral implications",
                            "Programmers are embedding human values and ethics into AI systems",
                            "AI development should be stopped",
                            "Only philosophers should create AI"
                        ],
                        correct: 1,
                        explanation: "She states that every line of code is a moral choice, meaning values are being built into AI."
                    },
                    {
                        question: "Why do different groups disagree about AI regulation?",
                        skill: "causeEffect",
                        options: [
                            "They have different priorities: innovation freedom vs. ethical oversight",
                            "They don't understand how AI works",
                            "Some want to make money from AI",
                            "They are from different countries"
                        ],
                        correct: 0,
                        explanation: "The passage shows tension between those wanting innovation freedom and those wanting ethical frameworks."
                    }
                ]
            },
            {
                title: "The Hidden Cost of Fast Fashion",
                text: `Every year, Americans discard over 85 pounds of clothing per person. This waste is largely driven by "fast fashion"—cheap, trendy clothes designed to be worn briefly and then replaced. Behind the low prices lies a complex web of environmental and human costs. The fashion industry is the second-largest polluter globally, with textile production consuming vast amounts of water and releasing harmful chemicals. A single cotton t-shirt requires 2,700 liters of water to produce, enough for one person to drink for two and a half years. Additionally, many fast fashion garments are made in developing countries where workers face unsafe conditions and receive wages below the poverty line. Some consumers are choosing "slow fashion"—buying fewer, higher-quality items made sustainably and ethically. Teenage activist Zara Williams started a clothing swap program at her school, preventing hundreds of items from ending up in landfills. "We can look good and do good at the same time," she explains. "Every purchasing decision is a vote for the kind of world we want to live in."`,
                questions: [
                    {
                        question: "What is the author's main purpose in this passage?",
                        skill: "theme",
                        options: [
                            "To convince readers to stop buying clothes",
                            "To inform readers about fashion industry problems and alternatives",
                            "To criticize people who like fashion",
                            "To promote Zara Williams's program"
                        ],
                        correct: 1,
                        explanation: "The passage educates about fast fashion issues while offering alternatives like slow fashion and swaps."
                    },
                    {
                        question: "How does the author support the claim that fast fashion is harmful?",
                        skill: "inference",
                        options: [
                            "By sharing personal opinions",
                            "By providing specific statistics and examples",
                            "By quoting fashion designers",
                            "By describing trendy clothes"
                        ],
                        correct: 1,
                        explanation: "The passage uses specific data (85 pounds waste, 2,700 liters water) to support the argument."
                    },
                    {
                        question: "What does Zara Williams mean by 'every purchasing decision is a vote'?",
                        skill: "vocabulary",
                        options: [
                            "Shopping is like political voting",
                            "Our buying choices support certain practices and industries",
                            "We should vote before shopping",
                            "Purchases require government approval"
                        ],
                        correct: 1,
                        explanation: "She's using 'vote' metaphorically—our purchases support the companies and practices we buy from."
                    }
                ]
            },
            {
                title: "The Memory Palace Technique",
                text: `In ancient Greece, orators amazed audiences by delivering hours-long speeches from memory without notes. Their secret was the "memory palace" technique, also called the method of loci. This mnemonic strategy involves visualizing a familiar place—like your home—and mentally placing pieces of information in different locations throughout it. When you need to recall the information, you mentally "walk" through your palace, encountering each piece in order. Modern neuroscience has confirmed what ancient Greeks discovered: spatial memory is more powerful than rote memorization. Our brains evolved to remember locations for survival, making this technique highly effective. Eight-time World Memory Champion Dominic O'Brien used memory palaces to memorize the order of 54 shuffled decks of cards. While most of us won't attempt such feats, the technique has practical applications. Students use it to remember historical dates, scientific terms, or foreign language vocabulary. The key is creating vivid, unusual mental images and placing them in a logical sequence through your familiar space. What makes this method remarkable is that it transforms abstract information into concrete, spatial experiences, playing to our brain's natural strengths.`,
                questions: [
                    {
                        question: "According to the passage, why does the memory palace technique work so well?",
                        skill: "causeEffect",
                        options: [
                            "It requires less practice than other methods",
                            "It uses spatial memory, which our brains naturally excel at",
                            "It was invented by ancient Greeks",
                            "It involves walking around"
                        ],
                        correct: 1,
                        explanation: "The passage explains that our brains evolved strong spatial memory for survival, making this technique effective."
                    },
                    {
                        question: "What can we infer about the relationship between ancient techniques and modern science?",
                        skill: "inference",
                        options: [
                            "Ancient methods were less effective than modern ones",
                            "Modern science has disproven ancient techniques",
                            "Ancient observations about memory align with current neuroscience",
                            "Greeks knew more about brains than modern scientists"
                        ],
                        correct: 2,
                        explanation: "The passage states neuroscience 'confirmed' what Greeks discovered, showing alignment between old and new knowledge."
                    },
                    {
                        question: "What is the main idea of this passage?",
                        skill: "mainIdea",
                        options: [
                            "Ancient Greeks were amazing speakers",
                            "The memory palace technique is an effective method based on spatial memory",
                            "Students should memorize more information",
                            "Dominic O'Brien is a memory champion"
                        ],
                        correct: 1,
                        explanation: "The passage explains what the memory palace is, why it works, and how it can be used."
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
        
        // Use adaptive selection to choose passage targeting weak skills
        currentPassage = selectAdaptivePassage(currentGrade, weakAreas);
        
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
