/**
 * Clase Cliente de la capa MODELO
 */

class Cliente extends ConexionAjax{
    constructor(dato){
        super();
        if(dato){
            this.idCliente = dato["idCliente"];
            this.nombreCliente = dato["nombreCliente"];
            this.documentoCliente = dato["documentoCliente"];
            this.direccionCliente = dato["direccionCliente"];
            this.correoCliente = dato["correoCliente"];
            this.telefonoCliente = dato["telefonoCliente"];
        }else{
            this.idCliente = 0;
            this.nombreCliente = '';
            this.documentoCliente = '';
            this.direccionCliente = '';
            this.correoCliente = '';
            this.telefonoCliente = '';            
        }
    }

    /**
     * Devuelve las propiedades del objeto Cliente
     */
    getData(){
        let data = {};
        data['idCliente'] = this.idCliente;
        data['nombreCliente'] = this.nombreCliente;
        data['documentoCliente'] = this.documentoCliente;
        data['direccionCliente'] = this.direccionCliente;
        data['correoCliente'] = this.correoCliente;
        data['telefonoCliente'] = this.telefonoCliente;
        return data;
    }
    /**
     * Crea un registro en la tabla Cliente
     */
    crearCliente(reg, retorno){
        let datoConsulta = {};
        datoConsulta['data'] = reg;
        datoConsulta['opcion'] = "crearCliente";
        this.ejecutarAjax(datoConsulta, retorno);
    }

    /**
     * Consulta los Clientes en la BD y retorna un array
     * @param {*} retorno: Nombre de la funcion de Callback 
     */
    consultarClientes(retorno){
        let datoConsulta = {};
        datoConsulta['data'] = [];
        datoConsulta['opcion'] = "consultarClientes";
        this.ejecutarAjax(datoConsulta, retorno);
    }

    modificarCliente(reg, retorno){
        let datoConsulta = {};
        datoConsulta['data'] = reg;
        datoConsulta['opcion'] = "modificarCliente";
        this.ejecutarAjax(datoConsulta, retorno);
    }
}
