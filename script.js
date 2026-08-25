/* ================================= */
/* INICIO DE SESIÓN */
/* ================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const usuario =
                document.getElementById("usuario").value;

            const contraseña =
                document.getElementById("contraseña").value;


            if (
                usuario === "" ||
                contraseña === ""
            ) {

                alert(
                    "Debe completar todos los campos."
                );

                return;

            }


            if (
                usuario === "admin" &&
                contraseña === "1234"
            ) {

                window.location.href =
                    "menu.html";

            }

            else {

                alert(
                    "Usuario o contraseña incorrectos."
                );

            }

        }
    );

}


/* ================================= */
/* MOSTRAR FORMULARIO */
/* ================================= */

function mostrarFormulario(id) {

    const formularios =
        document.querySelectorAll(
            ".menu-formulario"
        );


    formularios.forEach(
        function(formulario) {

            formulario.classList.remove(
                "activo"
            );

        }
    );


    const formularioSeleccionado =
        document.getElementById(id);


    if (formularioSeleccionado) {

        formularioSeleccionado.classList.add(
            "activo"
        );

    }


    /*
        Si el usuario abre Historial,
        cargamos los viajes.
    */

    if (
        id === "historial"
    ) {

        mostrarHistorial();

    }


    /*
        Si el usuario abre PDF,
        cargamos los filtros.
    */

    if (
        id === "pdf"
    ) {

        prepararPDF();

    }

}


/* ================================= */
/* MOSTRAR SUBMENÚ */
/* ================================= */

function mostrarSubmenu(id) {

    const submenus =
        document.querySelectorAll(
            ".submenu"
        );


    submenus.forEach(
        function(submenu) {

            if (submenu.id !== id) {

                submenu.classList.remove(
                    "activo"
                );

            }

        }
    );


    const submenuSeleccionado =
        document.getElementById(id);


    if (submenuSeleccionado) {

        submenuSeleccionado.classList.toggle(
            "activo"
        );

    }

}


/* ================================= */
/* REGISTRAR CAMIONERO */
/* ================================= */

const camioneroForm =
    document.getElementById(
        "camioneroForm"
    );


if (camioneroForm) {

    camioneroForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            alert(
                "Camionero registrado correctamente."
            );


            camioneroForm.reset();

        }
    );

}


/* ================================= */
/* REGISTRAR VIAJE */
/* ================================= */

const viajeForm =
    document.getElementById(
        "viajeForm"
    );


if (viajeForm) {

    viajeForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            alert(
                "Viaje registrado correctamente."
            );


            viajeForm.reset();

        }
    );

}


/* ================================= */
/* REGISTRAR CAMIÓN */
/* ================================= */

const camionForm =
    document.getElementById(
        "camionForm"
    );


if (camionForm) {

    camionForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            alert(
                "Camión registrado correctamente."
            );


            camionForm.reset();

        }
    );

}


/* ================================= */
/* REGISTRAR TIPO DE CARGA */
/* ================================= */

const cargaForm =
    document.getElementById(
        "cargaForm"
    );


if (cargaForm) {

    cargaForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            alert(
                "Tipo de carga registrado correctamente."
            );


            cargaForm.reset();

        }
    );

}


/* ================================= */
/* MODIFICAR CAMIONEROS */
/* ================================= */

const buscarCamioneroForm =
    document.getElementById(
        "buscarCamioneroForm"
    );


if (buscarCamioneroForm) {

    buscarCamioneroForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const dni =
                document.getElementById(
                    "dniBuscarCamionero"
                ).value;


            if (dni === "") {

                alert(
                    "Debe ingresar un DNI."
                );

                return;

            }


            document.getElementById(
                "modificarUsuario"
            ).value =
                "camionero1";


            document.getElementById(
                "modificarContraseña"
            ).value =
                "1234";


            document.getElementById(
                "modificarDireccion"
            ).value =
                "Av. Principal 123";


            document.getElementById(
                "modificarTelefono"
            ).value =
                "2991234567";


            document.getElementById(
                "datosCamionero"
            ).classList.add(
                "activo"
            );

        }
    );

}


