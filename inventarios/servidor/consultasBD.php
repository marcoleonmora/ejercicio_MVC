<?php
/**
 * Proyecto:   INVENTARIOS 
 * Modulo:     SERVIDOR - CONSULTAS
 * Funciones de acceso a la BD para consultar, 
 * insertar, modificar o eliminar registros.
 **/ 

/**
 * ejecuta la consulta y devuelve datos en formato JSON
*/
function leerRegistro($cons, $datos){
	$rows = leerRegistro1($cons, $datos);
	//OJO: FALTA INCLUIR 'ok' y 'msj'
	$arr = [
		'ok' => 1,
		'msj' => '',
		'data' => $rows
	];
	echo json_encode($arr, JSON_UNESCAPED_UNICODE); 
}

/**
 *   ejecuta la consulta y devuelve datos en array
*/
function leerRegistro1($cons, $datos){
	global $pdo;
	$stmt = $pdo->prepare($cons);

	for ($i = 0; $i < count($datos); $i++) { 
			$stmt->bindValue($i+1, $datos[$i]);
	}

	$stmt->execute(); 

	//Toma todas las filas de la consulta
	$rows = array();
	foreach ($stmt as $r){
		  	$rows[] = $r;	  	
	}
	return $rows;
}

/** 
 * Consulta la existencia de un registro en la BD.
 * Si lo encuentra devuelve consulta, si no  devuelve 0.
*/
function verificarRegistro($cons, $datos){
	global $pdo;
	$stmt = $pdo->prepare($cons);
	for ($i = 0; $i < count($datos); $i++) { 
			$stmt->bindValue($i+1, $datos[$i]);
	}
	$stmt->execute();
	$rows = $stmt->fetch(PDO::FETCH_ASSOC);
	return $rows;
	
}

/** 
 * Ejecuta las consultas de prueba e inserción
 * @return: $resultado. 
 * 		-2: 'No existe FK'.
 * 		-1: 'Ya existe PK'.
 * 		 0: 'No ejecuto la consulta'.
 * 		 x: 'Numero de filas afectadas'.
*/
function actualizar($cons, $datos){
	global $pdo, $sqlTest, $sqlTest1;
	//	$guardar = true;
	$resultado = 0;							//Asume que tiene exito al actualizar
	//PRUEBA PK - NO DEBE EXISTIR
	if(strlen($sqlTest) > 0){				//En caso de probar existencia
		$stmt1 = $pdo->query($sqlTest);
		$rows = $stmt1->fetch(PDO::FETCH_ASSOC);

		if($rows){
			$resultado = -1;				//Si lo encuentra, no puede crear nuevo
		}
	}

	//PRUEBA FK - SI DEBE EXISTIR 			
	if(strlen($sqlTest1) > 0 && $resultado == 0){				//En caso de probar existencia
		$stmt1 = $pdo->query($sqlTest1);
		$rows = $stmt1->fetch(PDO::FETCH_ASSOC);

		if(!$rows){
			$resultado = -2;				//Si NO lo encuentra, no puede crear nuevo
		}
	}

	if($resultado == 0){ 							//Puede ejecutar
		$stmt = $pdo->prepare($cons);
		for ($i = 0; $i < count($datos); $i++) { 
				$stmt->bindValue($i+1, $datos[$i]);
		}

		$stmt->execute();
		$resultado = $stmt->rowCount(); //Registos afectados por la consulta
	}
	return $resultado;
}
