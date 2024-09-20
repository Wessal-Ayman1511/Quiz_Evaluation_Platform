const urlPages = "http://127.0.0.1:5001";
const url = "http://127.0.0.1:5000";

function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        // If the user is not logged in, redirect to the login page
        window.location.href = 'login.html';
    }
}

function checkLastPage() {
    const location = sessionStorage.getItem("lastPage");

    if (location != (urlPages + "/Pages/HTML_pages/quiz_marks.html"))
    {
        if (location == null)
        {
            window.location.href = "./student_hpme.html";
        } else {
            window.location.href = location;
        }
    }
}

function displayTrials(trials) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through the trials and add rows to the table
    trials.forEach(trial => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${trial.score}</a></td>
            <td>${trial.duration}</a></td>
            <td>${trial.date_taken}</td>
        `;
        tableBody.appendChild(newRow);
    });
}




function filterTrials() {
    const searchInput = document.getElementById('searchBar').value.toLowerCase();
    const trials = JSON.parse(sessionStorage.getItem("allTrials"));

    // Filter the Trials based on the search input
    const filteredtrials = trials.filter(trial => 
        String(trial.duration).includes(searchInput) ||
        trial.date_taken.includes(searchInput) ||
        String(trial.score).includes(searchInput)
    );

    // Display the filtered trials
    displayTrials(filteredtrials);
}

async function loadTrials(token) {
    const quizId = JSON.parse(sessionStorage.getItem("quizId"));
    try {
        const resultResponse = await axios.get(url + `/api/results/${quizId}`, {
            headers: {  
                'Authorization': `Bearer ${token}`
            }
        });

        sessionStorage.setItem("allTrials", JSON.stringify(resultResponse.data.results)); // Store the data part of the response
        // Display all triales initially
        const trials = JSON.parse(sessionStorage.getItem("allTrials"));
        displayTrials(trials); // Show all results on initial load

    } catch (error) {
        if (error.response) { 
            console.log(error.response.data);
        } else {
            console.error(error);
        }
    }
}

function sortTrials() {
    const sortBy = this.value;
    let trials = JSON.parse(sessionStorage.getItem("allTrials"));

    // Sort based on the selected option
    if (sortBy === 'duration') {
        trials.sort((a, b) => b.duration - a.duration);
    } else if (sortBy === 'mark') {
        trials.sort((a, b) => b.score - a.score); // Assuming score is numeric
    } else if (sortBy === 'date') {
        trials.sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken));
    }

    // Display the sorted quizzes
    displayTrials(trials);
}


window.addEventListener('load', function() {
    checkLogin();
    checkLastPage();
    const token = JSON.parse(sessionStorage.apiResponse).access_token;
    loadTrials(token);

    // Add event listener to the search bar for dynamic searching
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', filterTrials); // Call filterQuizzes on each input
    document.getElementById('sortBy').addEventListener('change', sortTrials);
});

document.querySelector('.container .menu').addEventListener('click', function (event) {

    // Use closest to ensure you're targeting the button, not its child elements
    const clickedButton = event.target.closest("button");
    sessionStorage.setItem("lastPage", window.location.href);
    if (clickedButton && clickedButton.id === 'DashboardButton') {
        window.location.href = "./student_hpme.html"
    }
    else if (clickedButton && clickedButton.id === 'createQuizButton') {
        window.location.href = "./view_quizzes.html"; // Change the path if it's supposed to go to an HTML file
    }
});