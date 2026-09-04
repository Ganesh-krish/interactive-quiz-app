const questions = [
    {
        question: "What does DOM stand for?",
        options: [
            "Document Object Model",
            "Data Object Model",
            "Document Oriented Model",
            "Digital Object Model"
        ],
        answer: "Document Object Model"
    },

    {
        question: "Which keyword is used to declare a constant in JavaScript?",
        options: [
            "var",
            "let",
            "const",
            "static"
        ],
        answer: "const"
    },

    {
        question: "Which method is used to select an element by its ID?",
        options: [
            "document.querySelector()",
            "document.getElementById()",
            "document.getElement()",
            "document.selectById()"
        ],
        answer: "document.getElementById()"
    },

    {
        question: "Which method adds an event handler to an element?",
        options: [
            "addEventListener()",
            "addEvent()",
            "attachEventHandler()",
            "onEvent()"
        ],
        answer: "addEventListener()"
    },

    {
        question: "Which browser storage API can store data as key-value pairs?",
        options: [
            "sessionAPI",
            "browserStorage",
            "localStorage",
            "cookieStorage"
        ],
        answer: "localStorage"
    }
];


// DOM Elements

const questionElement =
    document.querySelector("#question");

const questionNumberElement =
    document.querySelector("#question-number");

const optionsElement =
    document.querySelectorAll(".option");

const nextButton =
    document.querySelector("#next-btn");

const previousButton =
    document.querySelector("#previous-btn");

const scoreElement =
    document.querySelector("#score");

const timerElement =
    document.querySelector("#timer");

const resultContainer =
    document.querySelector("#result-container");

const finalScoreElement =
    document.querySelector("#final-score");

const restartButton =
    document.querySelector("#restart-btn");

const quizCard =
    document.querySelector(".quiz-card");


// Application state

let currentQuestion = 0;
let score = 0;
let answered = false;
let userAnswers = [];
let timeLeft = 15;

let timer = null;
let timerEndTime = null;

// Calculate Score

function calculateScore() {

    score = 0;

    userAnswers.forEach((userAnswer, index) => {

        if (
            userAnswer === undefined ||
            userAnswer === null
        ) {
            return;
        }

        if (
            userAnswer === questions[index].answer
        ) {
            score++;
        } else {
            score--;
        }

    });

    scoreElement.textContent =
        `Score: ${score}`;
}


// Save Answers

function saveAnswers() {

    localStorage.setItem(
        "quizAnswers",
        JSON.stringify(userAnswers)
    );
}


// Load Answers

function loadAnswers() {

    const savedAnswers =
        localStorage.getItem("quizAnswers");

    if (savedAnswers !== null) {

        userAnswers =
            JSON.parse(savedAnswers);

    }
}


// Save Current Question

function saveCurrentQuestion() {

    localStorage.setItem(
        "currentQuestion",
        currentQuestion
    );
}


// Load Current Question

function loadCurrentQuestion() {

    const savedQuestion =
        localStorage.getItem("currentQuestion");

    if (savedQuestion !== null) {

        currentQuestion =
            Number(savedQuestion);

    }
}


// Save Timer End Time

function saveTimerEndTime() {

    timerEndTime =
        Date.now() + (15 * 1000);

    localStorage.setItem(
        "timerEndTime",
        timerEndTime
    );
}


// Load Timer End Time

function loadTimerEndTime() {

    const savedTimerEndTime =
        localStorage.getItem("timerEndTime");

    if (savedTimerEndTime !== null) {

        timerEndTime =
            JSON.parse(savedTimerEndTime);

    }
}


// Clear Timer End Time

function clearTimerEndTime() {

    timerEndTime = null;

    localStorage.removeItem(
        "timerEndTime"
    );
}


// Clear Saved Quiz

function clearSavedQuiz() {

    localStorage.removeItem(
        "quizAnswers"
    );

    localStorage.removeItem(
        "currentQuestion"
    );

    clearTimerEndTime();
}


// Handle Time Up

function handleTimeUp() {

    console.log("Time's up!");

    clearTimerEndTime();

    answered = true;

    userAnswers[currentQuestion] = null;

    saveAnswers();

    optionsElement.forEach((option) => {

        option.disabled = true;

    });


    setTimeout(function () {

        if (
            currentQuestion <
            questions.length - 1
        ) {

            currentQuestion++;

            saveCurrentQuestion();

            displayQuestion();

        } else {

            showResult();

        }

    }, 1000);

}


// Start Timer

