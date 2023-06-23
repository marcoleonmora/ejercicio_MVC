/**
 *  PROYECTO: control de inventarios
 * 	MODULO: VISTA
 *	PROGRAMA: vista.js
 *	ver: 1.0
 */

 /**
  * contiene funciones generales para la vista del proyecto.
  */
class Vista {
	constructor() {
    }

    /**
     * Carga FORM en DESTINO. confirma que la plantilla exista
     * @param {string} form: id de la plantilla a cargar 
     * @param {string} destino: id del elemento donde se cargará 
     */ 
    mostrarPlantilla(form, destino){
        //limpia contenido 
        let dest=  document.getElementById(destino)
        dest.innerHTML = '';
        let template = document.getElementById(form);
        if (template){	//si la plantilla existe...
            let clon = template.content.cloneNode(true);
            dest.appendChild(clon); //inserta
        }
    }

    /**
     * Limpia el contenido de los Inputs de un formulario
     * @param {*} idForm: identificador del formulario 
     */
    limpiarFormulario(idForm){
		let form = document.getElementById(idForm).elements;
		for (let i = 0; i < form.length; i++) {
            if(document.getElementById(form[i].id).tagName  === 'SELECT'){
                document.getElementById(form[i].id).value = '0';
            }else{
                document.getElementById(form[i].id).value = '';
            }
		}
    }

	/**
	 * Lee valores de los inputs de un formulario
	 * los devuelve en arreglo, cada item con el 
	 * nombre de la columna extraido del id del input
	 * Los inputs tienen su id formado por:
	 * 	nombreTabla + '_' + nombreColumna
	 */
	getDatosForm(idForm) {
		let nArray = {};
		let form = document.getElementById(idForm).elements;
		for (let i = 0; i < form.length; i++) {
			if (form[i].type != 'file') {
				//recuperar nombre de la columna
				let nCol = form[i].id;
				let k = nCol.indexOf('_') + 1;
				nCol = nCol.substring(k);
				nArray[nCol] = form[i].value;
			}

		}
		return nArray;
    }
	
	/**
	 * Toma el valor de los atributos del objeto (modelo)
	 * y las muestra en los inputs en pantalla (frmDestino),
	 * que tengan el mismo ID del nombre de cada atributo del objeto
	 * Los inputs tienen su id formado por:
	 * nombreTabla + '_' + nombreColumna
	 * @param tabla: nombre de la tabla
	 * @param modelo: array asociativo del registro a mostrar
	 */
	setDatosForm(tabla, modelo) {
		for (let key in modelo) {
			let x = tabla + '_' + key; //ensambla id del input
			let y = modelo[key];
			if (document.getElementById(x) != null) {   //Si existe el elemento
				let caja = document.getElementById(x);
				if (y === null || y === '') {
					caja.innerText = 'Click para editar!!';
				} else if (caja.type === 'datetime-local') {
					caja.value = this.convertirFecha(y);
				} else if (caja.type === 'password') {
					caja.value = '';
				} else if (caja.localName === 'div' || caja.localName === 'label') { // para editar formulas
					caja.innerHTML = y;
				} else if (caja.localName === 'img') {
					$("#proyecto_videoProyecto").attr("src", 'img/proyectos/' + y);
					// $(".form-group img").show();
				} else {
					caja.value = y; //OJO DEBE SER EL IMPUT DENTRO DEL FORM
				}
			}
		}
	}

    /** 
	 *	Valida que todos los inputs de un formulario contengan
	 *	datos, segun tipo de input
	 *	devuelte texto con 'ok' o mensaje de error
	 */
	validarDatosForm(form) {
		let elements = document.getElementById(form).elements;
		let msj = 'ok';
		for (let i = 0; i < elements.length; i++) {
			let field_type = elements[i].type.toLowerCase();
			switch (field_type) {
				case "text":
				case "textarea":  //Valida los datos tipo texto.
					//case "hidden":
					if (elements[i].value.length == 0)
						msj = 'Los campos deben contener texto';
					break;

				case "password":  //Valida los password.
					if (elements[i].value.length < 5)
						msj = 'El password debe tener al menos cinco caracteres';
					break;
				case "email":   //Valida los email.
					if (!this.isEmail(elements[i].value))
						msj = 'No es un correo electronico valido';
					break;

				case "select-one":  
				case "select-multi":   //Valida los datos tipo input.
					if (elements[i].value < 0)
						msj = 'Debe seleccionar una opción';
					break;

				case "number":    //Valida los datos tipo numerico.
					if (!elements[i].hidden) {
						if (elements[i].value < 1)
							msj = 'Debe digitar un numero positivo, mayor a cero';
					}
					break;

				case "date":    //Valida los datos tipo fecha.
					if (!this.validarFecha(elements[i])) {
						msj = 'Debe ingresar una fecha válida';
					}
					break;
				case "week":    //Valida los datos tipo fecha, especificando semana.
					if (!this.validarFecha(elements[i])) {
						msj = 'Debe ingresar una fecha.';
					}
					break;
				default:
					break;
			}
		}
		return msj;
    }
    
