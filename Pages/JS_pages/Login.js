// const loginButton = document.getElementById("loginButton");
// const link = "http://127.0.0.1:5000";


// export function login(userEmail, userPassword) {
//     return axios.post(link+"/api/login", {
//         email: userEmail,
//         password: userPassword
//     }).then(response => {
//         console.log(response.data);
//     }).catch(error => {
        
//     });
// }

// loginButton.addEventListener("click", () => {
//     event.preventDefault();

//     const email = document.getElementById("usernameInput");
//     const password = document.getElementById("passwordInput");
//     login(email.value, password.value);
// });
import axios from 'axios';

axios.post("http://127.0.0.1:5000/api/login", {
    email: "ahmed@example.com",
    password: "ABCD6789"
}).then(response => {
    console.log(response.data);
}).catch(error => {
    console.log(error);
});