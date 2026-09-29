// ==========================================
// 1. CONTROL DE SESIÓN Y RUTAS AUTOMÁTICAS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const esPaginaCamionero = document.getElementById("camionero-nombre-display");
    const esPaginaAdmin = document.getElementById("app-admin");

    const rolActual = localStorage.getItem("rol");

    // A. LÓGICA EN PÁGINA DE LOGIN (index.html)
    if (loginForm) {
        if (rolActual === "camionero") {
            window.location.href = "camionero.html";
            return;
        } else if (rolActual === "admin") {
            window.location.href = "menu.html";
            return;
        }

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const userInput = document.getElementById("usuario").value;
            const passInput = document.getElementById("contraseña").value;

            try {
                const res = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario: userInput, password: passInput })
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem("usuario", data.usuario);
                    localStorage.setItem("rol", data.rol);
                    localStorage.setItem("camionero_id", data.camionero_id || "");

                    if (data.rol === "camionero") {
                        window.location.href = "camionero.html";
                    } else {
                        window.location.href = "menu.html";
                    }
                } else {
                    alert("Acceso denegado: " + data.error);
                }
            } catch (err) {
                alert("Error al conectar con el servidor.");
            }
        });
    }

    // B. LÓGICA EN PANEL DEL CAMIONERO (camionero.html)
    if (esPaginaCamionero) {
        if (rolActual !== "camionero") {
            cerrarSesion();
            return;
        }
        cargarPerfilCamionero();
    }

    // C. LÓGICA EN PANEL DEL ADMINISTRADOR (menu.html)
    if (esPaginaAdmin) {
        if (rolActual !== "admin") {
            cerrarSesion();
            return;
        }
        inicializarEventosAdmin();
    }
});

function cerrarSesion() {
    localStorage.clear();
    window.location.href = "index.html";
}

// ==========================================
// 2. FUNCIONES EXCLUSIVAS DEL CAMIONERO
// ==========================================
async function cargarPerfilCamionero() {
    const camioneroId = localStorage.getItem("camionero_id");
    if (!camioneroId) return;

    try {
        const res = await fetch(`http://localhost:3000/api/camionero/${camioneroId}/disponibilidad`);
        const data = await res.json();

        if (res.ok) {
            const displayNombre = document.getElementById("camionero-nombre-display");
            if (displayNombre) displayNombre.textContent = `${data.nombre} ${data.apellido}`;
            actualizarBadgeUI(data.disponible || data.disponibile);
        }
    } catch (err) {
        console.error("Error al cargar perfil:", err);
    }
}

async function cambiarMiDisponibilidad(nuevoEstado) {
    const camioneroId = localStorage.getItem("camionero_id");
    const divMensaje = document.getElementById("mensaje-camionero");

    try {
        const res = await fetch(`http://localhost:3000/api/camionero/${camioneroId}/disponibilidad`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nuevoEstado })
        });

        const data = await res.json();

        if (res.ok) {
            actualizarBadgeUI(nuevoEstado);
            if (divMensaje) {
                divMensaje.className = "mensaje-resultado exito";
                divMensaje.textContent = data.mensaje;
            }
        } else {
            if (divMensaje) {
                divMensaje.className = "mensaje-resultado error";
                divMensaje.textContent = data.error;
            }
        }
    } catch (err) {
        if (divMensaje) {
            divMensaje.className = "mensaje-resultado error";
            divMensaje.textContent = "Error al actualizar la disponibilidad.";
        }
    }
}

function actualizarBadgeUI(estado) {
    const badge = document.getElementById("badge-disponibilidad");
    if (!badge) return;

    badge.textContent = estado;
    if (estado === "Disponible" || estado === "1") {
        badge.style.backgroundColor = "#dcfce7";
        badge.style.color = "#15803d";
    } else {
        badge.style.backgroundColor = "#fee2e2";
        badge.style.color = "#b91c1c";
    }
}

// ==========================================
// 3. FUNCIONES EXCLUSIVAS DEL ADMINISTRADOR
// ==========================================
function mostrarSeccion(idSeccion, boton) {
    const secciones = document.querySelectorAll('.modulo-seccion');
    secciones.forEach(sec => sec.classList.remove('active'));

    const botones = document.querySelectorAll('.nav-btn');
    botones.forEach(btn => btn.classList.remove('active'));

    const seccionObjetivo = document.getElementById(idSeccion);
    if (seccionObjetivo) seccionObjetivo.classList.add('active');
    if (boton) boton.classList.add('active');

    if (idSeccion === 'sec-validar-disponibilidad') {
        cargarOpcionesDisponibilidad();
    }
}

