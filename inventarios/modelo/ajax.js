/**
 * Clase ABSTRACTA para conectar al servidor
 */
class ConexionAjax{
    constructor(){
    }

    /**
     * @param {array} datos //datos de la consulta.
     * @param {función} funcionRetorno  //función que ejecuta al finalizar validación. 
     */
    ejecutarAjax(datos, funcionRetorno) { //Parámetros requeridos para ejecutar.
        datos['token'] = token;
        $.ajax({
            url: 'servidor/despachador.php', //Conecta al archivo que almacena las consultas.
            data: datos,   //Consulta y parámetros.
            type: 'post'
        }).done( function (response) {
            
            let resp = JSON.parse(response); //Validar JSON.
            if (typeof resp == 'object') {
                if(resp['ok'] === -3){
                    vista.mostrarModal('PERMISO DE CONSULTA', resp['msj']);
                    return;
                }
                funcionRetorno(resp); //Ejecuta la función de retorno.
            } else {
                console.log("Error en los datos de respuesta: " + response);  //Mensaje si la función no es válida.
            }
        }).fail( function(jqXHR, textStatus, errorThrown) {
            alert( 'Error: '+ textStatus + ' '+ errorThrown);
        });
    }
}


