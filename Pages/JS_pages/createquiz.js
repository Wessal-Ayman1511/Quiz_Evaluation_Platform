const url = "http://127.0.0.1:5000";
const urlPages = "http://127.0.0.1:5001";


function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        // If the user is not logged in, redirect to the login page
        window.location.href = 'login.html';
    }
}

function setUserName(divClass){
    const chosenDiv = document.querySelector(`.${divClass}`);
    const userName = JSON.parse(sessionStorage.getItem("apiResponse")).userName;
    chosenDiv.innerHTML = userName;
}

function checkLastPage() {
    const location = sessionStorage.getItem("lastPage");

    if (location != (urlPages + "/Pages/HTML_pages/create_code.html"))
    {
        if (location == null)
        {
            window.location.href = "./TeacherDashboard.html";
        } else {
            window.location.href = location;
        }
    }
}

function isNumber(str) {
    // Check if the string is not empty and is not NaN after trimming
    return !isNaN(str.trim()) && str.trim() !== '';
}


window.addEventListener("load", (event) => {
    event.preventDefault();
    checkLogin();
    checkLastPage();
    setUserName("user-button");
    const createdExam = JSON.parse(sessionStorage.getItem("createdExam"));
    document.getElementById("quizTitle").value = createdExam.data.title;
});

// document.addEventListener('click', function(event) {
//     if (event.target && event.target.matches('.add-question-btn')) {
//         const btnId = event.target.id.substring(6); // Remove "button" from the button id
//         console.log(Number(btnId)); // Logs 1 or 2 for button1 or button2
//         // Further handling logic for adding a question can go here
//     }
// });


function isEmpty(answer) {
    let valid = true;
    if (answer.value.trim() === '') {
        answer.style.borderColor = '#ff0000'; // Corrected syntax for color
        answer.placeholder = "This field is required";
        valid = false;
        // emptyanswers.push(answer.id); // Optional: Add the answer ID to emptyanswers
    }
    else {
        answer.style.borderColor = '#ccc';
    }
    return valid;
}


function checkfields(id) {
    let valid = true;
    const questionContainer = document.getElementById('question' + id);
    const mark = questionContainer.querySelector('#marks');
    const Qstatement = questionContainer.querySelector('#Qstatement');
    const answersInputs = questionContainer.querySelectorAll(' .answer-list .answer-input');
    const correctAnswer = questionContainer.querySelectorAll('input[type="radio"][name="correctAnswer"]');
    // // Check each field to see if it's empty
    answersInputs.forEach(answer => {
        if (!isEmpty(answer)){
            valid = false;
        }
    });
    valid = isEmpty(mark);
    valid = isEmpty(Qstatement);

    let selectedAnswer = null;

    // Iterate through the NodeList to find the checked radio button
    correctAnswer.forEach(radio => {
        if (radio.checked) {
            selectedAnswer = radio.value; // Store the value of the selected radio button
        }
    });
    
    // Check if a radio button was selected or not
    if (selectedAnswer) {
        questionContainer.querySelector("#choiceError").style.display = "none";
    } else {
        questionContainer.querySelector("#choiceError").style.display = "block";
        questionContainer.querySelector("#choiceError").style.color = "red";// Handle the case where no radio button was selected
        valid = false;
    }

    if(!isNumber(mark.value)) {
        questionContainer.querySelector("#markError").style.display = "block";
        valid = false;
    }
    else {
        questionContainer.querySelector("#markError").style.display = "none"
    }
        

    return valid;
}


let questionCount = 1; // Starting with 1 because there's initially one question.
let total_mark = 0;

