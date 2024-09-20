
document.getElementById('loginButton').addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    const url = "http://127.0.0.1:5000";

    try {
        const response = await axios.post(url + "/api/login", {
            email: email,
            password: password
        });
        sessionStorage.setItem('apiResponse', JSON.stringify(response.data));
        sessionStorage.setItem('isLoggedIn', true);
        if (response.data["role"] == "teacher") 
            {
                window.location.href = "./TeacherDashboard.html";
            }
        else {
            window.location.href = './student_hpme.html';
        }
    } catch (error) {
        if (error.response.status >= 400){
            document.getElementById("errorText").style.display = "block";
        }
    }
});