function guardarCambiosCamionero() {

    const usuario =
        document.getElementById(
            "modificarUsuario"
        ).value;


    const contraseña =
        document.getElementById(
            "modificarContraseña"
        ).value;


    const direccion =
        document.getElementById(
            "modificarDireccion"
        ).value;


    const telefono =
        document.getElementById(
            "modificarTelefono"
        ).value;


    if (
        usuario === "" ||
        contraseña === "" ||
        direccion === "" ||
        telefono === ""
    ) {

        alert(
            "Debe completar todos los campos."
        );

        return;

    }


    alert(
        "Los datos del camionero fueron modificados correctamente."
    );

}


/* ================================= */
/* MODIFICAR VIAJES */
/* ================================= */

const buscarViajeForm =
    document.getElementById(
        "buscarViajeForm"
    );


if (buscarViajeForm) {

    buscarViajeForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const idViaje =
                document.getElementById(
                    "idBuscarViaje"
                ).value;


            if (idViaje === "") {

                alert(
                    "Debe ingresar el identificador del viaje."
                );

                return;

            }


            document.getElementById(
                "modificarOrigen"
            ).value =
                "Buenos Aires";


            document.getElementById(
                "modificarDestino"
            ).value =
                "Neuquén";


            document.getElementById(
                "modificarFecha"
            ).value =
                "2026-08-18";


            document.getElementById(
                "datosViaje"
            ).classList.add(
                "activo"
            );

        }
    );

}


function guardarCambiosViaje() {

    const origen =
        document.getElementById(
            "modificarOrigen"
        ).value;


    const destino =
        document.getElementById(
            "modificarDestino"
        ).value;


    const fecha =
        document.getElementById(
            "modificarFecha"
        ).value;


    if (
        origen === "" ||
        destino === "" ||
        fecha === ""
    ) {

        alert(
            "Debe completar todos los campos."
        );

        return;

    }


    alert(
        "Los datos del viaje fueron modificados correctamente."
    );

}


/* ================================= */
/* MODIFICAR CAMIONES */
/* ================================= */

const buscarCamionForm =
    document.getElementById(
        "buscarCamionForm"
    );


if (buscarCamionForm) {

    buscarCamionForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const patente =
                document.getElementById(
                    "patenteBuscarCamion"
                ).value;


            if (patente === "") {

                alert(
                    "Debe ingresar una patente."
                );

                return;

            }


            document.getElementById(
                "modificarPatente"
            ).value =
                patente;


            document.getElementById(
                "modificarMarca"
            ).value =
                "Mercedes-Benz";


            document.getElementById(
                "modificarModelo"
            ).value =
                "Actros";


            document.getElementById(
                "modificarCapacidad"
            ).value =
                "30";


            document.getElementById(
                "modificarDniCamionero"
            ).value =
                "26233223";


            document.getElementById(
                "datosCamion"
            ).classList.add(
                "activo"
            );

        }
    );

}


function guardarCambiosCamion() {

    const patente =
        document.getElementById(
            "modificarPatente"
        ).value;


    const marca =
        document.getElementById(
            "modificarMarca"
        ).value;


    const modelo =
        document.getElementById(
            "modificarModelo"
        ).value;


    const capacidad =
        document.getElementById(
            "modificarCapacidad"
        ).value;


    const dniCamionero =
        document.getElementById(
            "modificarDniCamionero"
        ).value;


    if (
        patente === "" ||
        marca === "" ||
        modelo === "" ||
        capacidad === "" ||
        dniCamionero === ""
    ) {

        alert(
            "Debe completar todos los campos."
        );

        return;

    }


    alert(
        "Los datos del camión fueron modificados correctamente."
    );

}


/* ================================= */
/* MODIFICAR TIPOS DE CARGA */
/* ================================= */

const buscarCargaForm =
    document.getElementById(
        "buscarCargaForm"
    );


if (buscarCargaForm) {

    buscarCargaForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const idCarga =
                document.getElementById(
                    "idBuscarCarga"
                ).value;


            if (idCarga === "") {

                alert(
                    "Debe ingresar el identificador del tipo de carga."
                );

                return;

            }


            document.getElementById(
                "modificarNombreCarga"
            ).value =
                "Carga general";


            document.getElementById(
                "modificarDescripcionCarga"
            ).value =
                "Mercadería general para transporte";


            document.getElementById(
                "datosCarga"
            ).classList.add(
                "activo"
            );

        }
    );

}