document.querySelector('.main').addEventListener('click', async function (event) {
    if (event.target && event.target.matches('.add-question-btn')) {

        const btnId = event.target.id.substring(6);

        if (checkfields(btnId)) {
            const questionContainer = document.getElementById('question' + btnId);
            const Qstatement = questionContainer.querySelector('#Qstatement').value;
            const mark = Number(questionContainer.querySelector('#marks').value);
            const answersInputs = questionContainer.querySelectorAll(' .answer-list .answer-input');
            const correctAnswer = questionContainer.querySelectorAll('input[type="radio"][name="correctAnswer"]');
            const existingButtons = document.querySelectorAll('.add-question-btn');
            const inputs = questionContainer.querySelectorAll('input');
            const quizId = JSON.parse(sessionStorage.getItem("createdExam")).id;

            total_mark += Number(mark);
            document.querySelector(".summary p").innerHTML = `Total Marks: ${total_mark} / Questions: ${questionCount}`

            questionCount++;

            let selectedAnswer = null;
            let chosenAnswer = null;

            // Iterate through the NodeList to find the checked radio button
            correctAnswer.forEach(radio => {
                if (radio.checked) {
                    selectedAnswer = radio.value; // Store the value of the selected radio button
                }
            });

            answersInputs.forEach(answer => {
                if (answer.id == selectedAnswer) {
                    chosenAnswer = answer;
                }
            })
            
            existingButtons.forEach(button => button.remove());
            // Increment the question count for the new question

            // Disable each input field
            inputs.forEach(input => {
                input.disabled = true;
            });


            try {
                const token = JSON.parse(sessionStorage.apiResponse).access_token;
                const config = {
                    headers : {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const data = {
                    "question_title": Qstatement.trim(),
                    "option1": answersInputs[0].value.trim(),
                    "option2": answersInputs[1].value.trim(),
                    "option3": answersInputs[2].value.trim(),
                    "option4": answersInputs[3].value.trim(),
                    "correct_option": chosenAnswer.value.trim(),
                    "mark": mark
                };
                const response = await axios.post(url + `/api/exams/${quizId}/questions`, data, config);
                console.log(response.data);
            } catch (error) {
                if (error.response && error.response.status >= 400) { // Check if error.response exists
                    document.getElementById("errorQuiz").style.display = "block";
                    console.log(error.response.data);
                } else {
                    console.error('Error:', error); // Log any unexpected errors for debugging
                }
            }

            
            // Create a new question section
            const newQuestionSection = createNewQuestionSection(questionCount);

            // Append the new question section to the container
            document.querySelector('[name="questions"]').appendChild(newQuestionSection);
        }

    }
});

function createNewQuestionSection(count) {
    // Create a new div for the quiz section
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-section';
    questionDiv.id = `question${count}`;
    
    // Create the inputs and buttons for the new question
    questionDiv.innerHTML = `
        <input type="text" id="marks" class="marks-input" placeholder="Mark...">
                <p class="Errors" id="markError">Mark should be a number.</p>
                <div class="question-box">
                    <label for="question" style="padding-left: 195px; padding-right:195px;"><b>Question Statement</b></label>
                    <input type="text" id="Qstatement" class="question-input" placeholder="What is the color of the sky?...">
                    
                    <div class="answers">
                        <label style="padding-left: 41%; padding-right: 41%"><b>Answers</b></label>
                        <ul class="answer-list">
                            <li><label><input type="radio" name="correctAnswer" value="1"><input type="text" class="answer-input" id=1 placeholder="Option 1..."></label></li>
                            <li><label><input type="radio" name="correctAnswer" value="2"><input type="text" class="answer-input" id=2 placeholder="Option 2..."></label></li>
                            <li><label><input type="radio" name="correctAnswer" value="3"><input type="text" class="answer-input" id=3 placeholder="Option 3..."></label></li>
                            <li><label><input type="radio" name="correctAnswer" value="4"><input type="text" class="answer-input" id=4 placeholder="Option 4..."></label></li>
                        </ul>
                        <p class="Errors" id="choiceError">You have to choose which answer is correct.</p>
                    </div>
                </div>
                <button class="add-question-btn" id="button${count}">Add Question</button>
    `;

    return questionDiv;
}

document.querySelector(".save-btn").addEventListener("click", async function (event) {
    const createdExam = JSON.parse(sessionStorage.getItem("createdExam"));


    if (isEmpty(document.getElementById("quizTitle"))){
        if (document.getElementById("quizTitle").value != createdExam.data.title) {
            try{
                const token = JSON.parse(sessionStorage.apiResponse).access_token;
                createdExam.data.title = document.getElementById("quizTitle").value;
                sessionStorage.setItem("createdExam", JSON.stringify(createdExam));
                const config = {
                    headers : {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const response = await axios.put(url + '/api/exams/' + createdExam.id, createdExam.data, config);
                console.log(response.data);
            } catch (error) {
                console.log("error");
                if (error.response && error.response.status >= 400) { // Check if error.response exists

                    //document.getElementById("errorQuiz").style.display = "block";
                    console.log(error.response.data);
                } else {
                    console.error('Error:', error); // Log any unexpected errors for debugging
                }
            }
        }
    }
    
    if (questionCount == 1) {
        document.querySelector("#quizError").style.display = "block";
    }
    else {
        document.querySelector("#quizError").style.display = "none";
        const newUrl = window.location.href.replace(/#/g, '');
        sessionStorage.setItem("lastPage", newUrl);
        window.location.href = "./TeacherDashboard.html";
    }
});



document.querySelector('.menu').addEventListener('click', async function (event) {

    // Use closest to ensure you're targeting the button, not its child elements
    const clickedButton = event.target.closest('button');

    if (clickedButton && clickedButton.id === 'DashboardButton') {
        if (confirm("Do you really want to leave this page?, a quiz with no questions will be deleted.")){
            if (questionCount < 2)
            {
                const quizId = JSON.parse(sessionStorage.getItem("createdExam")).id;
                const token = JSON.parse(sessionStorage.apiResponse).access_token;
                try{
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    };
                    await axios.delete(`${url}/api/exams/${quizId}`, config);
                } catch(error) {
                    console.error("Error: ", error);
                }
            }
            const newUrl = window.location.href.replace(/#/g, '');
            sessionStorage.setItem("lastPage", newUrl);
            window.location.href = "./TeacherDashboard.html";
        }
    }
    
});
