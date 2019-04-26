
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
var operacion = "A";
var recuperar;

// Esperar el evento de envio del formulario !!
function startDB() {
    dataBase = indexedDB.open('Registros', 1);
    dataBase.onupgradeneeded = function (e) {
        var active = dataBase.result;
        var object = active.createObjectStore("clientes", {keyPath: 'id', autoIncrement: true});
        object.createIndex('id_cliente', 'id', {unique: true});
        object.createIndex('nombre_cliente', 'nombre', {unique: false});
        object.createIndex('apellido_cliente', 'apellido', {unique: false});
        object.createIndex('cedula_cliente', 'cedula', {unique: true});
        object.createIndex('edad_cliente', 'edad', {unique: false});
        object.createIndex('sexo_cliente', 'sexo', {unique: false});
        object.createIndex('direccion_cliente', 'direccion', {unique: false});
        object.createIndex('correo_cliente', 'correo', {unique: true});
        object.createIndex('telefono_cliente', 'telefono', {unique: true});
    };

    dataBase.onsuccess = function (e) {
        //  alert('Se agrego la base de datos');
        CargaDb();
    };
    dataBase.onerror = function (e) {
        // alert('Error al cargar la base de datos');
    };
}

$("#btnSubmit").on("click", function () {
    if (validarFormulario()) {
        if (operacion == "A") {
            return add();
        } else if (operacion == "E") {
            return modificar();
        }
    }
});

$("#editar").on("click", function () {
    if (validarFormulario()) {
        return modificar();
    }
});

function add() {

    var active = dataBase.result;
    var data = active.transaction(["clientes"], "readwrite");
    var object = data.objectStore("clientes");
    var request = object.put({
        nombre: document.querySelector("#nombre").value,
        apellido: document.querySelector("#apellido").value,
        cedula: document.querySelector("#cedula").value,
        edad: document.querySelector("#edad").value,
        sexo: document.querySelector("#sexo").value,
        direccion: document.querySelector("#direccion").value,
        correo: document.querySelector("#correo").value,
        telefono: document.querySelector("#telefono").value
    });
    request.onerror = function (e) {

    };
    data.oncomplete = function (e) {
        document.querySelector('#nombre').value = '';
        document.querySelector('#apellido').value = '';
        document.querySelector('#cedula').value = '';
        document.querySelector('#edad').value = '';
        document.querySelector('#sexo').value = '';
        document.querySelector('#direccion').value = '';
        document.querySelector('#correo').value = '';
        document.querySelector('#telefono').value = '';

        $('#carga').fadeIn();
        $('#carga').fadeOut(3000);
        $('#cedula').focus();
        CargaDb();
        limpiarFormulario();
    };
}

//Refresca la Base de Datos.
function CargaDb() {
    var active = dataBase.result;
    var data = active.transaction(["clientes"], "readonly");
    var object = data.objectStore("clientes");
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();
    };
    data.oncomplete = function () {
        var outerHTML = '';
        for (var key in elements) {
            outerHTML += '\n\
                        <tr>\n\
                            <td>' + elements[key].id + '</td>\n\
                            <td>' + elements[key].nombre + '</td>\n\
                            <td>' + elements[key].apellido + '</td>\n\
                            <td>' + elements[key].cedula + '</td>\n\
                            <td>' + elements[key].edad + '</td>\n\
                            <td>' + elements[key].sexo + '</td>\n\
                            <td>' + elements[key].direccion + '</td>\n\
                            <td>' + elements[key].correo + '</td>\n\
                            <td>' + elements[key].telefono + '</td>\n\
                            <td>\n\<button type="button" onclick="recuperar(' + elements[key].id + ')" class="boton"><i class="	fa fa-cog"> &nbsp;</i>Editar</button>\n\
                            <td>\n\<button type="button" onclick="deletedate(' + elements[key].id + ')" class="boton"><i class="fas fa-trash-alt"> &nbsp;</i>Eliminar</button>\n\
                                                    </tr>';
        }
        
        var outerHTML2 = "<tr><td colspan='9'>No hay elementos que mostrar..</td></tr>"
        
        if (elements.length !== 0) {
            elements = [];
        document.querySelector("#elementsList").innerHTML = outerHTML;
        } else {
            document.querySelector("#elementsList").innerHTML = outerHTML2;
        }
        
    };
}

