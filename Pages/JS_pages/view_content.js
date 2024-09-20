const questionsMap = new Map();
let total_mark = 0;
let questionCount = 0;
const url = "http://127.0.0.1:5000";
const urlPages = "http://127.0.0.1:5001";

function checkLogin() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
        if (!isLoggedIn) {
            // If the user is not logged in, redirect to the login page
            window.location.href = 'login.html';
        }
}

function checkLastPage() {
    const location = sessionStorage.getItem("lastPage");

    if (location != (urlPages + "/Pages/HTML_pages/TeacherDashboard.html"))
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




function checkFields(id, isEdit = false) {
    let valid = true;
    const questionContainer = document.getElementById('question' + id);
    const mark = questionContainer.querySelector('#marks');
    const Qstatement = questionContainer.querySelector('#Qstatement');
    const answersInputs = questionContainer.querySelectorAll('.answer-list .answer-input');
    const correctAnswer = questionContainer.querySelectorAll(`input[type="radio"][name="correctAnswer${isEdit ? id : ''}"]`);

    // Validate answer inputs
    answersInputs.forEach(answer => {
        if (!isEmpty(answer)) valid = false;
    });

    if (!isEmpty(mark)) valid = false;
    if (!isEmpty(Qstatement)) valid = false;

    let selectedAnswer = null;
    correctAnswer.forEach(radio => {
        if (radio.checked) selectedAnswer = radio.value;
    });

    if (!selectedAnswer) {
        questionContainer.querySelector("#choiceError").style.display = "block";
        questionContainer.querySelector("#choiceError").style.color = "red";
        valid = false;
    } else {
        questionContainer.querySelector("#choiceError").style.display = "none";
    }

    if (!isNumber(mark.value)) {
        questionContainer.querySelector("#markError").style.display = "block";
        valid = false;
    } else {
        questionContainer.querySelector("#markError").style.display = "none";
    }

    return valid;
}


// Function to compare form values with question data
function compare(questionForm, questionData) {
    let updated = false;

    const questionTitleInput = questionForm.querySelector('.question-input');
    const markInput = questionForm.querySelector('.marks-input');
    const option1Input = questionForm.querySelector('input[id="1"]');
    const option2Input = questionForm.querySelector('input[id="2"]');
    const option3Input = questionForm.querySelector('input[id="3"]');
    const option4Input = questionForm.querySelector('input[id="4"]');

    // Get the correct answer from the form
    const correctOption = questionForm.querySelector(`input[name="correctAnswer${questionForm.id.substring(8)}"]:checked`);
    const correctOptionValue = correctOption ? correctOption.nextElementSibling.value.trim() : null;

    // Compare and update the questionData object to match the form values
    if (questionTitleInput.value.trim() !== questionData.question_title) {
        questionData.question_title = questionTitleInput.value.trim();
        updated = true;
    }

    if (markInput.value.trim() !== String(questionData.mark)) {
        questionData.mark = markInput.value.trim();
        updated = true;
    }

    if (option1Input.value.trim() !== questionData.option1) {
        questionData.option1 = option1Input.value.trim();
        updated = true;
    }

    if (option2Input.value.trim() !== questionData.option2) {
        questionData.option2 = option2Input.value.trim();
        updated = true;
    }

    if (option3Input.value.trim() !== questionData.option3) {
        questionData.option3 = option3Input.value.trim();
        updated = true;
    }

    if (option4Input.value.trim() !== questionData.option4) {
        questionData.option4 = option4Input.value.trim();
        updated = true;
    }

    // Update the correct option in questionData if it's different
    const correctOptionId = [
        questionData.option1,
        questionData.option2,
        questionData.option3,
        questionData.option4
    ].indexOf(correctOptionValue) + 1;

    if (correctOptionValue !== questionData.correct_option) {
        questionData.correct_option = correctOptionValue;
        updated = true;
    }

    return updated;
}



// Function to check and delete matched questions from the map
function editCheck() {
    const questions = document.querySelectorAll('div.quiz-section'); // Get all question forms
    questions.forEach((question) => {
        const questionId = Number(question.id.substring(8)); // Extract the id from the question form
        const questionData = questionsMap.get(questionId); // Get the question data from the map
        
        if (questionData) {
            const updated = compare(question, questionData); // Compare and possibly update form fields

            // If the question was updated (i.e., data was inconsistent), keep it in the map
            if (!updated) {
                questionsMap.delete(questionId); // Delete the question from the map if no updates were made
            }
        }
    });
}



function resetQuestionForm() {
    // Get the question section by its ID
    const questionDiv = document.getElementById('question1');
    
    // Reset the mark input field
    const markInput = questionDiv.querySelector('#marks');
    markInput.value = '';  // Clear the value
    
    // Reset the question statement input field
    const questionStatement = questionDiv.querySelector('#Qstatement');
    questionStatement.value = '';  // Clear the value
    
    // Reset all answer input fields
    const answerInputs = questionDiv.querySelectorAll('.answer-input');
    answerInputs.forEach(input => {
        input.value = '';  // Clear the value of each answer input
    });
    
    // Uncheck all radio buttons for correct answers
    const correctAnswerRadios = questionDiv.querySelectorAll('input[type="radio"]');
    correctAnswerRadios.forEach(radio => {
        radio.checked = false;  // Uncheck each radio button
    });
    
    // Hide or reset the error messages if necessary
    const markError = questionDiv.querySelector('#markError');
    const choiceError = questionDiv.querySelector('#choiceError');
    markError.style.display = 'none';  // Hide the mark error
    choiceError.style.display = 'none';  // Hide the choice error
}



function createNewQuestionSection(question, id) {
    // Determine the correct answer based on the quiz data
    const correctOption = question.correct_option;
    
    // Create a new div for the quiz section
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-section';
    questionDiv.id = `question${id}`;
    
    // Check which radio button should be selected (checked)
    const isOption1Correct = question.option1 === correctOption ? 'checked' : '';
    const isOption2Correct = question.option2 === correctOption ? 'checked' : '';
    const isOption3Correct = question.option3 === correctOption ? 'checked' : '';
    const isOption4Correct = question.option4 === correctOption ? 'checked' : '';

    // Create the inputs and buttons for the new question
    questionDiv.innerHTML = `
        <button id="questionDel${id}" class="delete-btn" name="questionDeleteButton" style="font-size: large;color: red;">X</button>
        <input type="text" id="marks" class="marks-input" placeholder="Mark..." value="${question.mark}">
        <p class="Errors" id="markError">Mark should be a number.</p>
        <div class="question-box">
            <label for="question" style="padding-left: 195px; padding-right:195px;"><b>Question Statement</b></label>
            <input type="text" id="Qstatement" class="question-input" value="${question.question_title}">
            
            <div class="answers">
                <label style="padding-left: 41%; padding-right: 41%"><b>Answers</b></label>
                <ul class="answer-list">
                    <li>
                        <label>
                            <input type="radio" name="correctAnswer${id}" value="1" ${isOption1Correct}>
                            <input type="text" class="answer-input" id=1 placeholder="Option 1..." value="${question.option1}">
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="correctAnswer${id}" value="2" ${isOption2Correct}>
                            <input type="text" class="answer-input" id=2 placeholder="Option 2..." value="${question.option2}">
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="correctAnswer${id}" value="3" ${isOption3Correct}>
                            <input type="text" class="answer-input" id=3 placeholder="Option 3..." value="${question.option3}">
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="correctAnswer${id}" value="4" ${isOption4Correct}>
                            <input type="text" class="answer-input" id=4 placeholder="Option 4..." value="${question.option4}">
                        </label>
                    </li>
                </ul>
                <p class="Errors" id="choiceError">You have to choose which answer is correct.</p>
            </div>
        </div>
    `;

    document.querySelector('div[name="questions"]').appendChild(questionDiv);
}


       
    async function getContent(quizId) {
        try {
            const contentResponse = await axios.get(url + `/api/exams/${quizId}`);
            sessionStorage.setItem("quizContent", JSON.stringify(contentResponse.data));
            contentResponse.data.questions.forEach((question) => {
                questionsMap.set(question.id, question);
            });
        } catch (error) {
            if (error.response) { 
                console.log(error.response.data);
            } else {
                console.error(error);
            }
        }
    }
    
    
    window.addEventListener('load', async function() {
        checkLogin();
        checkLastPage();
        const quizId = JSON.parse(sessionStorage.getItem("quizId"));
        const token = JSON.parse(sessionStorage.apiResponse).access_token;
        
        // Wait for content to be fetched
        await getContent(quizId);
        
        const quizContent = JSON.parse(sessionStorage.getItem("quizContent"));
        
        if (!quizContent || !quizContent.questions) {
            console.error('Failed to load quiz questions');
            return;
        }
        
        document.querySelector("#quizTitle").value = quizContent.title;
        const questions = quizContent.questions;
        questions.forEach((question) => {
            createNewQuestionSection(question, question.id); // Pass `isLast` to the function
            total_mark += question.mark;
            questionCount++;
        });

        document.querySelector(".summary p").innerHTML = `Total Marks: ${total_mark}/ Questions: ${questionCount}`;
        
        
        
        // Start the timer after everything is rendered
    });
    



    document.querySelector('.main').addEventListener('click', async function (event) {
        if (event.target && event.target.matches('#quizDeleteButton')) {
            const quizId = JSON.parse(sessionStorage.getItem("quizId"));
            const token = JSON.parse(sessionStorage.apiResponse).access_token;
            const userConfirmed = confirm("Do you want to delete this quiz?");
    
            if (userConfirmed) {
                try {
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    };
                    await axios.delete(`${url}/api/exams/${quizId}`, config);
                    window.location.href = "./TeacherDashboard.html";
                } catch (error) {
                    console.error('Error deleting question:', error.response ? error.response.data : error.message);
                }
            }
        }
    });
    
    
