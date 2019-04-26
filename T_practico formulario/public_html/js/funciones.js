function soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode;
    return ((key >= 48 && key <= 57) || (key == 8));
}

function soloLetras(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    especiales = [8, 37, 39, 46];

    tecla_especial = false
    for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if (letras.indexOf(tecla) == -1 && !tecla_especial)
        return false;
}

/*Completar los campos de textos*/
function validarFormulario() {
    var valor = true;
    if ($("#nombre").val().trim() === "") {
        valor = false;
        $("#nombre").focus();
    }

    if ($("#apellido").val().trim() === "") {
        valor = false;
        $("#apellido").focus();
    }
    
     if ($("#cedula").val().trim() === "") {
        valor = false;
        $("#cedula").focus();
    }

    if ($("#edad").val().trim() === "") {
        valor = false;
        $("#edad").focus();
    }
    if ($("#sexo").val().trim() === "") {
        valor = false;
        $("#sexo").focus();
    }
    if ($("#direccion").val().trim() === "") {
        valor = false;
        $("#direccion").focus();
    }
    if ($("#correo").val().trim() === "") {
        valor = false;
        $("#correo").focus();
    }
    if ($("#telefono").val().trim() === "") {
        valor = false;
        $("#telefono").focus();
    }

    return valor;
}

/*Formateo de numero*/

function dar_formato_numero(numero, separador_decimal, separador_miles) {
    var fnumero = "";
    var snumero = numero.toString().replace(/\./g, "");
    snumero = snumero.replace(/[a-z]|_|%/ig, "");
    var pdecimal = snumero.indexOf(",");
    var psigno = snumero.indexOf("-");
    var enumero = snumero;
    var edecimal = "";
    var esigno = "";
    if (psigno !== -1) {
        esigno = "-";
        enumero = snumero.substr(1, snumero.length);
    }
    if (pdecimal !== -1) {
        if (psigno === -1) {
            enumero = snumero.substr(0, pdecimal);
        } else {
            enumero = snumero.substr(1, pdecimal - 1);
        }
        edecimal = snumero.substr(pdecimal, snumero.length);
        console.log("--> " + enumero);
    }
    var longitud = enumero.length;
    for (pos = longitud - 1; pos >= 0; pos--) {
        var cnumero = enumero.charAt(pos);
        fnumero = cnumero + fnumero;
        if ((longitud - pos) !== longitud) {
            if ((longitud - pos) % 3 === 0) {
                fnumero = separador_miles + fnumero;
            }
        }
    }
    fnumero = esigno + fnumero + edecimal;
    return fnumero;
}

function formatearNumero(id) {
    var tecla = event.which;
    if (tecla !== 37 && tecla !== 38 && tecla !== 39 && tecla !== 40 && tecla !== 9) {
        var monto = $(id).val();
        $(id).val(dar_formato_numero(monto, ",", "."));
    }
}