function guardarCambiosCarga() {

    const nombre =
        document.getElementById(
            "modificarNombreCarga"
        ).value;


    const descripcion =
        document.getElementById(
            "modificarDescripcionCarga"
        ).value;


    if (
        nombre === "" ||
        descripcion === ""
    ) {

        alert(
            "Debe completar todos los campos."
        );

        return;

    }


    alert(
        "El tipo de carga fue modificado correctamente."
    );

}


/* ================================= */
/* ELIMINAR CAMIONEROS */
/* ================================= */

const buscarEliminarCamioneroForm =
    document.getElementById(
        "buscarEliminarCamioneroForm"
    );


if (buscarEliminarCamioneroForm) {

    buscarEliminarCamioneroForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const dni =
                document.getElementById(
                    "dniEliminarCamionero"
                ).value;


            if (dni === "") {

                alert(
                    "Debe ingresar un DNI."
                );

                return;

            }


            document.getElementById(
                "eliminarUsuario"
            ).textContent =
                "camionero1";


            document.getElementById(
                "eliminarDni"
            ).textContent =
                dni;


            document.getElementById(
                "eliminarDireccion"
            ).textContent =
                "Av. Principal 123";


            document.getElementById(
                "eliminarTelefono"
            ).textContent =
                "2991234567";


            document.getElementById(
                "datosEliminarCamionero"
            ).classList.add(
                "activo"
            );

        }
    );

}


function eliminarCamionero() {

    const confirmacion =
        confirm(
            "¿Está seguro de que desea eliminar este camionero?"
        );


    if (!confirmacion) {

        return;

    }


    alert(
        "El camionero fue eliminado correctamente."
    );


    document.getElementById(
        "datosEliminarCamionero"
    ).classList.remove(
        "activo"
    );


    document.getElementById(
        "buscarEliminarCamioneroForm"
    ).reset();

}


/* ================================= */
/* ELIMINAR VIAJES */
/* ================================= */

const buscarEliminarViajeForm =
    document.getElementById(
        "buscarEliminarViajeForm"
    );


if (buscarEliminarViajeForm) {

    buscarEliminarViajeForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "idEliminarViaje"
                ).value;


            if (id === "") {

                alert(
                    "Debe ingresar el identificador del viaje."
                );

                return;

            }


            document.getElementById(
                "eliminarIdViaje"
            ).textContent =
                id;


            document.getElementById(
                "eliminarOrigen"
            ).textContent =
                "Buenos Aires";


            document.getElementById(
                "eliminarDestino"
            ).textContent =
                "Neuquén";


            document.getElementById(
                "eliminarFecha"
            ).textContent =
                "18/08/2026";


            document.getElementById(
                "datosEliminarViaje"
            ).classList.add(
                "activo"
            );

        }
    );

}


function eliminarViaje() {

    const confirmacion =
        confirm(
            "¿Está seguro de que desea eliminar este viaje?"
        );


    if (!confirmacion) {

        return;

    }


    alert(
        "El viaje fue eliminado correctamente."
    );


    document.getElementById(
        "datosEliminarViaje"
    ).classList.remove(
        "activo"
    );


    document.getElementById(
        "buscarEliminarViajeForm"
    ).reset();

}


/* ================================= */
/* ELIMINAR CAMIONES */
/* ================================= */

const buscarEliminarCamionForm =
    document.getElementById(
        "buscarEliminarCamionForm"
    );


if (buscarEliminarCamionForm) {

    buscarEliminarCamionForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const patente =
                document.getElementById(
                    "patenteEliminarCamion"
                ).value;


            if (patente === "") {

                alert(
                    "Debe ingresar una patente."
                );

                return;

            }


            document.getElementById(
                "eliminarPatente"
            ).textContent =
                patente;


            document.getElementById(
                "eliminarMarca"
            ).textContent =
                "Mercedes-Benz";


            document.getElementById(
                "eliminarModelo"
            ).textContent =
                "Actros";


            document.getElementById(
                "eliminarCapacidad"
            ).textContent =
                "30 toneladas";


            document.getElementById(
                "eliminarDniCamionero"
            ).textContent =
                "26233223";


            document.getElementById(
                "datosEliminarCamion"
            ).classList.add(
                "activo"
            );

        }
    );

}


