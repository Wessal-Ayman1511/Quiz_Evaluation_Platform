const questionsMap = new Map();
let total_mark = 0;
let questionCount = 0;
const url = "http://127.0.0.1:5000";

function checkLogin() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
        if (!isLoggedIn) {
            // If the user is not logged in, redirect to the login page
            window.location.href = 'login.html';
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


function checkfields(id) {
    let valid = true;
    const questionContainer = document.getElementById('question' + id);
    const mark = questionContainer.querySelector('#marks');
    const Qstatement = questionContainer.querySelector('#Qstatement');
    const answersInputs = questionContainer.querySelectorAll(' .answer-list .answer-input');
    const correctAnswer = questionContainer.querySelectorAll(`input[type="radio"][name="correctAnswer${id}"]`);
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




function createNewQuestionSection(question, last) {
    // Determine the correct answer based on the quiz data
    const correctOption = question.correct_option;
    
    // Create a new div for the quiz section
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-section';
    questionDiv.id = `question${question.id}`;
    
    // Check which radio button should be selected (checked)
    const isOption1Correct = question.option1 === correctOption ? 'checked' : '';
    const isOption2Correct = question.option2 === correctOption ? 'checked' : '';
    const isOption3Correct = question.option3 === correctOption ? 'checked' : '';
    const isOption4Correct = question.option4 === correctOption ? 'checked' : '';

    // Create the inputs and buttons for the new question
    questionDiv.innerHTML = `
        <button id="questionDel${question.id}" class="delete-btn" name="questionDeleteButton" style="font-size: large;color: red;">X</button>
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
                            <input type="radio" name="correctAnswer${question.id}" value="1" ${isOption1Correct}>
                            <input type="text" class="answer-input" id=1 placeholder="Option 1..." value="${question.option1}">
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="correctAnswer${question.id}" value="2" ${isOption2Correct}>
                            <input type="text" class="answer-input" id=2 placeholder="Option 2..." value="${question.option2}">
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="correctAnswer${question.id}" value="3" ${isOption3Correct}>
                            <input type="text" class="answer-input" id=3 placeholder="Option 3..." value="${question.option3}">
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="correctAnswer${question.id}" value="4" ${isOption4Correct}>
                            <input type="text" class="answer-input" id=4 placeholder="Option 4..." value="${question.option4}">
                        </label>
                    </li>
                </ul>
                <p class="Errors" id="choiceError">You have to choose which answer is correct.</p>
            </div>
        </div>
    `;

    if (last) {
        questionDiv.innerHTML += `<button class="add-question-btn" id="button${question.id}">Add Question</button>`;
    }

    return questionDiv;
}

    
    // function createNewSubmitButton() {
    //     const submitButton = document.createElement('div');
    //     submitButton.className = 'btns';
    //     submitButton.id = `submitButton`;
    
    //     submitButton.innerHTML = `<button class="submit-btn">Submit</button>`;
    //     return submitButton;
    // }

       
    async function getContent(quizId) {
        try {
            const contentResponse = await axios.get(url + `/api/exams/${quizId}`);
            sessionStorage.setItem("quizContent", JSON.stringify(contentResponse.data));
            contentResponse.data.questions.forEach((question) => {
                questionsMap.set(question.id, question);
            });
            console.log(questionsMap);
        } catch (error) {
            if (error.response) { 
                console.log(error.response.data);
            } else {
                console.error(error);
            }
        }
    }
    
    // async function submitExam(token, quiz) {
    //     try {
    //         const duration = hours * 60 + minutes + seconds / 60;
    //         const config = {
    //             headers : {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         };
    //         const data = {
    //             "answers": answers,
    //             "duration": duration 
    //         };
    //         const contentResponse = await axios.post(url + `/api/exams/${quiz.id}/submit`, data, config);
    //         sessionStorage.setItem("totalScore", JSON.stringify(contentResponse));
    //         window.location.href = "./student_hpme.html";
    //     } catch (error) {
    //         if (error.response) { 
    //             console.log(error.response.data);
    //         } else {
    //             console.error(error);
    //         }
    //     }
    // }
    
    window.addEventListener('load', async function() {
        checkLogin();
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
        questions.forEach((question, index, array) => {
            const isLast = index === array.length - 1; // Check if it's the last element
            const newQuestion = createNewQuestionSection(question, isLast); // Pass `isLast` to the function
            total_mark += question.mark;
            questionCount++;
            document.querySelector('div[name="questions"]').appendChild(newQuestion);
        });

        document.querySelector(".summary p").innerHTML = `Total Marks: ${total_mark}/ Questions: ${questions.length}`;
        
        
        
        // Start the timer after everything is rendered
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
    
    // document.querySelector('.main').addEventListener('click', function(event) {
    //     answers = [];
    //     if (event.target && event.target.matches('.submit-btn')) {
    //         clearInterval(timerInterval); // Stop the timer
    
    //         const quiz = JSON.parse(sessionStorage.getItem("quizRequested"));
    //         const token = JSON.parse(sessionStorage.apiResponse).access_token;
            
    //         const questionElements = document.querySelectorAll('.quiz-section');
    
    //         questionElements.forEach(questionElement => {
    //             const questionId = Number(questionElement.id.split('-')[2]);
    
    //             const disabledButton = questionElement.querySelector('.answer-list .answer-input:disabled');
    
    //             if (disabledButton) {
    //                 const selectedAnswer = disabledButton.innerHTML;
    //                 answers.push({
    //                     "question_id": questionId,
    //                     "selected_answer": selectedAnswer
    //                 });
    //             }
    //         });
    
    //         // Now submit the exam along with the answers array
    //         submitExam(token, quiz);
    //     }
    // });
    
    document.querySelector('.main').addEventListener('click', async function (event) {
        if (event.target && event.target.matches('#quizDeleteButton')) {
            const quizId = JSON.parse(sessionStorage.getItem("quizId"));
            console.log(quizId);
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
        console.log(token);

        const userConfirmed = confirm("Do you want to delete this question?");

        if (userConfirmed) {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                await axios.delete(`${url}/api/exams/${quizId}/questions/${id}`, config);
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
        if (event.target && event.target.matches('.add-question-btn')) {
    
            const btnId = event.target.id.substring(6);
    
            if (checkfields(btnId)) {
                const questionContainer = document.getElementById('question' + btnId);
                const Qstatement = questionContainer.querySelector('#Qstatement').value;
                const mark = Number(questionContainer.querySelector('#marks').value);
                const answersInputs = questionContainer.querySelectorAll(' .answer-list .answer-input');
                const correctAnswer = questionContainer.querySelectorAll(`input[type="radio"][name="correctAnswer${btnId}"]`);
                const existingButtons = document.querySelectorAll('.add-question-btn');
                const inputs = questionContainer.querySelectorAll('input');
                const quizId = JSON.parse(sessionStorage.getItem("quizId"));
    
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
    
    
                // try {
                //     const token = JSON.parse(sessionStorage.apiResponse).access_token;
                //     const config = {
                //         headers : {
                //             'Authorization': `Bearer ${token}`
                //         }
                //     };
                //     const data = {
                //         "question_title": Qstatement.trim(),
                //         "option1": answersInputs[0].value.trim(),
                //         "option2": answersInputs[1].value.trim(),
                //         "option3": answersInputs[2].value.trim(),
                //         "option4": answersInputs[3].value.trim(),
                //         "correct_option": chosenAnswer.value.trim(),
                //         "mark": mark
                //     };
                //     const response = await axios.post(url + `/api/exams/${quizId}/questions`, data, config);
                //     console.log(response.data);
                // } catch (error) {
                //     if (error.response && error.response.status >= 400) { // Check if error.response exists
                //         document.getElementById("errorQuiz").style.display = "block";
                //         console.log(error.response.data);
                //     } else {
                //         console.error('Error:', error); // Log any unexpected errors for debugging
                //     }
                // }
    
                
                
                const newQuestionSection = createNewQuestionSection(questionCount, true);
    
                // Append the new question section to the container
                document.querySelector('[name="questions"]').appendChild(newQuestionSection);
            }
    
        }
    });