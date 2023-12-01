document.getElementById('formulario').addEventListener('submit', async function (e) {

    e.preventDefault();
    try {
        const pass = document.getElementById('password').value;
        const mail = document.getElementById('username').value;

        localStorage.setItem("email", mail);
        localStorage.setItem("pass", pass);

        const response = await fetch('/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mail, pass })
        })

        const data = await response.json();

        if (response.ok) {
            console.log(data.token);
            localStorage.setItem("token", data.token);
            window.location.href = 'api';
        }
    } catch (err) {
        console.log(err);
    }

});