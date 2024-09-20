const url = "http://127.0.0.1:5000";

function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        // If the user is not logged in, redirect to the login page
        window.location.href = 'login.html';
    }
}


function displayQuizzes(quizzes) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through the quizzes and add rows to the table
    quizzes.forEach(quiz => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${quiz.exam_title}</td>
            <td>${quiz.duration} min</td>
            <td>${quiz.score} / </td>
            <td>${quiz.date_taken}</td>
            <td><a class="Trials" href="#" id='Trials${quiz.exam_id}'>${quiz.attempt_number}</a></td?
        `;
        tableBody.appendChild(newRow);
    });
}

function filterQuizzes() {
    const searchInput = document.getElementById('searchBar').value.toLowerCase();
    const quizzes = JSON.parse(sessionStorage.getItem("allMarks"));

    // Filter the quizzes based on the search input
    const filteredQuizzes = quizzes.filter(quiz => 
        quiz.exam_title.toLowerCase().includes(searchInput) ||
        quiz.date_taken.toLowerCase().includes(searchInput)
    );

    // Display the filtered quizzes
    displayQuizzes(filteredQuizzes);
}

async function loadQuizzes(token) {
    try {
        const resultResponse = await axios.get(url + "/api/student/results/latest", {
            headers: {  
                'Authorization': `Bearer ${token}`
            }
        });
        sessionStorage.setItem("allMarks", JSON.stringify(resultResponse.data)); // Store the data part of the response

        // Display all quizzes initially
        const quizzes = JSON.parse(sessionStorage.getItem("allMarks"));
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
    let quizzes = JSON.parse(sessionStorage.getItem("allMarks"));

    // Sort based on the selected option
    if (sortBy === 'name') {
        quizzes.sort((a, b) => a.exam_title.localeCompare(b.exam_title));
    } else if (sortBy === 'duration') {
        quizzes.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === 'mark') {
        quizzes.sort((a, b) => b.score - a.score); // Assuming score is numeric
    } else if (sortBy === 'date') {
        quizzes.sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken));
    }

    // Display the sorted quizzes
    displayQuizzes(quizzes);
}

// Call checkLogin on page load
window.addEventListener('load', function() {
    checkLogin();
    const token = JSON.parse(sessionStorage.apiResponse).access_token;
    loadQuizzes(token);

    // Add event listener to the search bar for dynamic searching
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', filterQuizzes); // Call filterQuizzes on each input
    document.getElementById('sortBy').addEventListener('change', sortQuizzes);
});


document.querySelector('tbody').addEventListener('click', function(event) {
    if (event.target && event.target.matches('.Trials')) {
        const btnId = Number(event.target.id.substring(6));
        // handleButtonClick(action);
        sessionStorage.setItem("quizId", JSON.stringify(btnId));
        sessionStorage.setItem("lastPage", window.location.href);
        window.location.href = "./trials.html";
    }
});

document.querySelector('.container .sidebar').addEventListener('click', function (event) {

    // Use closest to ensure you're targeting the button, not its child elements
    const clickedButton = event.target;
    sessionStorage.setItem("lastPage", window.location.href);
    if (clickedButton && clickedButton.id === 'DashboardButton') {
        window.location.href = "./student_hpme.html"
    }
    else if (clickedButton && clickedButton.id === 'createQuizButton') {
        window.location.href = "./view_quizzes.html"; // Change the path if it's supposed to go to an HTML file
    }
});