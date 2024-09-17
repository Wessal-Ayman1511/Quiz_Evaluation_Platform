function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        // If the user is not logged in, redirect to the login page
        window.location.href = 'login.html';
    }
}


function createNewQuizQuestion(question) {
    // Create a new div for the quiz section
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-section';
    questionDiv.id = `quiz-question-${question.id}`;

    // Create the inner HTML for the new question with similar structure
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
                <li>
                    <button class="answer-input" id="1-${question.id}">${question.option1}</button>
                </li>
                <li>
                    <button class="answer-input" id="2-${question.id}">${question.option2}</button>
                </li>
                <li>
                    <button class="answer-input" id="3-${question.id}">${question.option3}</button>
                </li>
                <li>
                    <button class="answer-input" id="4-${question.id}">${question.option4}</button>
                </li>
            </ul>
        </div>
    `;

    return questionDiv;
}

function createNewSubmitButton () {
    const submitButton = document.createElement('div');
    submitButton.className = 'btns';
    submitButton.id = `submitButton`;

    submitButton.innerHTML = `<button class="submit-btn">Submit</button>`;
    return submitButton;
}


const url = "http://127.0.0.1:5000";
const timerDisplay = document.getElementById('timer');
let answers = [];

let seconds = 0;
let minutes = 0;
let hours = 0;
let timerInterval;

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
        sessionStorage.setItem("quizContent", JSON.stringify(contentResponse.data));// Store the data part of the response

    } catch (error) {
        if (error.response) { 
            console.log(error.response.data);
        } else {
            console.error(error);
        }
    }
}

function compareObjects(obj1, obj2) {
    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If the number of keys is different, the objects are not equal
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Check if values for each key are the same in both objects
    for (let key of keys1) {
        // If the values are objects themselves, perform a deep comparison
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
            if (!compareObjects(obj1[key], obj2[key])) {
                return false;
            }
        } else {
            // Otherwise, compare primitive values
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
    }

    return true;
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
        const contentResponse = await axios.post(url + `/api/exams/${quiz.id}/submit`, data, config);// Store the data part of the response
        sessionStorage.setItem("totalScore", JSON.stringify(contentResponse));
        window.location.href = "./student_hpme.html";
    } catch (error) {
        if (error.response) { 
            console.log(error.response.data);
        } else {
            console.error(error);
        }
    }
}

window.addEventListener('load', function() {
    checkLogin();
    const quiz = JSON.parse(sessionStorage.getItem("quizRequested"));
    const token = JSON.parse(sessionStorage.apiResponse).access_token;
    let n = 0;
    
    getContent(token, quiz);
    document.querySelector(".quiz-title h2").innerHTML = quiz.title;
    const questions = JSON.parse(sessionStorage.getItem("quizContent")).questions;
    document.querySelector(".total-marks h4").innerHTML = `Total Marks: ${quiz.total_score}/ Questions: ${questions.length}`;
    questions.forEach(question => {
        const newQuestion = createNewQuizQuestion(question);
        document.querySelector('.main').appendChild(newQuestion);
    });

    document.querySelector('.main').appendChild(createNewSubmitButton());

    timerInterval = setInterval(updateTimer, 1000);
});

document.querySelector('.main').addEventListener('click', function(event) {
    if (event.target && event.target.matches('.answer-input')) {
        const btnId = event.target.id;
        const questionId = btnId.substring(2);
        const value = event.target.innerHTML;
        let chosenAnswer;
        let chosenButton;
        for (let index = 1; index < 5; index++) {
            if ((index + '-' + questionId) !== btnId) 
            {
                chosenAnswer = index + '-' + questionId;
                chosenButton = document.getElementById(chosenAnswer);
                chosenButton.disabled = false;
            }; 
        }
        // answers.push({"question_id": questionId, "selected_answer": value});
        event.target.disabled = true;
    }
});




// Use event delegation to handle dynamically added elements
document.querySelector('.main').addEventListener('click', function(event) {
    answers = [];
    // Check if the clicked element is the submit button
    if (event.target && event.target.matches('.submit-btn')) {
        clearInterval(timerInterval); // Stop the timer

        const quiz = JSON.parse(sessionStorage.getItem("quizRequested"));
        const token = JSON.parse(sessionStorage.apiResponse).access_token;
        
        // Get all the questions in the quiz
        const questionElements = document.querySelectorAll('.quiz-section');

        // Loop over each question to find the disabled (selected) button
        questionElements.forEach(questionElement => {
            const questionId = Number(questionElement.id.split('-')[2]); // Get question id from the element's id (quiz-question-{id})

            // Find the disabled button inside the answer list (the selected answer)
            const disabledButton = questionElement.querySelector('.answer-list .answer-input:disabled');

            if (disabledButton) {
                const selectedAnswer = disabledButton.innerHTML; // Get the answer value (button text)

                // Push the selected answer to the answers array
                answers.push({
                    "question_id": questionId,
                    "selected_answer": selectedAnswer
                });
            }
        });

        // Now submit the exam along with the answers array
        submitExam(token, quiz);
    }
});

