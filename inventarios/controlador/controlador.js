/**
 * Modulo principal CAPA CONTROLADOR
 */

/**++ VARIABLES GLOBALES ++++++++++++++++++++++++++++++++++++++++++++ */
var token = '';
var vista = new Vista();    //Objeto de la clase Vista

var listaProveedores = [];      //Proveedores
var proveedor = new Proveedor();

var listaClientes = [];         //Clientes
var cliente = new Cliente();

var listaArticulos = []; 
var articulo = new Articulo();

var listaUnidades = [];

var canvas = null;  // Para la grafica de trenddencia de ventas
var ctx = null;

var nombreUsuario = '';

/**
 * Asigna manejadores de eventos a los botones del menu principal
 * Se ejecuta al cargar la pagina
 */ 
window.onload = function() {
    $("#myModalLogin").modal();
    document.getElementById("btnIngresar").addEventListener("click", ingresarUsuario);
};

function ingresarUsuario() {
  let ajax =  new ConexionAjax();
  let usr = document.getElementById("usuario").value;
  let psw = document.getElementById("password").value;
  let datoConsulta = {};
  datoConsulta['data'] = {"usuario": usr, "password": psw};
  datoConsulta['opcion'] = "consultarUsuario";
  ajax.ejecutarAjax(datoConsulta, ingresarUsuarioRetorno);
  
}

function ingresarUsuarioRetorno(reg) {
    $("#myModalLogin").modal('hide');
    if(reg['data'].length > 0){
        token = reg['token'];
        let nombre = reg['data'][0];
        document.getElementById("nombreUsuario").innerHTML = nombre['nombreUsuario'];
        activarMenu();
    }else{
        vista.mostrarModal('LOGIN', 'No existe el usuario...');   
        location.reload();
    }
}



function activarMenu() {
    document.getElementById("btnProveedor").addEventListener("click", mostrarFormCrearProv);
    document.getElementById("btnCliente").addEventListener("click", mostrarFormCrearCliente);
    document.getElementById("btnCrearProd").addEventListener("click", mostrarFormCrearProducto);
    document.getElementById("btnIngresarProd").addEventListener("click", mostrarFormIngreso);
    document.getElementById("btnVenderProd").addEventListener("click", mostrarFormVenta);
    document.getElementById("btnConsultar").addEventListener("click", mostrarTablaVentas);
    document.getElementById("btnTendencia").addEventListener("click", mostrarTendenciaVentas);
    document.getElementById("btnRentabilidad").addEventListener("click", mostrarRentabilidad);  
}

//+++++++++++++ BLOQUE CRUD PROVEEDOR +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function mostrarFormCrearProv() {
    vista.mostrarPlantilla('formProveedor', 'areaTrabajo');
    document.getElementById("btnProveedorLimpiar").addEventListener("click", limpiarFormularioProveedor);
    document.getElementById("btnProveedorModificar").addEventListener("click", modificarProveedor);
    document.getElementById("btnProveedorCrear").addEventListener("click", crearProveedor);
    document.getElementById("idProveedor").addEventListener("change", mostrarDatosProveedor);
    proveedor.consultarProveedores(consultarProveedoresRetorno);
}

function consultarProveedoresRetorno(datos) {
    listaProveedores = []; //limpia la lista
    for (let i = 0; i < datos['data'].length; i++) {
        let proveedor = new Proveedor(datos['data'][i]);
        listaProveedores.push(proveedor); 
    } 
    //Insertar en el select del formulario
    vista.cargarSelect('idProveedor', datos['data'], 'idProveedor', 'nombreProveedor');
}

function limpiarFormularioProveedor() {
    vista.limpiarFormulario('formularioProveedor');
}

/************************************************************
 * Modifica un registro en la tabla Proveedor
 */
