
// URL API
const LOGIN_API = 'http://127.0.0.1:5000/login'

// Get Elements 
let inputEmail = document.getElementById('email'),
    inputPassword = document.getElementById('password'),
    submit = document.getElementById('sumbit');


// In Case Click Button Log In
submit.addEventListener('click', (e) => {
    e.preventDefault();
    let data = {
        "username": inputEmail.value,
        "password": inputPassword.value
    };
    var jsonData = JSON.stringify(data);
    fetch(LOGIN_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    }).then(response => response.json())
        .then(data => {
            if (data.success === true) {
                // Set Data In local Storage
                localStorage.setItem("Data", JSON.stringify(data.data));
                // GO Page Dashboard
                location.href = 'pages/Dashboard.html';
            } else {
                // ERROR !
                document.getElementById('error').innerHTML = data.message;
            }
        })
})