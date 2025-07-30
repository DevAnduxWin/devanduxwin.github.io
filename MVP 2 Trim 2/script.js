const gameState = {
    welcomeMessage: `
        <p>Welcome, Oh... Who are you to pass through these lands?</p>
        <p>No matter... Choose your path carefully if you don't want to become food for me...</p>
    `,
    currentPath: 0,
    currentSubPath: 0,
    paths: {
        1: {
            name: "Pre-Hispanic Societies to Car",
            description: "Well, you chose the ancient path, now is time to test you...",
            subPaths: {
                1: {
                    question: "What materials did they use to create their tools?",
                    options: [
                        { text: "a. Stone, Bone and Wood", value: "a", correct: true },
                        { text: "b. Iron, Copper and Diamond", value: "b" }
                    ],
                    correctResponse: "✅ You are wise...",
                    incorrectResponse: "❌ The ancient souls say that isn't the correct path."
                },
                2: {
                    question: "Who developed the first commercial car? (Hint: Did you hear of a >Ford< car?)",
                    type: "text",
                    answer: "henry ford",
                    correctResponse: "✅ Well, you chose correctly.",
                    incorrectResponse: "❌ {answer} is not the name whispered by him."
                }
            }
        },
        2: {
            name: "Internet to iPhone",
            description: "You have chosen the Digital rise path...",
            subPaths: {
                1: {
                    question: "What protocol gave birth to the internet?",
                    options: [
                        { text: "a. TCP/IP", value: "a", correct: true },
                        { text: "b. P2P", value: "b" }
                    ],
                    correctResponse: "✅ You have unlocked the code of communication.",
                    incorrectResponse: "❌ Incorrect... The net isn't governed by P2P."
                },
                2: {
                    question: "📡 What company created the first commercial phone?",
                    type: "text",
                    answer: "motorola",
                    correctResponse: "✅ Correct...",
                    incorrectResponse: "❌ {answer}? That's not the one inscribed in the scrolls."
                },
                3: {
                    question: "📱 What was the iPhone's game-changing feature?",
                    options: [
                        { text: "a. Take photos", value: "a" },
                        { text: "b. Touch screen", value: "b", correct: true }
                    ],
                    correctResponse: "✅ Correct!",
                    incorrectResponse: "❌ Try again..."
                }
            }
        },
        3: {
            name: "Android to AI",
            description: "You have entered the latest path: *Modern path* timeline...",
            subPaths: {
                1: {
                    question: "🤖 What was the first Android phone?",
                    options: [
                        { text: "a. HTC Dream", value: "a", correct: true },
                        { text: "b. Google Nexus", value: "b" }
                    ],
                    correctResponse: "✅ Well done!",
                    incorrectResponse: "❌ Incorrect."
                },
                2: {
                    question: "What was before 4G?",
                    options: [
                        { text: "a. 3G", value: "a", correct: true },
                        { text: "b. 2G", value: "b" }
                    ],
                    correctResponse: "✅ Correct!",
                    incorrectResponse: "❌ Not fast enough..."
                },
                3: {
                    question: "🧠 What is the most famous AI today?",
                    options: [
                        { text: "a. ChatGPT", value: "a", correct: true },
                        { text: "b. Gemini", value: "b" }
                    ],
                    correctResponse: "✅ You've met the mind that guides this test...",
                    incorrectResponse: "❌ Perhaps in another timeline..."
                }
            }
        }
    }
};

const elements = {
    output: document.getElementById('output'),
    mainMenu: document.getElementById('mainMenu'),
    subMenu: document.getElementById('subMenu'),
    questionContainer: document.getElementById('questionContainer'),
    result: document.getElementById('result')
};

function init() {
    elements.output.innerHTML = gameState.welcomeMessage;
    
    document.querySelectorAll('#mainMenu button').forEach(button => {
        button.addEventListener('click', () => {
            selectOption(parseInt(button.dataset.option));
        });
    });
}