//Recupera todos los datos y cargo en los input y select.
function recuperar(id) {
    var active = dataBase.result;
    var data = active.transaction(["clientes"], "readonly");
    var object = data.objectStore("clientes");
    var index = object.index("id_cliente");
    var request = index.get(id);

    request.onsuccess = function () {
        var result = request.result;
        if (result !== undefined) {
            //alert("Cargando datos");
            document.querySelector('#nombre').value = result.nombre;
            document.querySelector('#apellido').value = result.apellido;
            document.querySelector('#cedula').value = result.cedula;
            document.querySelector('#edad').value = result.edad;
            document.querySelector('#sexo').value = result.sexo;
            document.querySelector('#direccion').value = result.direccion;
            document.querySelector('#correo').value = result.correo;
            document.querySelector('#telefono').value = result.telefono;

            //$('#eliminar').attr("disabled", false);
            $('#btnSubmit').attr("disabled", true);
            $('#editar').attr("disabled", false);
            $('#cedula').attr("disabled", false);
            $("#nombre").focus();
        }
    };
}

//Funcion que modifica los datos.
function modificar(cedula) {

    var active = dataBase.result;
    var data = active.transaction(["clientes"], "readwrite");
    var objectStore = data.objectStore("clientes");
    var index = objectStore.index('cedula_cliente');
    index.openCursor(cedula).onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            var updateData = cursor.value;
            updateData.nombre = document.querySelector("#nombre").value;
            updateData.apellido = document.querySelector("#apellido").value;
            updateData.cedula = document.querySelector("#cedula").value;
            updateData.edad = document.querySelector("#edad").value;
            updateData.sexo = document.querySelector("#sexo").value;
            updateData.direccion = document.querySelector("#direccion").value;
            updateData.correo = document.querySelector("#correo").value;
            updateData.telefono = document.querySelector("#telefono").value;

            var request = cursor.update(updateData);
            request.onsuccess = function () {

                CargaDb();

                limpiarFormulario();
                //alert("Cambios finalizados");
            };
            request.onerror = function () {
                alert('Error' + '/n/n' + request.error.name + '\n\n' + request.error.message);
                CargaDb();
            };
        }
    };
}

function deletedate(id) {
    var active = dataBase.result;
    var data = active.transaction(["clientes"], "readwrite");
    var object = data.objectStore("clientes");
    var request = object.delete(id);
    request.onsuccess = function () {

        $("#ci").focus();
        CargaDb();
    };
}

//Funcion que elimina los datos de la Base de Datos.
function deletedateId(cedula) {
    var active = dataBase.result;
    var data = active.transaction(["clientes"], "readwrite");
    var object = data.objectStore("clientes");
    var request = object.delete(cedula);
    request.onsuccess = function () {

        $("#ci").focus();
        CargaDb();
    };
}

function Eliminar(e) {
    dbClientes.splice(e, 1); // Args (posición en el array, numero de items a eliminar)
    localStorage.setItem("dbClientes", JSON.stringify(dbClientes));
    return Mensaje(2);
}

function Editar() {
    //console.log("Funcion editar" + d);
    dbClientes[d] = JSON.stringify({
        Nombre: $("#nombre").val(),
        Apellido: $("#apellido").val(),
        CI: $("#cedula").val(),
        Edad: $("#edad").val(),
        Sexo: $("#sexo").val(),
        Direccion: $("#direccion").val(),
        Correo: $("#correo").val(),
        Telefono: $("#telefono").val()
    });
    localStorage.setItem("dbClientes", JSON.stringify(dbClientes));
    operacion = "A"; //Regresamos el valor original
    limpiarFormulario();
    return true;
}

function limpiarFormulario() {
    $("#nombre").val("");
    $("#apellido").val("");
    $("#cedula").val("");
    $("#edad").val("");
    $("#sexo").val("");
    $("#direccion").val("");
    $("#correo").val("");
    $("#telefono").val("");
}