function modificarProveedor() {
    let resultado = vista.validarDatosForm('formularioProveedor');
    if (resultado === 'ok') {
        let datos = vista.getDatosForm('formularioProveedor');
        proveedor.modificarProveedor(datos, modificarProveedorRetorno);
    } else {
        vista.mostrarModal('MODIFICAR PROVEEDOR', 'Datos no Validos: '+ resultado);
    }
}

function modificarProveedorRetorno(resp) {
    if(resp['ok'] === 1){
        vista.mostrarModal('MODIFICAR PROVEEDOR', 'Registro modificado correctamente');
        proveedor.consultarProveedores(consultarProveedoresRetorno);
    }else{
        vista.mostrarModal('MODIFICAR PROVEEDOR', 'No se pudo modificar el registro');
    }
}

/************************************************************
 * Crea un nuevo registro en la tabla Proveedor
 * los datos los toma del formulario Proveedor
 */
function crearProveedor() {
    let resultado = vista.validarDatosForm('formularioProveedor');
    if (resultado === 'ok') {
        let datos = vista.getDatosForm('formularioProveedor');
        proveedor.crearProveedor(datos, crearProveedorRetorno);
    } else {
        vista.mostrarModal('CREAR PROVEEDOR', 'Datos no Validos: '+ resultado);
    }
}

function crearProveedorRetorno(resp){
    let msj = '';
    switch (resp['ok']) {
        case -1:
            msj = 'Ya existe un Porveedor con el mismo NIT';
            break;
        case 1:
            msj = 'Proveedor creado correctamente';
            vista.limpiarFormulario('formularioProveedor');
            proveedor.consultarProveedores(consultarProveedoresRetorno);
            break;
        default:
            msj = 'No se pudo crear el registro';
            break;
    }
    vista.mostrarModal('CREAR PROVEEDOR',msj);
}

/*************************************************************
 * Carga los datos del proveedor seleccionado en el formulario
 */
function mostrarDatosProveedor() {
    //tomar el idProveedor desde el value del select
    let idProvedor = document.getElementById("idProveedor").value;
    //buscar el proveedor en la lista
    for (let i = 0; i < listaProveedores.length; i++) {
        let dato = listaProveedores[i].getData();
        if(dato['idProveedor'] === parseInt(idProvedor)){
            //desplegar los datos en el formulario
            vista.setDatosForm(dato);
            break;
        }
    }
}

//++++++++  BLOQUE CRUD CLIENTE ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function mostrarFormCrearCliente() {
    vista.mostrarPlantilla('formCliente', 'areaTrabajo');
    document.getElementById("btnClienteLimpiar").addEventListener("click", limpiarFormularioCliente);
    document.getElementById("btnClienteModificar").addEventListener("click", modificarCliente);
    document.getElementById("btnClienteCrear").addEventListener("click", crearCliente);
    document.getElementById("idCliente").addEventListener("change", mostrarDatosCliente);
    cliente.consultarClientes(consultarClientesRetorno);
}

function consultarClientesRetorno(datos) {
    listaClientes = []; //limpia la lista
    for (let i = 0; i < datos['data'].length; i++) {
        let cliente = new Cliente(datos['data'][i]);
        listaClientes.push(cliente); 
    } 
    //Insertar en el select del formulario
    vista.cargarSelect('idCliente', datos['data'], 'idCliente', 'nombreCliente');
}

/*****************************************************************
 * 
 */
function limpiarFormularioCliente() {
    vista.limpiarFormulario('formularioCliente');
}

/****************************************************************
 * Modifica los datos de un cliente
 */
function modificarCliente() {
    let resultado = vista.validarDatosForm('formularioCliente');
    if (resultado === 'ok') {
        let datos = vista.getDatosForm('formularioCliente');
        cliente.modificarCliente(datos, modificarClienteRetorno);
    } else {
        vista.mostrarModal('MODIFICAR CLIENTE', 'Datos no Validos: '+ resultado);
    } 
}

