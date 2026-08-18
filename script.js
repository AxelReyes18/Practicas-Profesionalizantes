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