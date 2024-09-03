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

import got from 'got';

(async () => {
    try {
        const response = await got.post("http://localhost:5000/api/login", {
            json: {
                email: "ahmed@example.com",
                password: "ABCD6789"
            },
            responseType: 'json'
        });
        console.log(response.body);
    } catch (error) {
        console.error(error);
    }
})();