    /**
     * Verifica una cadena como correo valido
     * @param {string} email 
     */
	isEmail(email) {
		let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	}

	/**
	 * Desplieg una ventana modal con titulo y mensaje
	 * @param {string} titulo: título de la ventana modal 
	 * @param {string} msj: contenido del cuerpo de la ventana modal 
	 */
	mostrarModal(titulo,msj){
		document.getElementById('modal-titulo').innerHTML = titulo;
		document.getElementById('modal-cuerpo').innerHTML = msj;
		$("#myModal").modal(); //Muestra la ventana  modal
	}

    /**
     * Despliega una lista en un select
     * @param {string} select: id del select en el html 
     * @param {array} lista: array de datos a desplegar en el select 
     * @param {string} key: nombre del campo de valor 
     * @param {string} txtMostrar: nombre del campo a visualizar 
     */
	cargarSelect(select, lista, key, txtMostrar) {
		console.log("paso 4- datos a desplegar en el Select: ", lista);
		$('#' + select + ' option').remove();
		$('#' + select).append('<option value= 0>Seleccione una opción...</option>');
		for (let j = 0; j < lista.length; j++) {
			this.cargarOption(lista[j], key, txtMostrar, select)
		}
	}

    /**
     * Metodo auxiliar de cargarSelect
     * @param {array} reg: registro con datos a insertar en un option del select
     * @param {string} key: nombre del campo a cargar en value del option
     * @param {string} txtMostrar: nombre del campo a mostrar en el option
     * @param {string} select: id del select en el html
     */
	cargarOption(reg, key, txtMostrar, select) {
		$('#' + select).append('<option value= '
			+ reg[key] + ' >'
			+ reg[txtMostrar]
			+ '</option>'
		);
	}
	
	/**
	 * Toma el valor de los atributos del objeto (modelo)
	 * y las muestra en los inputs presentes en pantalla 
	 * que tengan el mismo ID del nombre de cada atributo del objeto
	 * @param modelo: array asociativo del registro a mostrar
	 */
	setDatosForm(modelo) {
		for (let key in modelo) {
			let x =  key; // id del input
			let y = modelo[key]; //Valor
			let caja = document.getElementById(x);
			if (caja) {   //Si existe el elemento
				if (caja.type === 'datetime-local') {
					caja.value = y.substring(0, 10) + 'T' + y.substring(11);
				} else if (caja.type === 'password') {
					caja.value = '';
				} else {
					caja.value = y; 
				}
			}
		}
	}

	/**
	 * 
	 * @param {input} form tipo Fecha
	 */
	validarFecha(form) {
		// regular expression to match required date format
		let re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
		if (form.value == '' && !form.value.match(re)) {
			return false;
		}
		return true;
	}

	/**
	 * 
	 * @param {string} idTabla: ID de la tabla a crear 
	 * @param {array<obj>} dato: Lista de Datos a mostrar 
	 * @param {array<string>} columnas: Lista con nombres de las columnas 
	 * @param {array<string>} titulos: Lista con titulos a 
	 */
	cargarTabla(idTabla, dato, columnas, titulos) {
		document.getElementById(idTabla).innerHTML = '';    //Limpia la tabla, evita que se cree varias veces la misma tabla
		let tabla = document.getElementById(idTabla);   //Carga el sitio donde se crea la tabla.
		this.cargarTitulosTabla(tabla, titulos);
		let body = document.createElement("tbody");
		tabla.appendChild(body);
		
		for (let i = 0; i < dato.length; i++) {
			let tr = document.createElement("tr");
			body.appendChild(tr); 					//Crea una fila para cada dato.
			tr.innerHTML = this.cargarFilaTabla(dato[i], columnas);

		}
	}
	
	
	cargarTitulosTabla(tabla, titulos) {
		if (titulos) {
			let head = document.createElement("thead");
			let tr = document.createElement("tr");
			tabla.appendChild(head);
			head.appendChild(tr);
			titulos.forEach(function (titulo) {  //Crea un thead para cada titulo en el array.
				let th = document.createElement("th");
				th.innerHTML = titulo;
				tr.appendChild(th);  //dibuja los titulos de la tabla
			});
		}
	}