function startTimer() {

    clearInterval(timer);


    // If there is no saved timer,
    // create a new 15-second timer

    if (timerEndTime === null) {

        saveTimerEndTime();

    }


    // Calculate remaining time

    timeLeft = Math.ceil(
        (timerEndTime - Date.now()) / 1000
    );


    // If saved timer already expired

    if (timeLeft <= 0) {

        handleTimeUp();

        return;

    }


    timerElement.textContent =
        `${timeLeft}s`;


    timer = setInterval(function () {

        timeLeft--;

        timerElement.textContent =
            `${timeLeft}s`;

        if (timeLeft <= 5) {
            timerElement.classList.add("warning");
        }
        if (timeLeft <= 0) {

            clearInterval(timer);

            console.log("Time's up!");

            handleTimeUp();

        }

    }, 1000);

}


// Display Question

function displayQuestion() {

    answered =
        userAnswers[currentQuestion] !== undefined;


    questionElement.textContent =
        questions[currentQuestion].question;


    questionNumberElement.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    optionsElement.forEach((option, index) => {

        option.textContent =
            questions[currentQuestion].options[index];


        // Reset old classes

        option.classList.remove(
            "selected",
            "correct",
            "wrong"
        );


        // Enable buttons by default

        option.disabled = false;


        // If question was already answered

        if (answered) {

            option.disabled = true;


            // Show correct answer

            if (
                option.textContent ===
                questions[currentQuestion].answer
            ) {

                option.classList.add(
                    "correct"
                );

            }


            // Show user's wrong answer

            if (
                option.textContent ===
                userAnswers[currentQuestion] &&
                option.textContent !==
                questions[currentQuestion].answer
            ) {

                option.classList.add(
                    "wrong"
                );

            }

        }

    });


    // Update score

    scoreElement.textContent =
        `Score: ${score}`;


    // Start timer only for unanswered question

    if (!answered) {

        startTimer();

    } else {

        clearInterval(timer);

    }

}


// Load saved data

loadAnswers();

loadCurrentQuestion();

loadTimerEndTime();

calculateScore();

displayQuestion();


// Next Button

nextButton.addEventListener(
    "click",
    function () {

        if (
            currentQuestion <
            questions.length - 1
        ) {

            // Current question is being left

            clearInterval(timer);

            clearTimerEndTime();

            timerElement.classList.remove("warning");

            currentQuestion++;

            saveCurrentQuestion();

            displayQuestion();

        } else {

            showResult();

        }

    }
);


// Previous Button

previousButton.addEventListener(
    "click",
    function () {

        if (currentQuestion > 0) {

            // Current question is being left

            clearInterval(timer);

            clearTimerEndTime();

            timerElement.classList.remove("warning");

            currentQuestion--;

            saveCurrentQuestion();

            displayQuestion();

        }

    }
);


// Option Click Events

optionsElement.forEach((option) => {

    option.addEventListener(
        "click",
        function () {

            if (answered) {

                return;

            }


            answered = true;

            clearInterval(timer);

            clearTimerEndTime();

            timerElement.classList.remove("warning");
            // Save user's answer

            userAnswers[currentQuestion] =
                option.textContent;

            saveAnswers();


            // Check answer

            if (
                option.textContent ===
                questions[currentQuestion].answer
            ) {

                option.classList.add(
                    "correct"
                );

                console.log("Correct!");

            } else {

                option.classList.add(
                    "wrong"
                );


                // Show correct answer

                optionsElement.forEach(
                    (option) => {

                        if (
                            option.textContent ===
                            questions[currentQuestion].answer
                        ) {

                            option.classList.add(
                                "correct"
                            );

                        }

                    }
                );

                console.log("Wrong!");

            }


            // Disable all options

            optionsElement.forEach(
                (option) => {

                    option.disabled = true;

                }
            );


            // Recalculate score

            calculateScore();

            console.log(
                "Score:",
                score
            );

        }
    );

});


// Show Result

function showResult() {

    clearInterval(timer);

    clearTimerEndTime();

    localStorage.removeItem(
        "quizAnswers"
    );

    localStorage.removeItem(
        "currentQuestion"
    );


    quizCard.style.display =
        "none";


    resultContainer.style.display =
        "block";


    finalScoreElement.textContent =
        `Your Score: ${score} / ${questions.length}`;

}


// Restart Button

restartButton.addEventListener(
    "click",
    function () {

        clearInterval(timer);

        clearSavedQuiz();


        currentQuestion = 0;

        score = 0;

        answered = false;

        userAnswers = [];


        resultContainer.style.display =
            "none";


        quizCard.style.display =
            "block";


        displayQuestion();

    }
);