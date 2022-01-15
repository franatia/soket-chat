const { io } = require('../server');

const Usuarios = require('../classes/usuarios');

const usuarios = new Usuarios();

const {crearMensaje} = require('../utils/utils');

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat',(usuario, cb)=>{
        
        if(!usuario.nombre || !usuario.sala){

            return cb({
                error:true,
                mensaje:'El nombre y la sala son necesarios'
            });

        };

        client.join(usuario.sala);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersonas',usuarios.getPersonasPorSala(usuario.sala));

        cb(usuarios.getPersonasPorSala(usuario.sala));
    })

    client.on('crearMensaje', (data)=>{

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    });

    client.on('disconnect',()=>{

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Admin', `${personaBorrada.nombre} salio`));

        client.broadcast.to(personaBorrada.sala).emit('listaPersonas',usuarios.getPersonasPorSala(personaBorrada.sala));

    })
    // Mensajes privados
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))

    })

});