document.querySelector('.main').addEventListener('click', async function (event) {
    if (event.target && event.target.matches('[name="questionDeleteButton"]')) {
        const id = event.target.id.substring(11);
        const quizId = JSON.parse(sessionStorage.getItem("quizId"));
        const questionContainer = document.getElementById('question' + id);
        const token = JSON.parse(sessionStorage.apiResponse).access_token;
        const userConfirmed = confirm("Do you want to delete this question?");

        if (userConfirmed) {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                await axios.delete(`${url}/api/exams/${quizId}/questions/${id}`, config);
                total_mark -= Number(questionContainer.querySelector("#marks").value);
                questionCount--;
                document.querySelector(".summary p").innerHTML = `Total Marks: ${total_mark}/ Questions: ${questionCount}`;
                questionsMap.delete(Number(id));
                if (questionContainer) {
                    questionContainer.remove();
                }

            } catch (error) {
                console.error('Error deleting question:', error.response ? error.response.data : error.message);
            }
        }
    }
});


    document.querySelector('.main').addEventListener('click', async function (event) {
        if (event.target && event.target.matches('#button1')) {
    
            const btnId = event.target.id.substring(6);
    
            if (checkFields(btnId)) {
                const questionContainer = document.getElementById('question' + btnId);
                const Qstatement = questionContainer.querySelector('#Qstatement').value;
                const mark = Number(questionContainer.querySelector('#marks').value);
                const answersInputs = questionContainer.querySelectorAll(' .answer-list .answer-input');
                const correctAnswer = questionContainer.querySelectorAll(`input[type="radio"][name="correctAnswer"]`);
                const quizId = JSON.parse(sessionStorage.getItem("quizId"));
    
    
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
                
                // Increment the question count for the new question
    
    
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
                    createNewQuestionSection(data, response.data.id);
                    data.id = response.data.id;
                    questionsMap.set(data.id, data);
                    total_mark += Number(mark);
                    questionCount++;
                    document.querySelector(".summary p").innerHTML = `Total Marks: ${total_mark} / Questions: ${questionCount}`
                    resetQuestionForm();
                } catch (error) {
                    if (error.response && error.response.status >= 400) { // Check if error.response exists
                        document.getElementById("errorQuiz").style.display = "block";
                        console.log(error.response.data);
                    } else {
                        console.error('Error:', error); // Log any unexpected errors for debugging
                    }
                }
            }
    
        }
    });

    document.querySelector('.main').addEventListener('click', async function (event) {
        if (event.target && event.target.matches('.edit-btn')) {

        }
    });

    document.querySelector('.main').addEventListener('click', async function (event) {
        if (event.target && event.target.matches('.edit-btn')) {
            const token = JSON.parse(sessionStorage.apiResponse).access_token;
            let valid = true;
            if (questionCount > 0 && confirm("Do you really wish to edit this quiz?")) {
                quizContent = JSON.parse(sessionStorage.getItem("quizContent"));
                const quizTitle = document.querySelector("#quizTitle").value;
                if (quizTitle != quizContent.title) {
                    try{
                        const config = {
                            headers : {
                                'Authorization': `Bearer ${token}`
                            }
                        };
                        const data = {
                            "title" : quizTitle,
                            "code" : quizContent.code
                        };
                        
                        await axios.put(url + `/api/exams/${quizContent.id}`, data, config);
                    } catch (error) {
                        console.error("Error: ", error);
                    }
                }
                
                
                questionsMap.forEach((value, key) => {
                    if (!checkFields(key, true)) valid = false;
                });
                editCheck();
                if (valid) {
                    questionsMap.forEach(async (value, key) => {
                        try {
                            const config = {
                                headers : {
                                    'Authorization': `Bearer ${token}`
                                }
                            };
                            const response = await axios.put(url + `/api/exams/${quizContent.id}/questions/${key}`, value, config);
                            console.log(response.data);
                        } catch (error) {
                            console.error("Error: ", error);
                        }
                    });
                    window.location.href = "./TeacherDashboard.html";
                }
            } else {
                alert("Every quiz must have at least 1 question.");
            }
        }
    });


    document.querySelector('.container .menu').addEventListener('click', function (event) {

        // Use closest to ensure you're targeting the button, not its child elements
        const clickedButton = event.target.closest('button');
    
        if (confirm("Are you sure you want to leave this page without saving?")){
            sessionStorage.setItem("lastPage", window.location.href);
            if (clickedButton && clickedButton.id === 'DashboardButton') {
                window.location.href = "./TeacherDashboard.html";
            }
            else if (clickedButton && clickedButton.id === 'createQuizButton') {
                window.location.href = "./create_code.html"; // Change the path if it's supposed to go to an HTML file
            }
                
        }
    });