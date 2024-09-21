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
            <td><a class="examContent" href="#" id='quiz${quiz.id}'>${quiz.title}</a></td>
            <td><a class="examParticipants" href="#" id='students${quiz.id}'>${quiz.participants}</a></td>
            <td>${quiz.total_score}</td>
            <td>${quiz.created_at}</td>
        `;
        tableBody.appendChild(newRow);
    });
}




function filterQuizzes() {
    const searchInput = document.getElementById('searchBar').value.toLowerCase();
    const quizzes = JSON.parse(sessionStorage.getItem("allExams"));

    // Filter the quizzes based on the search input
    const filteredQuizzes = quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchInput) ||
        quiz.created_at.toLowerCase().includes(searchInput) ||
        String(quiz.total_score).includes(searchInput)
    );

    // Display the filtered quizzes
    displayQuizzes(filteredQuizzes);
}

async function loadQuizzes(token) {
    try {
        const resultResponse = await axios.get(url + "/api/teacherDashboard", {
            headers: {  
                'Authorization': `Bearer ${token}`
            }
        });
        sessionStorage.setItem("allExams", JSON.stringify(resultResponse.data)); // Store the data part of the response

        // Display all quizzes initially
        const quizzes = JSON.parse(sessionStorage.getItem("allExams"));
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
    let quizzes = JSON.parse(sessionStorage.getItem("allExams"));

    // Sort based on the selected option
    if (sortBy === 'name') {
        quizzes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'participant') {
        quizzes.sort((a, b) => b.participants - a.participants);
    } else if (sortBy === 'mark') {
        quizzes.sort((a, b) => b.total_score - a.total_score); // Assuming score is numeric
    } else if (sortBy === 'date') {
        quizzes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Display the sorted quizzes
    displayQuizzes(quizzes);
}


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
    if (event.target && event.target.matches('.examContent')) {
        const btnId = event.target.id.substring(4); // getting the button id and removing the button word from the beginning
        // handleButtonClick(action);
        sessionStorage.setItem("quizId", JSON.stringify(btnId));
        const newUrl = window.location.href.replace(/#/g, ' ');
        sessionStorage.setItem("lastPage", newUrl);
        window.location.href = "./view_content.html";
    }
});

document.querySelector('tbody').addEventListener('click', function(event) {
    if (event.target && event.target.matches('.examParticipants')) {
        const btnId = event.target.id.substring(8); // getting the button id and removing the button word from the beginning
        // handleButtonClick(action);
        sessionStorage.setItem("quizId", JSON.stringify(btnId));
        const newUrl = window.location.href.replace(/#/g, ' ');
        sessionStorage.setItem("lastPage", newUrl);
        window.location.href = "./view_students.html";
    }
});

document.querySelector('.container .menu').addEventListener('click', function (event) {

    // Use closest to ensure you're targeting the button, not its child elements
    const clickedButton = event.target.closest('button');

    if (clickedButton && clickedButton.id === 'DashboardButton') {
        location.reload();
    }
    else if (clickedButton && clickedButton.id === 'createQuizButton') {
        const newUrl = window.location.href.replace(/#/g, ' ');
        sessionStorage.setItem("lastPage", newUrl);
        window.location.href = "./create_code.html"; // Change the path if it's supposed to go to an HTML file
    }
});