function selectOption(option) {
    gameState.currentPath = option;
    
    if (option === 4) {
        endGame();
        return;
    }

    clearUI();
    
    const path = gameState.paths[option];
    elements.output.innerHTML = `<p class="fade-in">${path.description}</p>`;
    
    let subMenuHTML = '<p>Which quest do you want to solve?</p>';
    Object.entries(path.subPaths).forEach(([key, subPath]) => {
        subMenuHTML += `<button data-suboption="${key}">${key}. ${subPath.question.split('?')[0]}?</button>`;
    });

    elements.subMenu.innerHTML = subMenuHTML;
    elements.subMenu.classList.remove('hidden');
    elements.mainMenu.classList.add('hidden');
    
    document.querySelectorAll('#subMenu button').forEach(button => {
        button.addEventListener('click', () => {
            selectSubOption(parseInt(button.dataset.suboption));
        });
    });
}

function selectSubOption(subOption) {
    gameState.currentSubPath = subOption;
    clearUI();
    
    const path = gameState.paths[gameState.currentPath];
    const subPath = path.subPaths[subOption];
    
    let questionHTML = `<div class="question fade-in">${subPath.question}</div>`;
    
    if (subPath.options) {
        subPath.options.forEach(option => {
            questionHTML += `<button data-answer="${option.value}">${option.text}</button>`;
        });
    } else if (subPath.type === "text") {
        questionHTML += `
            <div class="text-answer">
                <input type="text" id="textAnswer" placeholder="Your answer">
                <button id="submitTextAnswer">Submit</button>
            </div>
        `;
    }

    elements.questionContainer.innerHTML = questionHTML;
    elements.questionContainer.classList.remove('hidden');
    elements.subMenu.classList.add('hidden');
    
    if (subPath.options) {
        document.querySelectorAll('#questionContainer button').forEach(button => {
            button.addEventListener('click', () => {
                checkAnswer(button.dataset.answer);
            });
        });
    } else {
        document.getElementById('submitTextAnswer').addEventListener('click', checkTextAnswer);
    }
}

function checkAnswer(answer) {
    const path = gameState.paths[gameState.currentPath];
    const subPath = path.subPaths[gameState.currentSubPath];
    const correctOption = subPath.options.find(opt => opt.correct);
    
    const isCorrect = answer === correctOption.value;
    const message = isCorrect ? subPath.correctResponse : subPath.incorrectResponse;
    
    showResult(message, isCorrect);
}

function checkTextAnswer() {
    const answer = document.getElementById('textAnswer').value.toLowerCase();
    const path = gameState.paths[gameState.currentPath];
    const subPath = path.subPaths[gameState.currentSubPath];
    
    const isCorrect = answer === subPath.answer;
    let message = isCorrect ? 
        subPath.correctResponse : 
        subPath.incorrectResponse.replace('{answer}', answer);
    
    showResult(message, isCorrect);
}

function showResult(message, isCorrect) {
    elements.result.innerHTML = `<p class="fade-in">${message}</p>`;
    elements.result.className = isCorrect ? 'result correct' : 'result incorrect';
    
    setTimeout(() => {
        elements.result.innerHTML += '<button id="returnToMain">Return to Main Menu</button>';
        document.getElementById('returnToMain').addEventListener('click', returnToMainMenu);
    }, 500);
}

function returnToMainMenu() {
    clearUI();
    elements.output.innerHTML = gameState.welcomeMessage;
    elements.mainMenu.classList.remove('hidden');
}

function endGame() {
    clearUI();
    elements.output.innerHTML = '<p class="fade-in">Farewell, traveler... Until we meet again...</p>';
    elements.result.innerHTML = `
        <p class="fade-in">The secret code of one box is: a336903*2gcx!¿?</p>
        <p class="fade-in">May your journey be filled with wisdom...</p>
    `;
    elements.result.classList.add('fade-in');
}

function clearUI() {
    elements.subMenu.innerHTML = '';
    elements.questionContainer.innerHTML = '';
    elements.result.innerHTML = '';
    elements.result.className = 'result';
    elements.subMenu.classList.add('hidden');
    elements.questionContainer.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', init);