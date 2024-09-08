function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        // If the user is not logged in, redirect to the login page
        window.location.href = 'login.html';
    }
}

// Call checkLogin on page load
window.onload = checkLogin;
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
    window.location.href = "./quiz_marks.html";
    
});