function eliminarCamion() {

    const confirmacion =
        confirm(
            "¿Está seguro de que desea eliminar este camión?"
        );


    if (!confirmacion) {

        return;

    }


    alert(
        "El camión fue eliminado correctamente."
    );


    document.getElementById(
        "datosEliminarCamion"
    ).classList.remove(
        "activo"
    );


    document.getElementById(
        "buscarEliminarCamionForm"
    ).reset();

}


/* ================================= */
/* ELIMINAR TIPOS DE CARGA */
/* ================================= */

const buscarEliminarCargaForm =
    document.getElementById(
        "buscarEliminarCargaForm"
    );


if (buscarEliminarCargaForm) {

    buscarEliminarCargaForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "idEliminarCarga"
                ).value;


            if (id === "") {

                alert(
                    "Debe ingresar el identificador del tipo de carga."
                );

                return;

            }


            document.getElementById(
                "eliminarIdCarga"
            ).textContent =
                id;


            document.getElementById(
                "eliminarNombreCarga"
            ).textContent =
                "Carga general";


            document.getElementById(
                "eliminarDescripcionCarga"
            ).textContent =
                "Mercadería general para transporte";


            document.getElementById(
                "datosEliminarCarga"
            ).classList.add(
                "activo"
            );

        }
    );

}


function eliminarCarga() {

    const confirmacion =
        confirm(
            "¿Está seguro de que desea eliminar este tipo de carga?"
        );


    if (!confirmacion) {

        return;

    }


    alert(
        "El tipo de carga fue eliminado correctamente."
    );


    document.getElementById(
        "datosEliminarCarga"
    ).classList.remove(
        "activo"
    );


    document.getElementById(
        "buscarEliminarCargaForm"
    ).reset();

}


/* ================================= */
/* TURNOS */
/* ================================= */

let turno = 1;


function saltarTurno() {

    turno++;


    const turnoActual =
        document.getElementById(
            "turnoActual"
        );


    if (turnoActual) {

        turnoActual.textContent =
            turno;

    }

}


/* ================================= */
/* HISTORIAL */
/* ================================= */


/*
    DATOS DE PRUEBA

    Estos datos reemplazarán a la base de datos
    mientras desarrollamos el prototipo.
*/

const viajesHistorial = [

    {
        id: 1,
        carga: "Maíz",
        cantidad: "1300 kg",
        conductor: "Juan Pérez",
        fecha: "18/08/2026",
        origen: "Buenos Aires",
        destino: "Neuquén"
    },

    {
        id: 2,
        carga: "Harina",
        cantidad: "800 kg",
        conductor: "Pedro González",
        fecha: "17/08/2026",
        origen: "Córdoba",
        destino: "Mendoza"
    },

    {
        id: 3,
        carga: "Trigo",
        cantidad: "1200 kg",
        conductor: "Juan Pérez",
        fecha: "16/08/2026",
        origen: "Rosario",
        destino: "Neuquén"
    },

    {
        id: 4,
        carga: "Maíz",
        cantidad: "1500 kg",
        conductor: "Carlos López",
        fecha: "15/08/2026",
        origen: "Santa Fe",
        destino: "Buenos Aires"
    }

];


/* ================================= */
/* MOSTRAR HISTORIAL */
/* ================================= */

function mostrarHistorial() {

    const tabla =
        document.getElementById(
            "historialTablaBody"
        );


    if (!tabla) {

        return;

    }


    tabla.innerHTML = "";


    viajesHistorial.forEach(
        function(viaje) {

            agregarViajeHistorial(
                viaje
            );

        }
    );


    document.getElementById(
        "mensajeHistorial"
    ).textContent =
        "Se muestran " +
        viajesHistorial.length +
        " viajes.";

}


/* ================================= */
/* AGREGAR VIAJE A LA TABLA */
/* ================================= */

