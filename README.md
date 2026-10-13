# Practicas-Profesionalizantes
Repositorio de proyecto escolar para el centro de transportistas de Humboldt.

Sistema Logístico Express - Guía de Instalación y Ejecución

Esta guía contiene los pasos necesarios para instalar, configurar y ejecutar la aplicación Sistema Logístico Express en su entorno local.

Prerrequisitos

Antes de comenzar, asegúrese de tener instalado en su equipo:

Node.js: Versión 16.x o superior (Descargar Node.js).

NPM: Incluido automáticamente al instalar Node.js.

Navegador Web: Google Chrome, Mozilla Firefox, Microsoft Edge o Brave.

Estructura del Proyecto

Verifique que todos los archivos requeridos estén situados en la misma carpeta raíz del proyecto:

SISTEMA-LOGISTICO/
├── server.js          # Servidor Backend Express & SQLite
├── index.html         # Pantalla de Login / Inicio de Sesión
├── menu.html          # Panel de Control del Administrador
├── camionero.html     # Portal Web para Choferes
├── style.css          # Hoja de Estilos Generales e Impresión
├── logo.png           # Imagen del Isologotipo Corporativo
├── package.json       # Configuración de Dependencias
└── README.md          # Manual de Ejecución


Nota: La base de datos relacional sistema.db se creará automáticamente en la raíz en la primera ejecución del servidor si no existe.

⚙️ Pasos de Instalación y Configuración

1. Descargar o Ubicar el Proyecto

Abra una terminal o ventana de consola (PowerShell, CMD o Terminal de Bash) y diríjase a la carpeta raíz donde están ubicados los archivos del sistema:

cd ruta/a/tu/carpeta/SISTEMA-LOGISTICO


2. Instalar las Dependencias

Ejecute el siguiente comando para descargar e instalar los paquetes de Node.js necesarios (express, sqlite3, cors):

npm install


🚀 Ejecución del Sistema

Opción A: Ejecución en Modo Producción / Estándar

Inicie el servidor backend ejecutando el siguiente comando:

npm start


O bien mediante Node directamente:

node server.js


Si el servidor se inició correctamente, observará un mensaje en la consola similar a:

Servidor backend corriendo en http://localhost:3000
Base de datos SQLite conectada correctamente.


Opción B: Ejecución en Modo Desarrollo (Auto-recarga)

Si desea que el servidor se reinicie automáticamente ante cualquier cambio realizado en el archivo server.js:

npm run dev


🌐 Acceso a las Pantallas de la Aplicación

Una vez que el servidor esté en ejecución en la consola (manteniendo esa ventana abierta):

Pantalla Principal de Login (index.html):

Abra su navegador e ingrese a la dirección donde esté sirviendo sus archivos estáticos (por ejemplo, con la extensión Live Server de VS Code: http://127.0.0.1:5500/index.html o abriendo directamente el archivo index.html en el navegador).

Credenciales de Acceso Iniciales:

Administrador:

Usuario: admin (Tolera mayúsculas/minúsculas)

Contraseña: 1234

Choferes / Camioneros:

Usuario: Nombre del chofer registrado (ej. Juan)

Contraseña: Número de DNI sin puntos (ej. 12345678)

🛠️ Solución de Problemas Frecuentes

Error EADDRINUSE: address already in use :::3000:
Indica que la llamada al puerto 3000 está ocupada por otra instancia. Cierre las consolas abiertas anteriormente o cambie la constante PORT en server.js.

Error de conexión con la API en el cliente (Error al conectar con el servidor backend):
Asegúrese de que node server.js continúe ejecutándose en la consola y que no haya sido cerrado.

Los cambios de disponibilidad/viajes no se reflejan:
Refresque la pantalla del navegador (F5 o Ctrl + R) para forzar una nueva petición fetch a la API REST.

Sistema Web de Gestión Logística y Control Cíclico de Turnos.
