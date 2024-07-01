var url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:3000/api/auth/' // local
    : '' // producción

let usuario = null;
let socket = null;

//Referencias HTML

txtUid = document.querySelector('#txtUid');
txtMensaje = document.querySelector('#txtMensaje');
ulUsuarios = document.querySelector('#ulUsuarios');
ulMensajes = document.querySelector('#ulMensajes');
btnSalir = document.querySelector('#btnSalir');


const validarJWT = async () => {
    const token = localStorage.getItem('token'); 


    if(!token){
        window.location = 'index.html';
        throw new Error(' No hay token valido en el servidor');
    } 

     fetch( url, {
        headers: {'x-token' : token}
    })
    .then( res => res.json())
    .then(data => {

        const { usuario: userDB, token: tokenDB } = data;
        
       localStorage.setItem('token', tokenDB);
       usuario = userDB;
       document.title = usuario.nombre;

    })
    await conectarSocket();

}

const conectarSocket = async () =>{

    socket = io({ 
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    })

    socket.on('disconnect', () => {
        console.log('Sockects offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', (payload) => {
        //TODO:
        console.log('Privado: ', payload);
    })


}


const dibujarUsuarios = (usuarios = {}) => {


    let usersHtml = '';

    usuarios.forEach(({nombre, uid}) => {
        
        usersHtml += `
        
        <li> 
            <p>
                <h5 class="text-success"> ${nombre} </h5>
                <span class="fs-6 text-muted"> ${uid} </span>
            </p>
        </li>
        
        `;


    });

    ulUsuarios.innerHTML = usersHtml;

}


const dibujarMensajes = (mensajes = []) => {


    let mensajesHtml = '';

    mensajes.forEach(({nombre, mensaje}) => {
        
        mensajesHtml += `
        
        <li> 
            <p>
                <span class="text-primary"> ${ nombre } </span>
                <span> ${mensaje} </span>
            </p>
        </li>
        
        `;

    });

    ulMensajes.innerHTML = mensajesHtml;

}


txtMensaje.addEventListener('keyup', ({keyCode}) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if(keyCode !== 13){return;}
    if(mensaje.length === 0){ return;}

    socket.emit('enviar-mensaje', {uid,mensaje});

    txtMensaje.value = '';
})

const main = async () => {

    //Validar JWT
    await validarJWT();

}

main();

/* 
const socket = io();
 */