function modificarClienteRetorno(resp){
    if(resp['ok'] === 1){
        vista.mostrarModal('MODIFICAR CLIENTE', 'Registro modificado correctamente');
        cliente.consultarClientes(consultarClientesRetorno);
    }else{
        vista.mostrarModal('MODIFICAR CLIENTE', 'No se pudo modificar el registro');
    }
} 

/****************************************************************
 * Creaun nuevo cliente en la BD
 */
function crearCliente() {
    let resultado = vista.validarDatosForm('formularioCliente');
    if (resultado === 'ok') {
        let datos = vista.getDatosForm('formularioCliente');
        cliente.crearCliente(datos, crearClienteRetorno);
    } else {
        vista.mostrarModal('CREAR CLIENTE', 'Datos no Validos: '+ resultado);
    }
}

function crearClienteRetorno(resp) {
    let msj = '';
    switch (resp['ok']) {
        case -1:
            msj = 'Ya existe un Cliente con el mismo Nombre';
            break;
        case 1:
            msj = 'Cliente creado correctamente';
            vista.limpiarFormulario('formularioCliente');
            cliente.consultarClientes(consultarClientesRetorno);
            break;
        default:
            msj = 'No se pudo crear el registro';
            break;
    }
    vista.mostrarModal('CREAR CLIENTE',msj);
}

/****************************************************************
 * Despliega en el formulario los datos de un cliente
 */
function mostrarDatosCliente() {
    //tomar el idCliente desde el value del select
    let idCliente = document.getElementById("idCliente").value;
    //buscar el Cliente en la lista
    for (let i = 0; i < listaClientes.length; i++) {
        let dato = listaClientes[i].getData();
        if(dato['idCliente'] === parseInt(idCliente)){
            //desplegar los datos en el formulario
            vista.setDatosForm(dato);
            break;
        }
    }
}


//++++++++ BLOQUE CRUD ARTICULO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function mostrarFormCrearProducto() {
    vista.mostrarPlantilla('formCrearArticulo', 'areaTrabajo');
    document.getElementById("btnArticuloLimpiar").addEventListener("click", limpiarFormularioCrearProducto);
    document.getElementById("btnArticuloModificar").addEventListener("click", modificarArticulo);
    document.getElementById("btnArticuloCrear").addEventListener("click", crearArticulo);
    document.getElementById("idArticulo").addEventListener("change", mostrarDatosArticulo);
    articulo.consultarArticulos(consultarArticulosRetorno);    
}

function limpiarFormularioCrearProducto() {
    vista.limpiarFormulario('formularioCrearArticulo');
}

function consultarArticulosRetorno(datos) {
    listaArticulos = []; //limpia la lista
    for (let i = 0; i < datos['data'].length; i++) {
        let articulo = new Articulo(datos['data'][i]);
        listaArticulos.push(articulo); 
    } 
    //Insertar en el select del formulario
    vista.cargarSelect('idArticulo', datos['data'], 'idArticulo', 'nombreArticulo');
    articulo.consultarUnidades(consultarUnidadesretorno)
}

function consultarUnidadesretorno(datos) {
    listaUnidades = []; //limpia la lista
    for (let i = 0; i < datos['data'].length; i++) {
        //let articulo = new Articulo(datos['data'][i]);
        let unidad = datos['data'][i];
        listaUnidades.push(unidad);
    } 
    //Insertar en el select del formulario
    vista.cargarSelect('idUnidad', datos['data'], 'idUnidad', 'descripcion');
}
/**
 * Crea un articulo nuevo en la BD ++++++++++++++++++++++++++++++++++
 */
function crearArticulo() {
    let resultado = vista.validarDatosForm('formularioCrearArticulo');
    if (resultado === 'ok') {
        let datos = vista.getDatosForm('formularioCrearArticulo');
        articulo.crearArticulo(datos, crearArticuloRetorno);
    } else {
        vista.mostrarModal('CREAR ARTICULO', 'Datos no Validos: '+ resultado);
    }
}

