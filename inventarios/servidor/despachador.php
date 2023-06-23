<?php
session_start();
/**
 * Proyecto:    INVENTARIOS
 * Modulo:      SERVIDOR - DESPACHADOR
 * Recibe las solicitudes de datos desde el cliente. 
 * Encamina la solicitud al proveedor de datos o devuelve error.
 * La respuesta debe contener:
 * 'ok' = 0/1 (error/exito) u otros valores, explicados en 'msj'
 * 'msj' = texto con el mensaje de error, o vacio
 * 'data' = vacio o con el array de datos devueto al cliente, en formato JSON
 */

include_once 'conexionBD.php';
include_once 'consultasBD.php';

$sqlTest = '';      //Para prueba de PK
$sqlTest1 = '';     //Para prueba de FK
$datos = array();   //Valores a pasar al PDO

$maxTime = 2000;  //Maximo tiempo de inactividad

if (isset($_POST['opcion'])) {
    if($_POST['opcion'] == 'consultarUsuario'){
        $cons = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ?';
        $data = $_POST["data"];
        $datos[0] = $data["usuario"];
        $datos[1] = md5($data["password"]);
        $usuario  = leerRegistro1($cons, $datos);
        if(sizeof($usuario) > 0){
            //crear varibles de sesion, enviar token y nombre
            $_SESSION["time"] = date('Y-m-d H:i:s'); //Fecha hora actual
            $_SESSION["token"] =  md5($_SESSION["time"]. $data["password"]);
            $arr = [
                'ok' => 1,
                'msj' => '',
                'token' => $_SESSION["token"],
                'data' => $usuario
            ];
            echo json_encode($arr, JSON_UNESCAPED_UNICODE); 

        }else{
            //eliminar cualquier variable de sesion, si existe y enviar mensaje          
            session_unset();  //remove all session variables
            session_destroy(); // destroy the session 
            //FALTA enviar respuesta 
        }
        
    } else {
        if (isset($_SESSION["token"]) && $_SESSION["token"] == $_POST["token"]) {
            $fecha1 = strtotime($_SESSION["time"]);
            $fecha2 = strtotime(date('Y-m-d H:i:s'));
            $difTime = $fecha2 - $fecha1;
            if($difTime > $maxTime){
                //eliminar cualquier variable de sesion, si existe y enviar mensaje          
                session_unset();  //remove all session variables
                session_destroy(); // destroy the session 

                $arr['ok'] = -3;
                $arr['msj'] = 'Excedio el tiempo inactivo.';
                $arr['data'] = '';
                echo json_encode($arr, JSON_UNESCAPED_UNICODE);
                return;     //Termina           
            } else {
                $_SESSION["time"] = date('Y-m-d H:i:s');
                realizarConsulta();
            }
        } else {
            //eliminar cualquier variable de sesion, si existe y enviar mensaje          
            session_unset();  //remove all session variables
            session_destroy(); // destroy the session 
            $arr['ok'] = -3;
            $arr['msj'] = 'No tiene permiso de consultar';
            $arr['data'] = '';
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
            return;     //Termina            
        }
    }
} else {
    $arr['ok'] = 0;
    $arr['msj'] = 'Acceso denegado, que desea?';
    $arr['data'] = '';
    echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    return;     //Termina
}


