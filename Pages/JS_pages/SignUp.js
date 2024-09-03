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
