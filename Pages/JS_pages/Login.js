document.getElementById('loginButton').addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        const response = await axios.post("http://127.0.0.1:5000/api/login", {
            email: email,
            password: password
        });
        console.log(response.data); 
    } catch (error) {
        console.error('Login failed:', error);
    }
});
