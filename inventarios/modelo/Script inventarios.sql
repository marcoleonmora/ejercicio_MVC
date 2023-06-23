
--
-- Base de datos: inventarios
--

CREATE TABLE descripcionUnidad (
  idUnidad int(11) NOT NULL AUTO_INCREMENT,
  descripcion varchar(50) NOT NULL
) 

CREATE TABLE articulo (
  idArticulo int(11) NOT NULL  AUTO_INCREMENT PRIMARY KEY,
  nombreArticulo varchar(50) NOT NULL,
  detallesArticulo varchar(150) NOT NULL DEFAULT '""',
  existencia decimal(6,2) NOT NULL DEFAULT 0.00,
  idUnidad int(11) NOT NULL,
  precioVenta decimal(10,2) NOT NULL,
  FOREIGN KEY (idUnidad) REFERENCES descripcionunidad(idUnidad)
) 

CREATE TABLE cliente (
  idCliente int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombreCliente varchar(100) NOT NULL,
  documentoCliente varchar(20) NOT NULL,
  direccionCliente varchar(150) NOT NULL,
  correoCliente varchar(150) DEFAULT NULL,
  telefonoCliente varchar(50) DEFAULT NULL
)

CREATE TABLE proveedor (
  idProveedor int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombreProveedor varchar(100) NOT NULL,
  nitProveedor varchar(20) NOT NULL,
  direccionProveedor varchar(150) NOT NULL,
  correoProveedor varchar(150) DEFAULT NULL,
  telefonoProveedor varchar(50) DEFAULT NULL
) 

CREATE TABLE compraArticulo (
  idArticulo int(11) NOT NULL,
  fechaCompra date NOT NULL,
  cantidadCompra decimal(6,2) NOT NULL,
  precioTotalCompra decimal(12,2) NOT NULL,
  idProveedor int(11) NOT NULL,
  FOREIGN KEY (idArticulo) REFERENCES articulo(idArticulo),
  FOREIGN KEY (idProveedor) REFERENCES proveedor(idProveedor)
) 

CREATE TABLE ventaarticulo (
  idArticulo int(11) NOT NULL,
  fechaVenta date NOT NULL,
  cantidadVenta decimal(6,2) NOT NULL,
  precioTotalVenta decimal(12,2) NOT NULL,
  idCliente int(11) NOT NULL
  FOREIGN KEY (idArticulo) REFERENCES articulo(idArticulo),
  FOREIGN KEY (idCliente) REFERENCES cliente(idCliente)
) 