	cargarFilaTabla(reg, columnas){
		let fila = '';
		for (let i = 0; i < columnas.length; i++) {
			fila += '<td>' + reg[columnas[i]] + '</td>';
		}
		return fila;

	}

	/**
	 * Realiza una grafica de lineas en el canvas, con el array dato
	 * @param {array} dato: Lista de datos a mostrar 
	 */
	mostrarGrafica(dato){
		//contar numero de registros
		let numReg = dato.length;
		//Encontrar el ancho para cada registro de datos
		let pasoHoriz = (canvas.width - 30)/ numReg;
		//Buscar el valor mas alto
		let maxVal = parseFloat(dato[0]['ventas']);
		for (let i = 1; i < dato.length; i++) {
			if(parseFloat(dato[i]['ventas']) > maxVal){
				maxVal = parseFloat(dato[i]['ventas']);
			}
		}
		//Calcular escala vertical
		let escVert = maxVal/(canvas.height - 30);
		//Marcar la escala vertical en pesos y la horizontal
		ctx.fillStyle = '#EEE8E4';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'black';
			ctx.moveTo(20, 5);
			ctx.lineTo(20, canvas.height -25);
			ctx.lineTo(canvas.width -10, canvas.height -25);
			let deltaH = (canvas.height - 30)/10;
			for (let i = 0; i < 10; i++) {
				ctx.moveTo(10 , 5 + deltaH * i);
				ctx.lineTo(20, 5+ deltaH * i);	
			}
		ctx.stroke();


		//Para cada registro de dato

			//Dibujar una linea desde el valor anterior
		ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'blue';

			ctx.fillStyle = "#ff00ff";
			ctx.font = "15px Arial";
			ctx.textAlign = "end";

			let valY = canvas.height - 10 - (dato[0]['ventas'] / escVert);
			ctx.moveTo(pasoHoriz/2, valY);
			for (let i = 0; i < dato.length; i++) {
				valY = canvas.height - 10 - (dato[i]['ventas'] / escVert);
				ctx.lineTo((pasoHoriz * (i + 1)) - (pasoHoriz/2), valY);
				
				//Texto con el valor
				let valtext = Math.round(parseInt(dato[i]['ventas']/1000));
				ctx.fillText(valtext + 'K', (pasoHoriz * (i + 1)) - (pasoHoriz/2), valY-5);
			}
		ctx.stroke();
	}

	/**
	 * Realiza una grafica de barras, con el array dato
	 * @param {array} dato: Lista de datos a mostrar  
	 */
	mostrarGraficaBarras(dato){
		//contar numero de registros
		let numReg = dato.length;
		//Encontrar el ancho para cada registro de datos
		let pasoHoriz = (canvas.width - 30)/ numReg;
		//Buscar el valor mas alto
		let maxVal = parseFloat(dato[0]['ventas']);
		for (let i = 1; i < dato.length; i++) {
			if(parseFloat(dato[i]['ventas']) > maxVal){
				maxVal = parseFloat(dato[i]['ventas']);
			}
		}
		//Calcular escala vertical
		let escVert = maxVal/(canvas.height - 30);
		//Marcar la escala vertical en pesos y la horizontal
		ctx.fillStyle = '#EEE8E4';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'black';
			ctx.moveTo(20, 5);
			ctx.lineTo(20, canvas.height -25);
			ctx.lineTo(canvas.width -10, canvas.height -25);
			let deltaH = (canvas.height - 30)/10;
			for (let i = 0; i < 10; i++) {
				ctx.moveTo(10 , 5 + deltaH * i);
				ctx.lineTo(20, 5+ deltaH * i);	
			}
		ctx.stroke();

		//Dibujar una linea desde el valor anterior
		ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'blue';

			ctx.fillStyle = "#ff00ff";
			ctx.font = "15px Arial";
			
			let valY = canvas.height - 10 - (dato[0]['ventas'] / escVert);
			//ctx.moveTo(pasoHoriz/2, valY);
			for (let i = 0; i < dato.length; i++) {
				valY = canvas.height - 10 - (dato[i]['ventas'] / escVert);
				
				ctx.fillRect((pasoHoriz * i) + (pasoHoriz/5), valY, pasoHoriz-20, (canvas.height -25) - valY);
			}
			ctx.stroke();
			
		ctx.textAlign = "center";
		ctx.fillStyle = "black";
		for (let i = 0; i < dato.length; i++) {
			let valtext = Math.round(parseInt(dato[i]['ventas']/1000));
			valY = canvas.height - 10 - (dato[i]['ventas'] / escVert);
			ctx.fillText(valtext + 'K', pasoHoriz * i  + (pasoHoriz/2), valY - 5);
		}

	}
}


/*
Math.round(x)


*/