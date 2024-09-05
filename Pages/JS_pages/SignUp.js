

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPasswordLength(password) {
    return password.length >= 8;
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

function checkFields() {
    let valid = true;
    // Get the input fields by their IDs
    const name = document.getElementById('NameInput');
    const email = document.getElementById('EmailInput');
    const password = document.getElementById('passwordInput');
    const confirmPassword = document.getElementById('passwordConfInput');
    
    // Get the selected role
    const role = document.querySelector('input[name="role"]:checked');

    // Array to hold the fields
    const fields = [name, email, password, confirmPassword];
    // Initialize a variable to keep track of any empty fields
    // let emptyFields = [];

    // Check each field to see if it's empty
    for (const field of fields) {
        if (field.value.trim() === '') {
            field.style.borderColor = '#ff0000'; // Corrected syntax for color
            field.placeholder = "This field is required";
            valid = false;
            // emptyFields.push(field.id); // Optional: Add the field ID to emptyFields
        }
        else {
            field.style.borderColor = '#ccc';
        }
    }

    if (!role) {
        document.getElementById("errorRole").style.display = "block";
        document.getElementById("errorRole").style.color = "red";
        valid = false;
    }
    else {
        document.getElementById("errorRole").style.display = "none";
    }

    return valid;
}


document.getElementById("SignUpButton").addEventListener("click", async () => {
    event.preventDefault();
    let valid = false;
    valid = checkFields();
    const email = document.getElementById("EmailInput");
    const password = document.getElementById("passwordInput");
    const passwordConf = document.getElementById("passwordConfInput");
    const Name = document.getElementById("NameInput");
    const role = document.querySelector('input[name="role"]:checked');
    const errorParagraphs = document.querySelectorAll('#passwordErrors p');



    if (email.value.length > 0 && !isValidEmail(email.value))
    {
        document.getElementById("errorEmail").style.display = "block";
        valid = false;
    }
    else
    {
        document.getElementById("errorEmail").style.display = "none";
        valid = true;
    }



    errorParagraphs.forEach(paragraph => {
        paragraph.style.display = 'none';
    });

    if (!isValidPasswordLength(password.value)) {
        document.getElementById("errorLength").style.display = "block";
        valid = false;
    }
    else if (!isCapitalAvailable(password.value)) {
        valid = false;
        document.getElementById("errorCapital").style.display = "block";
    }
    else if (!isSmallAvailable(password.value)) {
        valid = false;
        document.getElementById("errorSmall").style.display = "block";
    }
    else if (!hasNumber(password.value)){
        valid = false;
        document.getElementById("errorNumber").style.display = "block";
    }
    else if (passwordConf.value != password.value)
    {
        valid = false;
        document.getElementById("errorConf").style.display = "block";
    }
    else if (!role) {
        valid = false;
    }
    else {
        valid = true;
    }

    
    if (valid) {
        try {
            const response = await axios.post("http://127.0.0.1:5000/api/register", {
                "email": email.value,
                "name": Name.value,
                "password": password.value,
                "role": role.value
            });
            sessionStorage.setItem('apiResponse', JSON.stringify(response.data));
            sessionStorage.setItem('isLoggedIn', true);
            if (role.value == "teacher") 
                {
                    window.location.href = "TeacherDashboard.html";
                }
            else {
                window.location.href = 'StudentHomeScreen.html';
            }
        } catch (error) {
            if (error.response.status >= 400){
                document.getElementById("errorText").style.display = "block";
            }
        }
    }
});