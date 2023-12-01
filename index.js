async function fetchFunction() {

    const token = localStorage.getItem("token");

    try {
        const response = await fetch('/api', {
            method: "POST", 
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token })
        })

        const data = await response.json();

        if (response.ok) {
            console.log('c');
            console.log(data);
            response.headers.forEach(console.log);
        }

    } catch (err) {
        console.log("error front: ", err);
    }
}

fetchFunction();

const kanye = "https://api.kanye.rest/";

const p = document.querySelector('p');

async function getKanyeQuote() {
    try {
        const response = await fetch(kanye);
        const phrase = await response.json();
    
        p.textContent = phrase.quote;
        
    } catch (error) {
        p.textContent = "There was a problem with the fetch operation"
    }
}

getKanyeQuote();

document.getElementById("btn").addEventListener('click', () => {
    getKanyeQuote();
})