
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
        console.log(typeof quiz.score);
        newRow.innerHTML = `
            <td>${quiz.exam_title}</td>
            <td>${quiz.duration} min</td>
            <td>${quiz.score}</td>
            <td>${quiz.date_taken}</td>
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

// Call checkLogin on page load
window.addEventListener('load', function() {
    //checkLogin();
    const token = JSON.parse(sessionStorage.apiResponse).access_token;
    loadQuizzes(token);

    // Add event listener to the search bar for dynamic searching
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', filterQuizzes); // Call filterQuizzes on each input
});
