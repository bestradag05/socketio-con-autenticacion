const miFormulario = document.querySelector('form');

var url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:3000/api/auth/' // local
    : '' // producción


    miFormulario.addEventListener('submit', ev => {
        ev.preventDefault();
        const formData = {};

        for(let el of miFormulario.elements){
            if(el.name.length > 0){
                formData[el.name] = el.value
            }
        }

        fetch(url + 'login', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
        })
        .then( res => res.json())
        .then( ({msg, token}) => {
           
            if(msg) {
                return console.error(msg);
            }

            localStorage.setItem('token', token);
            window.location = "chat.html";

        })
        .catch( err => {
            console.log(err);
        })
    })


function handleCredentialResponse(response) {
    // Enviar el token al servidor para obtener información del usuario
    fetch(url + "google", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_token: response.credential })
    })
        .then(response => response.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location = "chat.html";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}