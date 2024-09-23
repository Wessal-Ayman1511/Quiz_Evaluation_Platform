const urlPages = "http://127.0.0.1:5001";
const url = "http://127.0.0.1:5000";
const timerDisplay = document.getElementById('timer');
let answers = [];
let seconds = 0;
let minutes = 0;
let hours = 0;
let timerInterval;


function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        // If the user is not logged in, redirect to the login page
        window.location.href = 'login.html';
        return false
    }
    return true;
}

function setUserName(divClass){
    const chosenDiv = document.querySelector(`.${divClass}`);
    const userName = JSON.parse(sessionStorage.getItem("apiResponse")).userName;
    chosenDiv.innerHTML = userName;
}

function checkLastPage() {
    const location = sessionStorage.getItem("lastPage");

    if (location != (urlPages + "/Pages/HTML_pages/view_quizzes.html"))
    {
        if (location == null)
        {
            window.location.href = "./student_hpme.html";
        } else {
            window.location.href = location;
        }
        return false;
    }
    return true;
}

function createNewQuizQuestion(question) {
    // Create a new div for the quiz section
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-section';
    questionDiv.id = `quiz-question-${question.id}`;

    // Create the inner HTML for the new question
    questionDiv.innerHTML = `
        <div class="question-box">
            <b>Mark: <span id="mark${question.id}">${question.mark}</span></b>
            <br>
            <label for="question" style="padding-left: 155px; padding-right: 155px;">
                <b> ${question.question_title}</b>
            </label>
        </div>
        <div class="answers">
            <ul class="answer-list">
                <li><button class="answer-input" id="1-${question.id}">${question.option1}</button></li>
                <li><button class="answer-input" id="2-${question.id}">${question.option2}</button></li>
                <li><button class="answer-input" id="3-${question.id}">${question.option3}</button></li>
                <li><button class="answer-input" id="4-${question.id}">${question.option4}</button></li>
            </ul>
        </div>
    `;

    return questionDiv;
}

function createNewSubmitButton() {
    const submitButton = document.createElement('div');
    submitButton.className = 'btns';
    submitButton.id = `submitButton`;

    submitButton.innerHTML = `<button class="submit-btn">Submit</button>`;
    return submitButton;
}


// Update timer display function
function updateTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
}

async function getContent(token, quiz) {
    try {
        const contentResponse = await axios.get(url + `/api/exam-content/${quiz.code}`, {
            headers: {  
                'Authorization': `Bearer ${token}`
            }
        });
        sessionStorage.setItem("quizContent", JSON.stringify(contentResponse.data));
    } catch (error) {
        if (error.response) { 
            console.log(error.response.data);
        } else {
            console.error(error);
        }
    }
}

async function submitExam(token, quiz) {
    try {
        const duration = hours * 60 + minutes + seconds / 60;
        const config = {
            headers : {
                'Authorization': `Bearer ${token}`
            }
        };
        const data = {
            "answers": answers,
            "duration": duration 
        };
        const contentResponse = await axios.post(url + `/api/exams/${quiz.id}/submit`, data, config);
        sessionStorage.setItem("totalScore", JSON.stringify(contentResponse));
        const newUrl = window.location.href.replace(/#/g, '');
        sessionStorage.setItem("lastPage", newUrl);
        window.location.href = "./student_hpme.html";
    } catch (error) {
        if (error.response) { 
            console.log(error.response.data);
        } else {
            console.error(error);
        }
    }
}

window.addEventListener('load', async function() {
    
    

    if (checkLogin() && checkLastPage()){
    setUserName("user-button");
    const quiz = JSON.parse(sessionStorage.getItem("quizRequested"));
    const token = JSON.parse(sessionStorage.apiResponse).access_token;
    
    // Wait for content to be fetched
    await getContent(token, quiz);
    
    const quizContent = JSON.parse(sessionStorage.getItem("quizContent"));
    
    if (!quizContent || !quizContent.questions) {
        console.error('Failed to load quiz questions');
        return;
    }
    
    document.querySelector(".quiz-title h2").innerHTML = quiz.title;
    const questions = quizContent.questions;
    document.querySelector(".total-marks h4").innerHTML = `Total Marks: ${quiz.total_score}/ Questions: ${questions.length}`;
    
    questions.forEach(question => {
        const newQuestion = createNewQuizQuestion(question);
        document.querySelector('.main').appendChild(newQuestion);
    });

    document.querySelector('.main').appendChild(createNewSubmitButton());

    // Start the timer after everything is rendered
    timerInterval = setInterval(updateTimer, 1000);
    }
});

document.querySelector('.main').addEventListener('click', function(event) {
    if (event.target && event.target.matches('.answer-input')) {
        const btnId = event.target.id;
        const questionId = btnId.substring(2);
        const value = event.target.innerHTML;
        let chosenAnswer;
        let chosenButton;

        // Enable other options when selecting a new answer
        for (let index = 1; index <= 4; index++) {
            if ((index + '-' + questionId) !== btnId) {
                chosenAnswer = index + '-' + questionId;
                chosenButton = document.getElementById(chosenAnswer);
                chosenButton.disabled = false;
            } 
        }
        // Disable the selected answer button
        event.target.disabled = true;
    }
});

document.querySelector('.main').addEventListener('click', function(event) {
    answers = [];
    if (event.target && event.target.matches('.submit-btn')) {
        const quiz = JSON.parse(sessionStorage.getItem("quizRequested"));
        const token = JSON.parse(sessionStorage.apiResponse).access_token;
        
        const questionElements = document.querySelectorAll('.quiz-section');

        questionElements.forEach(questionElement => {
            const questionId = Number(questionElement.id.split('-')[2]);

            const disabledButton = questionElement.querySelector('.answer-list .answer-input:disabled');

            if (disabledButton) {
                const selectedAnswer = disabledButton.innerHTML;
                answers.push({
                    "question_id": questionId,
                    "selected_answer": selectedAnswer
                });
            }
        });

        if (answers.length < 1)
            {
                alert("You can't submit an empty exam, please choose an answer!");
            } else if (confirm("Do you really want to submit this exam?")) {
                clearInterval(timerInterval); // Stop the timer
                submitExam(token, quiz);
            }

    }
});

document.querySelector('.menu').addEventListener('click', function (event) {

    // Use closest to ensure you're targeting the button, not its child elements
    const clickedButton = event.target.closest("button");
    const newUrl = window.location.href.replace(/#/g, '');
    sessionStorage.setItem("lastPage", newUrl);
    if (confirm("Do you want to leave the exam now? this trial will not be counted."))
    {
        if (clickedButton && clickedButton.id === 'DashboardButton') {
            window.location.href = "./student_hpme.html"
        }
        else if (clickedButton && clickedButton.id === 'createQuizButton') {
            window.location.href = "./view_quizzes.html"; // Change the path if it's supposed to go to an HTML file
        }
    }
});