function crearArticuloRetorno(resp) {
    let msj = '';
    switch (resp['ok']) {
        case -1:
            msj = 'Ya existe un Articulo con el mismo Nombre';
            break;
        case 1:
            msj = 'Articulo creado correctamente';
            vista.limpiarFormulario('formularioCrearArticulo');
            articulo.consultarArticulos(consultarArticulosRetorno);
            break;
        default:
            msj = 'No se pudo crear el registro';
            break;
    }
    vista.mostrarModal('CREAR ARTICULO',msj);
    
}
/**
 * Modifica un registro de articulo en la BD +++++++++++++++++++++++
 */
function modificarArticulo() {
    let resultado = vista.validarDatosForm('formularioCrearArticulo');
    if (resultado === 'ok') {
        let datos = vista.getDatosForm('formularioCrearArticulo');
        articulo.modificarArticulo(datos, modificarArticuloRetorno);
    } else {
        vista.mostrarModal('MODIFICAR ARTICULO', 'Datos no Validos: '+ resultado);
    } 
    
}

function modificarArticuloRetorno(resp) {
    if(resp['ok'] === 1){
        vista.mostrarModal('MODIFICAR ARTICULO', 'Artículo modificado correctamente');
        articulo.consultarArticulos(consultarArticulosRetorno);
    }else{
        vista.mostrarModal('MODIFICAR ARTICULO', 'No se pudo modificar el registro');
    }
}

/**
 * DESPLIEGA LOS articulos en el select
 */
function mostrarDatosArticulo() {
    //tomar el idCliente desde el value del select
    let idArticulo = document.getElementById("idArticulo").value;
    //buscar el Cliente en la lista
    for (let i = 0; i < listaArticulos.length; i++) {
        let dato = listaArticulos[i].getData();
        if(dato['idArticulo'] === parseInt(idArticulo)){
            //desplegar los datos en el formulario
            vista.setDatosForm(dato);
            break;
        }
    }
    
}


//++++++++ BLOQUE COMPRA PRODUCTOS +++++++++++++++++++++++++++++++++++++++++++++++++++++
function mostrarFormIngreso() {
    vista.mostrarPlantilla('formIngresoArticulo', 'areaTrabajo');
    document.getElementById("btnIngresoArticuloLimpiar").addEventListener("click", limpiarFormularioComprarProducto);
    document.getElementById("btnIngresoArticuloGuardar").addEventListener("click", ingresarArticulo);
    document.getElementById("idArticulo").addEventListener("change", mostrarUnidadArticulo);
    document.getElementById("precioCompra").addEventListener("change", mostrarTotalCompra);
    document.getElementById("cantidadCompra").addEventListener("change", mostrarTotalCompra);
    
    articulo.consultarArticulos(consultarArticulosIngresoRetorno);
    proveedor.consultarProveedores(consultarProveedoresRetorno);
}

function limpiarFormularioComprarProducto() {
    vista.limpiarFormulario('formularioIngresoArticulo');
}

function mostrarUnidadArticulo(){
    //tomar el idArticulo
    let idArticulo = document.getElementById("idArticulo").value;
    let unidad = 0;
    //Buscar en la lista de articulos
    for (let i = 0; i < listaArticulos.length; i++) {
        if(idArticulo == listaArticulos[i].idArticulo){
            unidad = listaArticulos[i].idUnidad;
            break;
        }
    }
    //leer la unidad Articulo
    let data = {'idUnidad': unidad};
    articulo.leerUnidad(data, mostrarUnidadArticuloRetorno);
}