function realizarConsulta(){
    global $sqlTest, $sqlTest1, $datos;

    switch ($_POST['opcion']) {   //Opcion de consulta solicitada
            
        //---------PROCESOS DEL MODULO PROVEEDOR -----------------------------
        case 'crearProveedor': 
            $data = $_POST["data"];
            $sqlTest = 'SELECT idProveedor FROM proveedor WHERE nitProveedor = '. $data["nitProveedor"];
            $cons = 'INSERT INTO proveedor (nombreProveedor, nitProveedor, direccionProveedor, correoProveedor, telefonoProveedor)
            VALUES (?, ?, ?, ?, ?)';
            $datos[0] = $data["nombreProveedor"];
            $datos[1] = $data["nitProveedor"];
            $datos[2] = $data["direccionProveedor"];
            $datos[3] = $data["correoProveedor"];
            $datos[4] = $data["telefonoProveedor"];
            
            $reg = actualizar($cons, $datos);
            $arr = array('ok' => $reg);
            $arr['msj'] = '';
            $arr['data'] = '';
            echo json_encode($arr);
            break;
         
        case 'consultarProveedores':
            $cons = 'SELECT * FROM proveedor';
            leerRegistro($cons, $datos);
            break;

        case 'modificarProveedor':
            $data = $_POST["data"];
            $cons = 'UPDATE proveedor SET nombreProveedor = ?, nitProveedor = ?, direccionProveedor = ?, correoProveedor = ?, telefonoProveedor = ? where idProveedor = ?';
            $datos[0] = $data["nombreProveedor"];
            $datos[1] = $data["nitProveedor"];
            $datos[2] = $data["direccionProveedor"];
            $datos[3] = $data["correoProveedor"];
            $datos[4] = $data["telefonoProveedor"];
            $datos[5] = $data["idProveedor"];
            $reg = actualizar($cons, $datos);
            $arr['ok'] = $reg;
            $arr['msj'] = '';
            $arr['data'] = '';
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
            break;

        //---------PROCESOS DEL MODULO CLIENTE -----------------------------
        case 'consultarClientes':
            $cons = 'SELECT * FROM cliente';
            leerRegistro($cons, $datos);
            break;

        case 'crearCliente':
            $data = $_POST["data"];
            $sqlTest = 'SELECT idCliente FROM cliente WHERE nombreCliente = "'. $data["nombreCliente"]. '"';
            $cons = 'INSERT INTO cliente (nombreCliente, documentoCliente, direccionCliente, correoCliente, telefonoCliente)
                VALUES (?, ?, ?, ?, ?)';
            $datos[0] = $data["nombreCliente"];
            $datos[1] = $data["documentoCliente"];
            $datos[2] = $data["direccionCliente"];
            $datos[3] = $data["correoCliente"];
            $datos[4] = $data["telefonoCliente"];

            $reg = actualizar($cons, $datos);
            $arr = array('ok' => $reg);
            $arr['msj'] = '';
            $arr['data'] = '';
            echo json_encode($arr);
            break;
        
        case 'modificarCliente':
            $data = $_POST["data"];
            $cons = 'UPDATE cliente SET nombreCliente = ?, documentoCliente = ?, direccionCliente = ?, correoCliente = ?, telefonoCliente = ? where idCliente = ?';
            $datos[0] = $data["nombreCliente"];
            $datos[1] = $data["documentoCliente"];
            $datos[2] = $data["direccionCliente"];
            $datos[3] = $data["correoCliente"];
            $datos[4] = $data["telefonoCliente"];
            $datos[5] = $data["idCliente"];
            $reg = actualizar($cons, $datos);
            $arr['ok'] = $reg;
            $arr['msj'] = '';
            $arr['data'] = '';
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
            break;
                        

            //---------PROCESOS DEL MODULO ARTICULO -----------------------------
            case 'consultarArticulos':
            $cons = 'SELECT * FROM articulo';
            leerRegistro($cons, $datos);
            break;

        case 'crearArticulo':
            $data = $_POST["data"];
            $sqlTest = 'SELECT idArticulo FROM articulo WHERE nombreArticulo = "'. $data["nombreArticulo"]. '"';
            $cons = 'INSERT INTO articulo (nombreArticulo, detallesArticulo, existencia, idUnidad, precioVenta)
                VALUES (?, ?, ?, ?, ?)';
            $datos[0] = $data["nombreArticulo"];
            $datos[1] = $data["detallesArticulo"];
            $datos[2] = 0;
            $datos[3] = $data["idUnidad"];
            $datos[4] = $data["precioVenta"];

            $reg = actualizar($cons, $datos);
            $arr = array('ok' => $reg);
            $arr['msj'] = '';
            $arr['data'] = '';
            echo json_encode($arr);
            break;
        
        case 'modificarArticulo':
            $data = $_POST["data"];
            $cons = 'UPDATE articulo SET nombreArticulo = ?, detallesArticulo = ?,  idUnidad = ?, precioVenta = ? where idArticulo = ?';
            $datos[0] = $data["nombreArticulo"];
            $datos[1] = $data["detallesArticulo"];
            $datos[2] = $data["idUnidad"];
            $datos[3] = $data["precioVenta"];
            $datos[4] = $data["idArticulo"];
            $reg = actualizar($cons, $datos);
            $arr['ok'] = $reg;
            $arr['msj'] = '';
            $arr['data'] = '';
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
            break;
            
        case 'consultarUnidades':
            $cons = 'SELECT * FROM descripcionunidad';
            leerRegistro($cons, $datos);
            break;

            case 'ingresarArticulo':
                $data = $_POST["data"];
            //$sqlTest = 'SELECT idArticulo FROM articulo WHERE nombreArticulo = "'. $data["nombreArticulo"]. '"';
            $cons = 'INSERT INTO compraarticulo (idArticulo, fechaCompra, cantidadCompra, precioTotalCompra, idProveedor)
            values (?, ?, ?, ?, ?)';
            $datos[0] = $data["idArticulo"];
            $datos[1] = $data["fechaCompra"];
            $datos[2] = $data["cantidadCompra"];
            $datos[3] = $data["precioTotalCompra"];
            $datos[4] = $data["idProveedor"];
            //idArticulo, fechaCompra, cantidadCompra, precioTotalCompra, idProveedor
            $reg = actualizar($cons, $datos);
            $arr = array('ok' => $reg);
            $arr['msj'] = '';
            $arr['data'] = '';
            echo json_encode($arr);
            
            break;
            
        case 'venderArticulo':
            $data = $_POST["data"];
            $cons = 'INSERT INTO ventaarticulo (idArticulo, fechaVenta, cantidadVenta, precioTotalVenta, idCliente)
            values (?, ?, ?, ?, ?)';
            $datos[0] = $data["idArticulo"];
            $datos[1] = $data["fechaVenta"];
            $datos[2] = $data["cantidadVenta"];
            $datos[3] = $data["precioTotalVenta"];
            $datos[4] = $data["idCliente"];
            //idArticulo, fechaCompra, cantidadCompra, precioTotalCompra, idProveedor
            $reg = actualizar($cons, $datos);
            $arr = array('ok' => $reg);
            $arr['msj'] = '';
            $arr['data'] = '';
            echo json_encode($arr);
    
            break;

                
        case 'mostrarVentas':
            $cons = 'SELECT VA.fechaVenta, A.nombreArticulo, C.nombreCliente, VA.cantidadVenta, 
            D.descripcion, VA.precioTotalventa FROM ventaarticulo VA JOIN articulo A ON VA.idArticulo = A.idArticulo
            JOIN cliente C ON VA.idCliente = C.idCliente JOIN descripcionunidad D ON A.idUnidad = D.idUnidad WHERE VA.fechaVenta >= ? AND VA.fechaVenta <= ? ORDER BY VA.fechaVenta';
            $data = $_POST["data"];
            $datos[0] = $data["fechaIni"];
            $datos[1] = $data["fechaFin"];

            leerRegistro($cons, $datos);
            break;
            
            //-----------------------------------------------------------------------

            case 'consultarUnidad':  //Devuelve el nombre de la unidad de medida, para un idUnidad
            $cons = 'SELECT descripcion FROM descripcionUnidad WHERE idUnidad = ?';
            $data = $_POST["data"];
            $datos[0] = $data["idUnidad"];
            leerRegistro($cons, $datos);
            break;

        case 'consultarRentabidad':  
            $cons = 'SELECT nombreArticulo, FORMAT (precioVenta/valorCompra, 2)  as rentabilidad 
            FROM articulo ORDER BY rentabilidad DESC';
            leerRegistro($cons, $datos);
            break;
        
            
            case 'consultarTendenciaVentas':  
                $cons = 'select fechaVenta, sum(precioTotalVenta) as ventas from ventaarticulo group by fechaVenta order by fechaVenta'; 
                leerRegistro($cons, $datos);
                break;
    
        default:
            $arr['ok'] = 0;
            $arr['msj'] = 'Opcion equivocada...';
            $arr['data'] = '';
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
            return;     //Termina  
    }

}