let dniSeleccionadoModificar = null;
let dniAEliminar = null;

function inicializarEventosAdmin() {
    // Registrar
    const formRegistrar = document.getElementById("form-registrar-camionero");
    if (formRegistrar) {
        formRegistrar.addEventListener("submit", async (e) => {
            e.preventDefault();
            const datos = {
                nombre: document.getElementById("reg-nombre").value.trim(),
                apellido: document.getElementById("reg-apellido").value.trim(),
                dni: document.getElementById("reg-dni").value.trim(),
                telefono: document.getElementById("reg-telefono").value.trim()
            };

            try {
                const res = await fetch('http://localhost:3000/api/camioneros', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                const data = await res.json();
                const divMensaje = document.getElementById("mensaje-registro");

                if (res.ok) {
                    divMensaje.className = "mensaje-resultado exito";
                    divMensaje.textContent = data.mensaje;
                    formRegistrar.reset();
                } else {
                    divMensaje.className = "mensaje-resultado error";
                    divMensaje.textContent = data.error;
                }
            } catch (error) {
                alert("Error al conectar con el servidor.");
            }
        });
    }

    // Buscar para Modificar
    const formBuscarMod = document.getElementById("form-buscar-modificar");
    if (formBuscarMod) {
        formBuscarMod.addEventListener("submit", async (e) => {
            e.preventDefault();
            const dni = document.getElementById("mod-buscar-dni").value.trim();
            const divMensaje = document.getElementById("mensaje-modificar");
            const formGuardarMod = document.getElementById("form-guardar-modificacion");

            try {
                const res = await fetch(`http://localhost:3000/api/camioneros/${dni}`);
                const data = await res.json();

                if (res.ok) {
                    dniSeleccionadoModificar = dni;
                    document.getElementById("mod-nombre").value = data.nombre;
                    document.getElementById("mod-apellido").value = data.apellido;
                    document.getElementById("mod-telefono").value = data.telefono;
                    
                    formGuardarMod.style.display = "flex";
                    divMensaje.style.display = "none";
                } else {
                    formGuardarMod.style.display = "none";
                    divMensaje.className = "mensaje-resultado error";
                    divMensaje.textContent = data.error;
                }
            } catch (error) {
                alert("Error al conectar con el servidor.");
            }
        });
    }

    // Guardar Modificación
    const formGuardarMod = document.getElementById("form-guardar-modificacion");
    if (formGuardarMod) {
        formGuardarMod.addEventListener("submit", async (e) => {
            e.preventDefault();
            const divMensaje = document.getElementById("mensaje-modificar");

            const datosActualizados = {
                nombre: document.getElementById("mod-nombre").value.trim(),
                apellido: document.getElementById("mod-apellido").value.trim(),
                telefono: document.getElementById("mod-telefono").value.trim()
            };

            try {
                const res = await fetch(`http://localhost:3000/api/camioneros/${dniSeleccionadoModificar}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosActualizados)
                });
                const data = await res.json();

                if (res.ok) {
                    divMensaje.className = "mensaje-resultado exito";
                    divMensaje.textContent = data.mensaje;
                } else {
                    divMensaje.className = "mensaje-resultado error";
                    divMensaje.textContent = data.error;
                }
            } catch (error) {
                alert("Error al conectar con el servidor.");
            }
        });
    }

    // Buscar para Eliminar
    const formBuscarEli = document.getElementById("form-buscar-eliminar");
    if (formBuscarEli) {
        formBuscarEli.addEventListener("submit", async (e) => {
            e.preventDefault();
            const dniInput = document.getElementById("eli-buscar-dni").value.trim();
            const divMensaje = document.getElementById("mensaje-eliminar");
            const cardConfirmar = document.getElementById("card-confirmar-eliminar");

            try {
                const res = await fetch(`http://localhost:3000/api/camioneros/${dniInput}`);
                const data = await res.json();

                if (res.ok) {
                    dniAEliminar = dniInput;
                    document.getElementById("eli-info-nombre").textContent = data.nombre;
                    document.getElementById("eli-info-apellido").textContent = data.apellido;
                    document.getElementById("eli-info-telefono").textContent = data.telefono;
                    
                    cardConfirmar.style.display = "block";
                    divMensaje.style.display = "none";
                } else {
                    cardConfirmar.style.display = "none";
                    divMensaje.className = "mensaje-resultado error";
                    divMensaje.textContent = data.error || "Camionero no encontrado.";
                }
            } catch (error) {
                alert("Error al conectar con el servidor.");
            }
        });
    }

    // Consultar Historial
    const formHistorial = document.getElementById("form-buscar-historial");
    if (formHistorial) {
        formHistorial.addEventListener("submit", async (e) => {
            e.preventDefault();
            const dni = document.getElementById("his-buscar-dni").value.trim();
            const divMensaje = document.getElementById("mensaje-historial");
            const contenedorTabla = document.getElementById("contenedor-tabla-historial");
            const tbody = document.getElementById("tabla-historial-body");

            try {
                const res = await fetch(`http://localhost:3000/api/historial/${dni}`);
                const data = await res.json();

                if (res.ok) {
                    tbody.innerHTML = "";
                    data.forEach(viaje => {
                        const fila = document.createElement("tr");
                        fila.style.borderBottom = "1px solid #e2e8f0";
                        fila.innerHTML = `
                            <td style="padding: 10px;">#${viaje.id}</td>
                            <td style="padding: 10px;">${viaje.origen}</td>
                            <td style="padding: 10px;">${viaje.destino}</td>
                            <td style="padding: 10px;">${viaje.fecha}</td>
                            <td style="padding: 10px;"><strong>${viaje.estado}</strong></td>
                        `;
                        tbody.appendChild(fila);
                    });

                    contenedorTabla.style.display = "block";
                    divMensaje.style.display = "none";
                } else {
                    contenedorTabla.style.display = "none";
                    divMensaje.className = "mensaje-resultado error";
                    divMensaje.textContent = data.error;
                }
            } catch (error) {
                alert("Error al conectar con el servidor.");
            }
        });
    }

    // Generar Informe Conductor
    const formInforme = document.getElementById("form-generar-informe");
    if (formInforme) {
        formInforme.addEventListener("submit", async (e) => {
            e.preventDefault();
            const dni = document.getElementById("inf-buscar-dni").value.trim();
            const divMensaje = document.getElementById("mensaje-informe");
            const contenedorReporte = document.getElementById("contenedor-reporte-conductor");
            const tbody = document.getElementById("tabla-informe-body");

            try {
                const res = await fetch(`http://localhost:3000/api/informes/conductor/${dni}`);
                const data = await res.json();

                if (res.ok) {
                    document.getElementById("inf-nombre-conductor").textContent = data.conductor;
                    document.getElementById("inf-dni-conductor").textContent = data.dni;
                    
                    tbody.innerHTML = "";
                    if (data.viajes.length === 0) {
                        tbody.innerHTML = `<tr><td colspan="6" style="padding: 12px; text-align: center; color: #64748b;">El conductor no posee viajes registrados.</td></tr>`;
                    } else {
                        data.viajes.forEach(viaje => {
                            const fila = document.createElement("tr");
                            fila.style.borderBottom = "1px solid #e2e8f0";
                            fila.innerHTML = `
                                <td style="padding: 10px;">#${viaje.id}</td>
                                <td style="padding: 10px;">${viaje.origen}</td>
                                <td style="padding: 10px;">${viaje.destino}</td>
                                <td style="padding: 10px;"><strong>${viaje.carga || 'Carga General'}</strong></td>
                                <td style="padding: 10px;">${viaje.fecha}</td>
                                <td style="padding: 10px;">${viaje.estado}</td>
                            `;
                            tbody.appendChild(fila);
                        });
                    }

                    contenedorReporte.style.display = "block";
                    divMensaje.style.display = "none";
                } else {
                    contenedorReporte.style.display = "none";
                    divMensaje.className = "mensaje-resultado error";
                    divMensaje.textContent = data.error;
                }
            } catch (error) {
                alert("Error al conectar con el servidor.");
            }
        });
    }
}

async function ejecutarEliminacion() {
    const divMensaje = document.getElementById("mensaje-eliminar");
    const cardConfirmar = document.getElementById("card-confirmar-eliminar");

    if (!dniAEliminar) {
        divMensaje.className = "mensaje-resultado error";
        divMensaje.textContent = "Primero debes buscar un camionero válido.";
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/camioneros/eliminar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dni: dniAEliminar })
        });

        const data = await res.json();

        if (res.ok) {
            divMensaje.className = "mensaje-resultado exito";
            divMensaje.textContent = data.mensaje;
            cardConfirmar.style.display = "none";
            document.getElementById("form-buscar-eliminar").reset();
            dniAEliminar = null;
        } else {
            divMensaje.className = "mensaje-resultado error";
            divMensaje.textContent = data.error || "No se pudo eliminar el camionero.";
        }
    } catch (error) {
        divMensaje.className = "mensaje-resultado error";
        divMensaje.textContent = "Error al conectar con el servidor.";
    }
}