//Desplieg ael valor total de la compra, verifica qu exista cantidad
function mostrarTotalCompra() {
    //verifica que exista cantidadCompra, sino, mensaje
    let cantidad = document.getElementById("cantidadCompra").value;
    //verifica que exista precioCompra, sino, mensaje
    let precioUnitario = document.getElementById("precioCompra").value;

    if((cantidad > 0) && (precioUnitario > 0)){
        //Muestra cantidad * preciounitario en precioTotalCompra
        document.getElementById("precioTotalCompra").value = cantidad * precioUnitario;

    } else if(precioUnitario != ''){
        vista.mostrarModal('PRECIO TOTAL', 'La cantidad  deben ser mayor a cero. ');
    }
}

//Despliega el nombre de la unidad en el formulario de ingreso de articulos
function mostrarUnidadArticuloRetorno(dato){
    //Mostrarla en el input idUnidad
    let unidad = dato['data'][0];
    document.getElementById("idUnidad").value = unidad['descripcion'];
}

function ingresarArticulo(){
    let resultado = vista.validarDatosForm('formularioIngresoArticulo');
    if (resultado === 'ok') {
        let datos = vista.getDatosForm('formularioIngresoArticulo');
        articulo.ingresarArticulo(datos, ingresarArticuloRetorno);
    } else {
        vista.mostrarModal('INGRESAR ARTICULO', 'Datos no Validos: '+ resultado);
    }
}

function ingresarArticuloRetorno(resp) {
    let msj = '';
    switch (resp['ok']) {
        case -1:
            msj = 'no se pudo ingresar el artículo';
            break;
        case 1:
            msj = 'Articulo ingresado correctamente';
            vista.limpiarFormulario('formularioIngresoArticulo');
            break;
        default:
            msj = 'No se pudo crear el registro';
            break;
    }
    vista.mostrarModal('CREAR ARTICULO',msj);
    
}

function consultarArticulosIngresoRetorno(datos){
    listaArticulos = []; //limpia la lista
    for (let i = 0; i < datos['data'].length; i++) {
        let articulo = new Articulo(datos['data'][i]);
        listaArticulos.push(articulo); 
    } 
    //Insertar en el select del formulario
    vista.cargarSelect('idArticulo', datos['data'], 'idArticulo', 'nombreArticulo');
   
}
//++++++++ BLOQUE VENTA PRODUCTOS +++++++++++++++++++++++++++++++++++++++++++++++++++++++
function mostrarFormVenta() {
    vista.mostrarPlantilla('formVentaArticulo', 'areaTrabajo');
    document.getElementById("btnVenderArticulolimpiar").addEventListener("click", limpiarFormularioVenderProducto);
    document.getElementById("btnVenderArticuloGuardar").addEventListener("click", registrarVentaArticulo);
    document.getElementById("idArticulo").addEventListener("change", mostrarDatosArticuloVenta);
    document.getElementById("cantidadVenta").addEventListener("change", mostrarTotalVenta);   
    articulo.consultarArticulos(consultarArticulosIngresoRetorno);
    cliente.consultarClientes(consultarClientesRetorno);
}

function limpiarFormularioVenderProducto() {
    vista.limpiarFormulario('formularioVenderArticulo');
}

function mostrarDatosArticuloVenta() {
    mostrarDatosArticulo();
    mostrarUnidadArticulo();
}

//Desplieg ael valor total de la compra, verifica qu exista cantidad
function mostrarTotalVenta() {
    //verifica que exista cantidadCompra, sino, mensaje
    let cantidad = document.getElementById("cantidadVenta").value;
    //verifica que exista precioCompra, sino, mensaje
    let precioUnitario = document.getElementById("precioVenta").value;

    if((cantidad > 0) && (precioUnitario > 0)){
        //Muestra cantidad * preciounitario en precioTotalCompra
        document.getElementById("precioTotalVenta").value = cantidad * precioUnitario;

    } else if(precioUnitario != ''){
        vista.mostrarModal('PRECIO TOTAL', 'La cantidad  deben ser mayor a cero. ');
    }
}