function agregarViajeHistorial(viaje) {

    const tabla =
        document.getElementById(
            "historialTablaBody"
        );


    const fila =
        document.createElement("tr");


    fila.innerHTML = `

        <td>
            ${viaje.id}
        </td>

        <td>
            ${viaje.carga}
        </td>

        <td>
            ${viaje.cantidad}
        </td>

        <td>
            ${viaje.conductor}
        </td>

        <td>
            ${viaje.fecha}
        </td>

        <td>
            ${viaje.origen}
        </td>

        <td>
            ${viaje.destino}
        </td>

    `;


    tabla.appendChild(
        fila
    );

}


/* ================================= */
/* FILTRAR HISTORIAL */
/* ================================= */

function filtrarHistorial() {

    const tipoFiltro =
        document.getElementById(
            "filtroHistorial"
        ).value;


    const valor =
        document.getElementById(
            "valorFiltro"
        ).value
        .trim()
        .toLowerCase();


    /*
        Si no se introdujo ningún valor,
        mostramos todos los viajes.
    */

    if (valor === "") {

        mostrarHistorial();

        return;

    }


    const resultados =
        viajesHistorial.filter(
            function(viaje) {


                if (
                    tipoFiltro ===
                    "conductor"
                ) {

                    return viaje.conductor
                        .toLowerCase()
                        .includes(valor);

                }


                if (
                    tipoFiltro ===
                    "fecha"
                ) {

                    return viaje.fecha
                        .toLowerCase()
                        .includes(valor);

                }


                if (
                    tipoFiltro ===
                    "origen"
                ) {

                    return viaje.origen
                        .toLowerCase()
                        .includes(valor);

                }


                if (
                    tipoFiltro ===
                    "destino"
                ) {

                    return viaje.destino
                        .toLowerCase()
                        .includes(valor);

                }


                return true;

            }
        );


    const tabla =
        document.getElementById(
            "historialTablaBody"
        );


    tabla.innerHTML = "";


    resultados.forEach(
        function(viaje) {

            agregarViajeHistorial(
                viaje
            );

        }
    );


    const mensaje =
        document.getElementById(
            "mensajeHistorial"
        );


    if (
        resultados.length === 0
    ) {

        mensaje.textContent =
            "No se encontraron viajes.";

    }

    else {

        mensaje.textContent =
            "Se encontraron " +
            resultados.length +
            " viajes.";

    }

}


/* ================================= */
/* PDF */
/* ================================= */


/*
    PREPARAR FILTROS PDF

    Carga los conductores y tipos de carga
    disponibles a partir de los datos
    del historial.
*/

function prepararPDF() {

    const selectorConductor =
        document.getElementById(
            "pdfConductor"
        );


    const selectorCarga =
        document.getElementById(
            "pdfCarga"
        );


    if (
        !selectorConductor ||
        !selectorCarga
    ) {

        return;

    }


    /*
        Reiniciar opciones.
    */

    selectorConductor.innerHTML =
        "";


    selectorCarga.innerHTML =
        "";


    /*
        Opción general.
    */

    const opcionTodosConductores =
        document.createElement(
            "option"
        );


    opcionTodosConductores.value =
        "todos";


    opcionTodosConductores.textContent =
        "Todos";


    selectorConductor.appendChild(
        opcionTodosConductores
    );


    const opcionTodasCargas =
        document.createElement(
            "option"
        );


    opcionTodasCargas.value =
        "todos";


    opcionTodasCargas.textContent =
        "Todas";


    selectorCarga.appendChild(
        opcionTodasCargas
    );


    /*
        Arrays para evitar
        opciones duplicadas.
    */

    const conductores =
        [];


    const cargas =
        [];


    viajesHistorial.forEach(
        function(viaje) {

            if (
                !conductores.includes(
                    viaje.conductor
                )
            ) {

                conductores.push(
                    viaje.conductor
                );

            }


            if (
                !cargas.includes(
                    viaje.carga
                )
            ) {

                cargas.push(
                    viaje.carga
                );

            }

        }
    );


    /*
        Agregar conductores.
    */

    conductores.forEach(
        function(conductor) {

            const opcion =
                document.createElement(
                    "option"
                );


            opcion.value =
                conductor;


            opcion.textContent =
                conductor;


            selectorConductor.appendChild(
                opcion
            );

        }
    );


    /*
        Agregar tipos de carga.
    */

    cargas.forEach(
        function(carga) {

            const opcion =
                document.createElement(
                    "option"
                );


            opcion.value =
                carga;


            opcion.textContent =
                carga;


            selectorCarga.appendChild(
                opcion
            );

        }
    );

}


