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

const questionElement = document.querySelector("#question");

const questionNumberElement = document.querySelector("#question-number");

const optionsElement = document.querySelectorAll(".option");

const nextButton = document.querySelector("#next-btn");

const previousButton = document.querySelector("#previous-btn");

const scoreElement = document.querySelector("#score");

const timerElement = document.querySelector("#timer");

const resultContainer = document.querySelector("#result-container");

const finalScoreElement = document.querySelector("#final-score");

const restartButton = document.querySelector("#restart-btn");

const quizCard = document.querySelector(".quiz-card");

// Current question
let currentQuestion = 0;
let score = 0;
let answered = false;
let userAnswers = [];
let timeLeft = 15;
let timer;

function calculateScore() {
    score = 0;

    userAnswers.forEach((userAnswer, index) => {

        if (userAnswer === undefined || userAnswer === null) {
            return;
        }

        if (userAnswer === questions[index].answer) {
            score++;
        } else {
            score--;
        }
    });

    scoreElement.textContent = `Score: ${score}`;
}

function saveAnswers() {
    localStorage.setItem(
        "quizAnswers",
        JSON.stringify(userAnswers)
    );
}

function loadAnswers() {

    const savedAnswers =
        localStorage.getItem("quizAnswers");

    if (savedAnswers !== null) {

        userAnswers = JSON.parse(savedAnswers);

    }
}


function clearSavedQuiz() {
    localStorage.removeItem("quizAnswers");
}



function handleTimeUp() {

    console.log("Time's up!");

    answered = true;

    userAnswers[currentQuestion] = null;
    saveAnswers();

    optionsElement.forEach((option) => {

        option.disabled = true;

    });

    setTimeout(function () {

        if (currentQuestion < questions.length - 1) {

            currentQuestion++;


            displayQuestion();

        } else {

        showResult();
        }

    }, 1000);

}


function startTimer() {

    clearInterval(timer);

    timeLeft = 15;

    timerElement.textContent =
        `${timeLeft}s`;

    timer = setInterval(function () {

        timeLeft--;

        timerElement.textContent =
            `${timeLeft}s`;

        if (timeLeft === 0) {

            clearInterval(timer);

            console.log("Time's up!");

             handleTimeUp();


        }

    }, 1000);

}


// Display question

function displayQuestion() {

    answered = userAnswers[currentQuestion] !== undefined;

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

        // If the question was already answered
        if (answered) {

            // Disable all options
            option.disabled = true;

            // Show the correct answer
            if (
                option.textContent ===
                questions[currentQuestion].answer
            ) {

                option.classList.add("correct");
            }

            // Show the user's wrong answer
            if (
                option.textContent ===
                userAnswers[currentQuestion] &&
                option.textContent !==
                questions[currentQuestion].answer
            ) {

                option.classList.add("wrong");
            }
        }

    });

    // Update score on screen
    scoreElement.textContent = `Score: ${score}`;

    if (!answered) {
        startTimer();
    } else {
        clearInterval(timer);
    }
}



loadAnswers();
// Display first question

displayQuestion();


// Next button

nextButton.addEventListener("click", function () {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        displayQuestion();

    } else {

        showResult();

    }

});


previousButton.addEventListener("click", function () {

    if (currentQuestion > 0) {

        currentQuestion--;

        displayQuestion();
    }

});


// Option Click Events
optionsElement.forEach((option) => {
    option.addEventListener("click", function () {

        if (answered) {
            return;
        }

        answered = true;
        clearInterval(timer);

        userAnswers[currentQuestion] = option.textContent;
        saveAnswers();
        
        if (option.textContent === questions[currentQuestion].answer) {

            option.classList.add("correct");
            console.log("Correct!");

        } else {

            option.classList.add("wrong");

            optionsElement.forEach((option) => {

                if (
                    option.textContent ===
                    questions[currentQuestion].answer
                ) {
                    option.classList.add("correct");
                }

            });

            console.log("Wrong!");
        }

        optionsElement.forEach((option) => {
            option.disabled = true;
        });

        calculateScore();

        console.log("Score:", score);
    });
});

function showResult() {

    clearInterval(timer);

    quizCard.style.display = "none";

    resultContainer.style.display = "block";

    finalScoreElement.textContent =
        `Your Score: ${score} / ${questions.length}`;

}


restartButton.addEventListener("click", function () {

    clearInterval(timer);

    clearSavedQuiz();

    currentQuestion = 0;

    score = 0;

    answered = false;

    userAnswers = [];

    resultContainer.style.display = "none";

    quizCard.style.display = "block";

    displayQuestion();

});