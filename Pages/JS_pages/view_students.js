const url = "http://127.0.0.1:5000";
const urlPages = "http://127.0.0.1:5500";


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

function displayParticipants(participants) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through the quizzes and add rows to the table
    participants.forEach(participant => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${participant.student_name}</td>
            <td>${participant.duration}</td>
            <td>${participant.score}</td>
            <td>${participant.date_taken}</td>
        `;
        tableBody.appendChild(newRow);
    });
}




function filterParticipants() {
    const searchInput = document.getElementById('searchBar').value.toLowerCase();
    const participants = JSON.parse(sessionStorage.getItem("allParticipants"));

    // Filter the quizzes based on the search input
    const filteredParticipants = participants.filter(participant => 
        participant.student_name.toLowerCase().includes(searchInput) ||
        participant.date_taken.toLowerCase().includes(searchInput) ||
        String(participant.score).includes(searchInput)
    );

    // Display the filtered quizzes
    displayParticipants(filteredParticipants);
}

async function loadParticipants(token, id) {
    try {
        const resultResponse = await axios.get(url + "/api/examParticipants/" + id, {
            headers: {  
                'Authorization': `Bearer ${token}`
            }
        });
        sessionStorage.setItem("allParticipants", JSON.stringify(resultResponse.data));
        // Display all quizzes initially
        const participants = JSON.parse(sessionStorage.getItem("allParticipants"));
        displayParticipants(participants); // Show all results on initial load

    } catch (error) {
        if (error.response) { 
            console.log(error.response.data);
        } else {
            console.error(error);
        }
    }
}

function sortParticipants() {
    const sortBy = this.value;
    let Participants = JSON.parse(sessionStorage.getItem("allParticipants"));

    // Sort based on the selected option
    if (sortBy === 'name') {
        Participants.sort((a, b) => a.student_name.localeCompare(b.student_name));
    } else if (sortBy === 'duration') {
        Participants.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === 'mark') {
        Participants.sort((a, b) => b.score - a.score); // Assuming score is numeric
    } else if (sortBy === 'date') {
        Participants.sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken));
    }

    // Display the sorted Participants
    displayParticipants(Participants);
}


window.addEventListener('load', function() {
    checkLogin();
    checkLastPage();
    const token = JSON.parse(sessionStorage.apiResponse).access_token;
    const id = JSON.parse(this.sessionStorage.getItem("quizId"));
    loadParticipants(token, id);

    // // Add event listener to the search bar for dynamic searching
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', filterParticipants); // Call filterQuizzes on each input
    document.getElementById('sortBy').addEventListener('change', sortParticipants);
});

document.querySelector('.container .sidebar').addEventListener('click', function (event) {

    // Use closest to ensure you're targeting the button, not its child elements
    const clickedButton = event.target;

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
