<?php
/***
  	PROYECTO: INVENTARIOS
 	MODULO: SERVIDOR - CONEXION BD
 	PROGRAMA: conexionBD.php
 	Realiza la conexion a la BD via PDO
 	Es utilizado por DESPACHADOR.PHP
 	Feb/15/2020
*/

/* DATOS SERVIDOR LOCAL:  */
$host = 'localhost';  
$db   = 'inventarios';
$user = 'root';
$pass = '';
$charset = 'utf8';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [ 
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
	$pdo = new PDO($dsn, $user, $pass, $options);
	
}catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

