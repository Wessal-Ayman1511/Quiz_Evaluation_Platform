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

// Call checkLogin on page load
window.addEventListener('load', function() {
    checkLogin();
    setUserName("user-button");
    // const token = JSON.parse(sessionStorage.apiResponse).access_token;
});
const url = "http://127.0.0.1:5000";
const token = JSON.parse(sessionStorage.apiResponse).access_token;

document.getElementById("joinQuiz").addEventListener("click", async (event) => {
    event.preventDefault();
    try {

        const examsResponse = await axios.get(url + "/api/exams", {
            headers: {  // Corrected 'header' to 'headers'
                'Authorization': `Bearer ${token}`
            }
        });
        sessionStorage.setItem("allExams", JSON.stringify(examsResponse.data)); // Store the data part of the response
        const newUrl = window.location.href.replace(/#/g, '');
        sessionStorage.setItem("lastPage", newUrl);
        window.location.href = "./view_quizzes.html";
    } catch (error) {
        if (error.response) { // Check if error.response exists
            console.log(error.response.data);
        } else {
            console.error(error);
        }
    }
});
document.getElementById("showMarks").addEventListener("click", async (event) => {
    event.preventDefault();
    const newUrl = window.location.href.replace(/#/g, '');
    sessionStorage.setItem("lastPage", newUrl);
    window.location.href = "./quiz_marks.html";
    
});

document.querySelector('.menu').addEventListener('click', function (event) {

    // Use closest to ensure you're targeting the button, not its child elements
    const clickedButton = event.target.closest('button');
    const newUrl = window.location.href.replace(/#/g, '');
    sessionStorage.setItem("lastPage", newUrl);

    if (clickedButton && clickedButton.id === 'DashboardButton') {
        window.location.href = "./quiz_marks.html";
    }
    else if (clickedButton && clickedButton.id === 'createQuizButton') {
        window.location.href = "./view_quizzes.html"; // Change the path if it's supposed to go to an HTML file
    }
});