async function cargarInformeResumen() {
    const divMensaje = document.getElementById("mensaje-informe");
    const contenedor = document.getElementById("contenedor-informe");

    try {
        const res = await fetch('http://localhost:3000/api/informes/resumen');
        const data = await res.json();

        if (res.ok) {
            document.getElementById("inf-total-camioneros").textContent = data.totalCamioneros;
            document.getElementById("inf-camioneros-activos").textContent = data.camionerosActivos;
            document.getElementById("inf-total-viajes").textContent = data.totalViajes;

            contenedor.style.display = "block";
            divMensaje.style.display = "none";
        } else {
            contenedor.style.display = "none";
            divMensaje.className = "mensaje-resultado error";
            divMensaje.textContent = data.error || "No se pudo generar el informe.";
        }
    } catch (error) {
        alert("Error al conectar con el servidor.");
    }
}

async function consultarTurnoActual(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const display = document.getElementById("display-turno-actual");
    const divMensaje = document.getElementById("mensaje-turno");

    try {
        const res = await fetch('http://localhost:3000/api/turnos/actual');
        const data = await res.json();

        if (res.ok) {
            display.textContent = data.turnoActual;
            divMensaje.style.display = "none";
        } else {
            divMensaje.className = "mensaje-resultado error";
            divMensaje.textContent = data.error;
        }
    } catch (error) {
        divMensaje.className = "mensaje-resultado error";
        divMensaje.textContent = "Error al conectar con el servidor.";
    }
}

