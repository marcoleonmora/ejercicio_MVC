/**
 * Clase Articulo de la capa MODELO
 */

class Articulo extends ConexionAjax{
    constructor(dato){
        super();
        if(dato){
            this.idArticulo = dato["idArticulo"];
            this.nombreArticulo = dato["nombreArticulo"];
            this.detallesArticulo = dato["detallesArticulo"];
            this.existencia = dato["existencia"];
            this.idUnidad = dato["idUnidad"];
            this.precioVenta = dato["precioVenta"];
        }else{
            this.idArticulo = 0;
            this.nombreArticulo = '';
            this.detallesArticulo = '';
            this.existencia = '';
            this.idUnidad = '';
            this.precioVenta = '';            
        }
    }

    /**
     * Devuelve las propiedades del objeto Articulo
     */
    getData(){
        let data = {};
        data['idArticulo'] = this.idArticulo;
        data['nombreArticulo'] = this.nombreArticulo;
        data['detallesArticulo'] = this.detallesArticulo;
        data['existencia'] = this.existencia;
        data['idUnidad'] = this.idUnidad;
        data['precioVenta'] = this.precioVenta;
        return data;
    }
    /**
     * Crea un registro en la tabla Articulo
     */
    crearArticulo(reg, retorno){
        let datoConsulta = {};
        datoConsulta['data'] = reg;
        datoConsulta['opcion'] = "crearArticulo";
        this.ejecutarAjax(datoConsulta, retorno);
    }

    /**
     * Consulta los Articulos en la BD y retorna un array
     * @param {*} retorno: Nombre de la funcion de Callback 
     */
    consultarArticulos(retorno){
        let datoConsulta = {};
        datoConsulta['data'] = [];
        datoConsulta['opcion'] = "consultarArticulos";
        this.ejecutarAjax(datoConsulta, retorno);
    }

    modificarArticulo(reg, retorno){
        let datoConsulta = {};
        datoConsulta['data'] = reg;
        datoConsulta['opcion'] = "modificarArticulo";
        this.ejecutarAjax(datoConsulta, retorno);
    }

    consultarUnidades(retorno){
        let datoConsulta = {};
        datoConsulta['data'] = [];
        datoConsulta['opcion'] = "consultarUnidades";
        this.ejecutarAjax(datoConsulta, retorno);
    }

    ingresarArticulo(reg, retorno){
        let datoConsulta = {};
        datoConsulta['data'] = reg;
        datoConsulta['opcion'] = "ingresarArticulo";
        this.ejecutarAjax(datoConsulta, retorno);
    }

    registrarVentaArticulo(reg, retorno){
        let datoConsulta = {};
        datoConsulta['data'] = reg;
        datoConsulta['opcion'] = "venderArticulo";
        this.ejecutarAjax(datoConsulta, retorno);
    }  

    mostrarVentas(reg, retorno){
        let datoConsulta = {};
        datoConsulta['data'] = reg;
        datoConsulta['opcion'] = "mostrarVentas";
        this.ejecutarAjax(datoConsulta, retorno);
    } 

    leerUnidad(reg, retorno){
        let datoConsulta = {};
        datoConsulta['data'] = reg;
        datoConsulta['opcion'] = "consultarUnidad";
        this.ejecutarAjax(datoConsulta, retorno);        
    }

    mostrarRentabilidad(retorno){
        let datoConsulta = {};
        datoConsulta['data'] = [];
        datoConsulta['opcion'] = "consultarRentabidad";
        this.ejecutarAjax(datoConsulta, retorno);
    } 

    consultarTendenciaVentas(retorno){
        let datoConsulta = {};
        datoConsulta['data'] = [];
        datoConsulta['opcion'] = "consultarTendenciaVentas";
        this.ejecutarAjax(datoConsulta, retorno);
    } 



}