function registrarVentaArticulo() {
    let resultado = vista.validarDatosForm('formularioVenderArticulo');
    if (resultado === 'ok') {
        let datos = vista.getDatosForm('formularioVenderArticulo');
        let idCliente = parseInt(datos['idCliente']);
        if(idCliente > 0){
            articulo.registrarVentaArticulo(datos, registrarVentaArticuloRetorno);
        }else{
            vista.mostrarModal('VENDER ARTICULO', 'debe seleccionar un cliente');
        }
    } else {
        vista.mostrarModal('VENDER ARTICULO', 'Datos no Validos: '+ resultado);
    }
  
}

function registrarVentaArticuloRetorno(resp) {
    let msj = '';
    switch (resp['ok']) {
        case -1:
            msj = 'no se pudo registrar la venta';
            break;
        case 1:
            msj = 'Registro de venta correcto.';
            vista.limpiarFormulario('formularioVenderArticulo');
            break;
        default:
            msj = 'No se pudo crear el registro';
            break;
    }
    vista.mostrarModal('VENDER ARTICULO',msj);
   
}




//+++++++++ ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function mostrarTablaVentas() {
    vista.mostrarPlantilla('mostrarVentas', 'areaTrabajo');
    document.getElementById("btnMostrarVentas").addEventListener("click", mostrarVentas);
}

function mostrarVentas(){
    //Verificar que existan las fechas
    let datos = vista.getDatosForm('formularioDetalleVentas');
    if(datos['fechaIni'] == "" || datos['fechaFin']== ""){
        vista.mostrarModal('DETALLE DE VENTAS', 'Debe seleccionar las fechas inicial y la final.');
        return;
    }
    //Fecha inicial <= fecha final
    if(datos['fechaIni'] <= datos['fechaFin']){
        //Consultar la BD
        let data = {'fechaIni': datos['fechaIni'], 'fechaFin': datos['fechaFin']};
        articulo.mostrarVentas(data, mostrarVentasRetorno);

    }else{
        vista.mostrarModal('DETALLE DE VENTAS', 'La fecha inicial debe ser menor o igual a la fecha final');
    }

}

function mostrarVentasRetorno(resp){
    //mostrar las ventas en la tabla tablaDetalleVentas
    let nombreCol = ['fechaVenta', 'nombreArticulo', 'nombreCliente', 'cantidadVenta', 'descripcion', 'precioTotalventa'];
    let tituloCol = ['fecha', 'Artículo', 'Cliente', 'Cantidad', 'Descripción', 'Total Venta'];
    vista.cargarTabla('tablaDetalleVentas', resp['data'], nombreCol, tituloCol);
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function mostrarTendenciaVentas() {
    vista.mostrarPlantilla('tendenciaVentas', 'areaTrabajo');
    canvas = document.getElementById('canvasTendenciaVentas');
    ctx = canvas.getContext("2d");
    let w = window.innerWidth * 0.6;
    let h = w /1.6; //Numero aureo
    canvas.width = w;
    canvas.height = h;

    articulo.consultarTendenciaVentas(consultarTendenciaVentasRetorno);

}

function consultarTendenciaVentasRetorno(resp) {
   if(resp['ok'] == 1){
      vista.mostrarGraficaBarras(resp['data']); 
   } else{
    vista.mostrarModal('TENDENCIA DE VENTAS', 'Error en la consulta');
   }
}









//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function mostrarRentabilidad() {
    vista.mostrarPlantilla('rentabilidad', 'areaTrabajo');
    articulo.mostrarRentabilidad(mostrarRentabilidadRetorno);
}

function mostrarRentabilidadRetorno(resp) {
    //mostrar las rentabilidad en la tabla tablaRentabilidad
    let nombreCol = ['nombreArticulo',  'rentabilidad'];
    let tituloCol = ['Artículo', 'rentabilidad'];
    vista.cargarTabla('tablaRentabilidad', resp['data'], nombreCol, tituloCol);
    
}




// ++++++++++ FIN DEL CODIGO CAPA CONTROLADOR ++++++++++++++++++++++++++++++++++++++++++