async function saltarTurno(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const display = document.getElementById("display-turno-actual");
    const divMensaje = document.getElementById("mensaje-turno");

    try {
        const res = await fetch('http://localhost:3000/api/turnos/saltar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();

        if (res.ok) {
            display.textContent = data.nuevoTurno;
            divMensaje.className = "mensaje-resultado exito";
            divMensaje.textContent = `Turno actualizado a #${data.nuevoTurno}`;
        } else {
            divMensaje.className = "mensaje-resultado error";
            divMensaje.textContent = data.error;
        }
    } catch (error) {
        divMensaje.className = "mensaje-resultado error";
        divMensaje.textContent = "Error al intentar saltar el turno.";
    }
}

async function cargarOpcionesDisponibilidad() {
    const selectCamionero = document.getElementById("select-camionero-disp");
    const selectViaje = document.getElementById("select-viaje-disp");

    if (!selectCamionero || !selectViaje) return;

    try {
        const res = await fetch('http://localhost:3000/api/disponibilidad/opciones');
        const data = await res.json();

        if (res.ok) {
            selectCamionero.innerHTML = '<option value="">-- Seleccionar Camionero --</option>';
            data.camioneros.forEach(c => {
                const estadoTexto = (c.disponible === 'Disponible' || c.disponible == 1) ? 'Disponible' : 'No disponible';
                selectCamionero.innerHTML += `<option value="${c.id}">${c.nombre} ${c.apellido} (${estadoTexto})</option>`;
            });

            selectViaje.innerHTML = '<option value="">-- Seleccionar Viaje --</option>';
            data.viajes.forEach(v => {
                selectViaje.innerHTML += `<option value="${v.id}">Viaje #${v.id}: ${v.origen} -> ${v.destino}</option>`;
            });
        }
    } catch (error) {
        console.error("Error al cargar opciones:", error);
    }
}

async function ejecutarAsignacionValidada(e) {
    if (e) e.preventDefault();

    const camioneroId = document.getElementById("select-camionero-disp").value;
    const viajeId = document.getElementById("select-viaje-disp").value;
    const divMensaje = document.getElementById("mensaje-disponibilidad");

    try {
        const res = await fetch('http://localhost:3000/api/viajes/asignar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ camioneroId, viajeId })
        });

        const data = await res.json();

        if (res.ok) {
            divMensaje.className = "mensaje-resultado exito";
            divMensaje.textContent = data.mensaje;
            cargarOpcionesDisponibilidad();
        } else {
            divMensaje.className = "mensaje-resultado error";
            divMensaje.textContent = data.error;
        }
    } catch (error) {
        divMensaje.className = "mensaje-resultado error";
        divMensaje.textContent = "Error al conectar con el servidor.";
    }
}
