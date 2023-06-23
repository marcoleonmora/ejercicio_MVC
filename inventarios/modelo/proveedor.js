/**
 * Clase Proveedor de la capa MODELO
 */

class Proveedor extends ConexionAjax{
    constructor(dato){
        super();
        if(dato){
            this.idProveedor = dato["idProveedor"];
            this.nombreProveedor = dato["nombreProveedor"];
            this.nitProveedor = dato["nitProveedor"];
            this.direccionProveedor = dato["direccionProveedor"];
            this.correoProveedor = dato["correoProveedor"];
            this.telefonoProveedor = dato["telefonoProveedor"];
        }else{
            this.idProveedor = 0;
            this.nombreProveedor = '';
            this.nitProveedor = '';
            this.direccionProveedor = '';
            this.correoProveedor = '';
            this.telefonoProveedor = '';            
        }
    }

    /**
     * Devuelve las propiedades del objeto Proveedor
     */
    getData(){
        let data = {};
        data['idProveedor'] = this.idProveedor;
        data['nombreProveedor'] = this.nombreProveedor;
        data['nitProveedor'] = this.nitProveedor;
        data['direccionProveedor'] = this.direccionProveedor;
        data['correoProveedor'] = this.correoProveedor;
        data['telefonoProveedor'] = this.telefonoProveedor;
        return data;
    }
    /**
     * Crea un registro en la tabla Proveedor
     */
    crearProveedor(reg, retorno){
        let datoConsulta = {};
        datoConsulta['data'] = reg;
        datoConsulta['opcion'] = "crearProveedor";
        this.ejecutarAjax(datoConsulta, retorno);
    }

    /**
     * Consulta los proveedores en la BD y retorna un array
     * @param {*} retorno: Nombre de la funcion de Callback 
     */
    consultarProveedores(retorno){
        let datoConsulta = {};
        datoConsulta['data'] = [];
        datoConsulta['opcion'] = "consultarProveedores";
        this.ejecutarAjax(datoConsulta, retorno);
        console.log("paso 1- solicitar la consulta: ", datoConsulta);
    }

    modificarProveedor(reg, retorno){
        let datoConsulta = {};
        datoConsulta['data'] = reg;
        datoConsulta['opcion'] = "modificarProveedor";
        this.ejecutarAjax(datoConsulta, retorno);

    }
}
