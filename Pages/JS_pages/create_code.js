function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        // If the user is not logged in, redirect to the login page
        window.location.href = 'login.html';
    }
}


function isValidPasswordLength(password) {
    return password.length >= 6;
}

function isCapitalAvailable(password) {
    for (let index = 0; index < password.length; index++) {
        if (password[index] >= 'A' && password[index] <= 'Z') {
            return true;
        }
    }
    return false;
}


function isSmallAvailable(password) {
    for (let index = 0; index < password.length; index++) {
        if (password[index] >= 'a' && password[index] <= 'z') {
            return true;
        }
    }
    return false;
}

function hasNumber(password) {
    for (let index = 0; index < password.length; index++) {
        if (/\d/.test(password[index])) { // Use a regular expression to check if the character is a digit
            return true;
        }
    }
    return false;
}


function checkcodes() {
    let valid = true;
    const code = document.getElementById('code');
    const NameInput = document.getElementById('name');
    
    // Get the s
    // Array to hold the fields
    // Initialize a variable to keep track of any empty fields
    let emptyFields = [code, NameInput];

    // Check each field to see if it's empty
    emptyFields.forEach((field) => {
        if (field.value.trim() === '') {
            field.style.borderColor = '#ff0000'; // Corrected syntax for color
            field.placeholder = "This field is required";
            valid = false;
            // emptyfields.push(field.id); // Optional: Add the field ID to emptyfields
        }
        else {
            field.style.borderColor = '#ccc';
        }
    });
        

    return valid;
}




const url = "http://127.0.0.1:5000";

window.addEventListener('load', function() {
    checkLogin();
    // const token = JSON.parse(sessionStorage.apiResponse).access_token;
});

document.getElementById("createButton").addEventListener("click", async (event) => {
    event.preventDefault();
    let valid = false;
    valid = checkcodes();
    const code = document.getElementById('code');
    const codeConf = document.getElementById('codeConf');
    const name = document.getElementById('name');
    const errorParagraphs = document.querySelectorAll('.Errors');

    errorParagraphs.forEach(paragraph => {
        paragraph.style.display = 'none';
    });

    if (name.value.trim().length < 4) {
        document.getElementById("errorName").style.display = "block";
        valid = false;
    }
    else if (!isValidPasswordLength(code.value)) {
        document.getElementById("errorLength").style.display = "block";
        valid = false;
    }
    else if (!isCapitalAvailable(code.value)) {
        valid = false;
        document.getElementById("errorCapital").style.display = "block";
    }
    else if (!isSmallAvailable(code.value)) {
        valid = false;
        document.getElementById("errorSmall").style.display = "block";
    }
    else if (!hasNumber(code.value)){
        valid = false;
        document.getElementById("errorNumber").style.display = "block";
    }
    else if (codeConf.value != code.value)
    {
        valid = false;
        document.getElementById("errorConf").style.display = "block";
    } else {
        valid = true;
    }
    
    if (valid) {
        try {
            const token = JSON.parse(sessionStorage.apiResponse).access_token;
            const config = {
                headers : {
                    'Authorization': `Bearer ${token}`
                }
            };
            const data = {
                "title" : name.value.trim(),
                "code" : code.value.trim()
            };
            const response = await axios.post(url + "/api/exams", data, config);

            const createdExam = JSON.stringify({
                "id" : response.data.exam_id,
                "data" : data
            });
           
            sessionStorage.setItem("createdExam", createdExam);
            const newUrl = window.location.href.replace(/#/g, '');
            sessionStorage.setItem("lastPage", newUrl);
            window.location.href = "./createquiz.html"
        } catch (error) {
            if (error.response && error.response.status >= 400) { // Check if error.response exists
                document.getElementById("errorQuiz").style.display = "block";
                console.log(error.response.data);
            } else {
                console.error('Error:', error); // Log any unexpected errors for debugging
            }
        }
    }
});

document.querySelector('.menu').addEventListener('click', function (event) {

    // Use closest to ensure you're targeting the button, not its child elements
    const clickedButton = event.target.closest('button');

    if (clickedButton && clickedButton.id === 'DashboardButton') {
        const newUrl = window.location.href.replace(/#/g, '');
        sessionStorage.setItem("lastPage", newUrl);
        console.log(sessionStorage.getItem("lastPage"));
        window.location.href = "./TeacherDashboard.html";
    }
    else if (clickedButton && clickedButton.id === 'createQuizButton') {
        location.reload(); // Change the path if it's supposed to go to an HTML file
    }
});
