
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        // If the user is not logged in, redirect to the login page
        window.location.href = 'login.html';
    }
}
const url = "http://127.0.0.1:5000";
function displayQuizzes(quizzes) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through the quizzes and add rows to the table
    quizzes.forEach(quiz => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${quiz.title}</td>
            <td>${quiz.created_at}</td>
            <td>${quiz.total_score}</td>
            <td>
                <input type="text" placeholder="code..." id = "code${quiz.id}">
                <button id = "button${quiz.id}" class="action-btn">Join</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    });
}

function filterQuizzes() {
    const searchInput = document.getElementById('searchBar').value.toLowerCase();
    const quizzes = JSON.parse(sessionStorage.getItem("allQuizzes"));

    // Filter the quizzes based on the search input
    const filteredQuizzes = quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchInput) ||
        quiz.created_at.toLowerCase().includes(searchInput)
    );

    // Display the filtered quizzes
    displayQuizzes(filteredQuizzes);
}

async function loadQuizzes(token) {
    try {
        const resultResponse = await axios.get(url + "/api/exams", {
            headers: {  
                'Authorization': `Bearer ${token}`
            }
        });
        sessionStorage.setItem("allQuizzes", JSON.stringify(resultResponse.data)); // Store the data part of the response
        // Display all quizzes initially
        const quizzes = JSON.parse(sessionStorage.getItem("allQuizzes"));
        displayQuizzes(quizzes); // Show all results on initial load

    } catch (error) {
        if (error.response) { 
            console.log(error.response.data);
        } else {
            console.error(error);
        }
    }
}

function sortQuizzes() {
    const sortBy = this.value;
    let quizzes = JSON.parse(sessionStorage.getItem("allQuizzes"));

    // Sort based on the selected option
    if (sortBy === 'name') {
        quizzes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'mark') {
        quizzes.sort((a, b) => b.total_score - a.total_score); // Assuming score is numeric
    } else if (sortBy === 'date') {
        quizzes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Display the sorted quizzes
    displayQuizzes(quizzes);
}

function openQuiz(id) {
    const code = document.getElementById("code" + id).value;
    const quizzes = JSON.parse(sessionStorage.getItem("allQuizzes"));
    document.getElementById("code" + id).value = '';
    
    quizzes.forEach(quiz => {
        if (quiz.id === id && quiz.code === code){
            sessionStorage.setItem("quizRequested", JSON.stringify(quiz));
            window.location.href = 'quizExam.html';
        }
    });
    document.getElementById("code" + id).style.borderColor = 'red';
    document.getElementById("code" + id).placeholder = 'wrong code!';
}

// Call checkLogin on page load
window.addEventListener('load', function(event) {
    event.preventDefault;
    checkLogin();
    const token = JSON.parse(sessionStorage.apiResponse).access_token;
    loadQuizzes(token);

    // Add event listener to the search bar for dynamic searching
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', filterQuizzes); // Call filterQuizzes on each input
    document.getElementById('sortBy').addEventListener('change', sortQuizzes);
});

document.querySelector('tbody').addEventListener('click', function(event) {
    if (event.target && event.target.matches('.action-btn')) {
        const btnId = event.target.id.substring(6); // getting the button id and removing the button word from the beginning
        // handleButtonClick(action);
        openQuiz(Number(btnId));
    }
});