/* ================================= */
/* GENERAR PDF */
/* ================================= */

function generarPDF() {

    const selectorConductor =
        document.getElementById(
            "pdfConductor"
        );


    const selectorCarga =
        document.getElementById(
            "pdfCarga"
        );


    const campoFecha =
        document.getElementById(
            "pdfFecha"
        );


    const mensaje =
        document.getElementById(
            "mensajePDF"
        );


    if (
        !selectorConductor ||
        !selectorCarga ||
        !campoFecha
    ) {

        return;

    }


    /*
        Obtener filtros.
    */

    const conductor =
        selectorConductor.value;


    const carga =
        selectorCarga.value;


    const fecha =
        campoFecha.value;


    /*
        Filtrar viajes.
    */

    const resultados =
        viajesHistorial.filter(
            function(viaje) {

                /*
                    Filtro por conductor.
                */

                if (
                    conductor !== "todos" &&
                    viaje.conductor !== conductor
                ) {

                    return false;

                }


                /*
                    Filtro por carga.
                */

                if (
                    carga !== "todos" &&
                    viaje.carga !== carga
                ) {

                    return false;

                }


                /*
                    Filtro por fecha.
                */

                if (
                    fecha !== ""
                ) {

                    const partes =
                        fecha.split("-");


                    const fechaSeleccionada =
                        partes[2] +
                        "/" +
                        partes[1] +
                        "/" +
                        partes[0];


                    if (
                        viaje.fecha !==
                        fechaSeleccionada
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );


    /*
        No existen resultados.
    */

    if (
        resultados.length === 0
    ) {

        if (mensaje) {

            mensaje.textContent =
                "No existen viajes que coincidan con los filtros seleccionados.";


            mensaje.style.color =
                "#b22222";

        }


        return;

    }


    /*
        Verificar que jsPDF esté cargado.
    */

    if (
        typeof window.jspdf ===
        "undefined"
    ) {

        if (mensaje) {

            mensaje.textContent =
                "No se pudo cargar la librería PDF.";


            mensaje.style.color =
                "#b22222";

        }


        return;

    }


    /*
        Crear documento.
    */

    const {
        jsPDF
    } = window.jspdf;


    const documento =
        new jsPDF();


    /*
        TÍTULO.
    */

    documento.setFontSize(
        20
    );


    documento.setFont(
        "helvetica",
        "bold"
    );


    documento.text(
        "Informe de Viajes",
        14,
        20
    );


    /*
        FECHA DE GENERACIÓN.
    */

    documento.setFontSize(
        10
    );


    documento.setFont(
        "helvetica",
        "normal"
    );


    const ahora =
        new Date();


    documento.text(
        "Fecha de generación: " +
        ahora.toLocaleDateString(
            "es-AR"
        ),
        14,
        28
    );


    /*
        FILTROS UTILIZADOS.
    */

    let textoFiltros =
        "Filtros: ";


    if (
        conductor === "todos"
    ) {

        textoFiltros +=
            "Todos los conductores";

    }

    else {

        textoFiltros +=
            "Conductor: " +
            conductor;

    }


    textoFiltros +=
        " | ";


    if (
        carga === "todos"
    ) {

        textoFiltros +=
            "Todas las cargas";

    }

    else {

        textoFiltros +=
            "Carga: " +
            carga;

    }


    if (
        fecha !== ""
    ) {

        textoFiltros +=
            " | Fecha: " +
            fecha;

    }


    documento.text(
        textoFiltros,
        14,
        36
    );


    /*
        CALCULAR CANTIDAD TOTAL.
    */

    let cantidadTotal =
        0;


    resultados.forEach(
        function(viaje) {

            /*
                Ejemplo:
                "1300 kg" -> 1300
            */

            const numero =
                parseFloat(
                    viaje.cantidad
                );


            if (
                !isNaN(numero)
            ) {

                cantidadTotal +=
                    numero;

            }

        }
    );


    /*
        RESUMEN.
    */

    documento.setFontSize(
        11
    );


    documento.setFont(
        "helvetica",
        "bold"
    );


    documento.text(
        "Resumen",
        14,
        47
    );


    documento.setFont(
        "helvetica",
        "normal"
    );


    documento.text(
        "Viajes realizados: " +
        resultados.length,
        14,
        54
    );


    documento.text(
        "Cantidad transportada: " +
        cantidadTotal +
        " kg",
        14,
        61
    );


    /*
        TABLA.
    */

    const filas =
        resultados.map(
            function(viaje) {

                return [

                    viaje.id,

                    viaje.carga,

                    viaje.cantidad,

                    viaje.conductor,

                    viaje.fecha,

                    viaje.origen,

                    viaje.destino

                ];

            }
        );


    /*
        Comprobar que AutoTable
        esté disponible.
    */

    if (
        typeof documento.autoTable !==
        "function"
    ) {

        if (mensaje) {

            mensaje.textContent =
                "No se pudo cargar la extensión necesaria para crear la tabla del PDF.";


            mensaje.style.color =
                "#b22222";

        }


        return;

    }


    documento.autoTable({

        startY: 70,

        head: [[

            "Viaje",
            "Carga",
            "Cantidad",
            "Conductor",
            "Fecha",
            "Origen",
            "Destino"

        ]],

        body: filas,

        theme: "grid",

        styles: {

            fontSize: 8,

            cellPadding: 3

        },

        headStyles: {

            fontStyle: "bold"

        },

        margin: {

            left: 10,

            right: 10

        }

    });


    /*
        PIE DE PÁGINA.
    */

    const numeroPaginas =
        documento.internal
            .getNumberOfPages();


    for (
        let pagina = 1;
        pagina <= numeroPaginas;
        pagina++
    ) {

        documento.setPage(
            pagina
        );


        documento.setFontSize(
            8
        );


        documento.setFont(
            "helvetica",
            "normal"
        );


        documento.text(

            "Sistema de Gestión de Camioneros - Página " +
            pagina +
            " de " +
            numeroPaginas,

            14,

            documento.internal
                .pageSize
                .height - 10

        );

    }


    /*
        CREAR NOMBRE DEL ARCHIVO.
    */

    let nombre =
        "informe_viajes";


    if (
        conductor !== "todos"
    ) {

        nombre +=
            "_" +
            limpiarNombrePDF(
                conductor
            );

    }


    if (
        carga !== "todos"
    ) {

        nombre +=
            "_" +
            limpiarNombrePDF(
                carga
            );

    }


    if (
        fecha !== ""
    ) {

        nombre +=
            "_" +
            fecha;

    }


    nombre +=
        ".pdf";


    /*
        DESCARGAR PDF.
    */

    documento.save(
        nombre
    );


    /*
        Mostrar mensaje.
    */

    if (mensaje) {

        mensaje.textContent =
            "PDF generado correctamente.";


        mensaje.style.color =
            "#198754";

    }

}


/* ================================= */
/* LIMPIAR FILTROS PDF */
/* ================================= */

function limpiarFiltrosPDF() {

    const conductor =
        document.getElementById(
            "pdfConductor"
        );


    const carga =
        document.getElementById(
            "pdfCarga"
        );


    const fecha =
        document.getElementById(
            "pdfFecha"
        );


    const mensaje =
        document.getElementById(
            "mensajePDF"
        );


    if (conductor) {

        conductor.value =
            "todos";

    }


    if (carga) {

        carga.value =
            "todos";

    }


    if (fecha) {

        fecha.value =
            "";

    }


    if (mensaje) {

        mensaje.textContent =
            "";

    }

}


/* ================================= */
/* LIMPIAR NOMBRE DEL PDF */
/* ================================= */

function limpiarNombrePDF(
    texto
) {

    return texto

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[^a-zA-Z0-9_-]/g,
            "_"
        );

}
