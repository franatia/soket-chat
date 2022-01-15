const crearMensaje = (nombre, mensaje) =>{

    let fecha = new Date().getTime();

    return{
        nombre,
        mensaje,
        fecha
    };

}

module.exports={
    crearMensaje
}