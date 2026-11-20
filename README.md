# Ejercicio 2 – Formulario de Registro de Clientes

## Descripción del proyecto

Aplicación web desarrollada con React que permite registrar clientes mediante un formulario. Los datos ingresados son validados y almacenados en Firebase Firestore.

## Tecnologías utilizadas

- React
- JavaScript
- Vite
- CSS
- Firebase
- Cloud Firestore
- Simple React Validator

## Funcionalidades

El formulario permite ingresar los siguientes datos:

- Nombre completo.
- Correo electrónico.
- Teléfono.
- Fecha de nacimiento.
- Tipo de cliente (Nuevo, Frecuente o Premium).
- Comentarios.

### Validaciones

Se utiliza la biblioteca `simple-react-validator` para validar los campos obligatorios y comprobar que el correo electrónico tenga un formato válido.

El sistema muestra mensajes de error cuando los datos ingresados no cumplen las condiciones establecidas.

### Base de datos

La aplicación se conecta con Firebase Firestore para almacenar los registros de clientes en la colección `clientes`.

Al guardar un registro correctamente, se muestra un mensaje de confirmación en pantalla.

## Instalación y ejecución

1. Clonar o descargar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Instalar las dependencias:

```bash
npm install
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

5. Abrir en el navegador la dirección local que entrega Vite.

## Compilación para producción

Para generar la versión de producción, ejecutar:

```bash
npm run build
```

Los archivos generados se almacenan en la carpeta `dist`.

## Configuración de Firebase

La conexión con Firebase se encuentra configurada en:

`src/firebase/config.js`

La aplicación utiliza Cloud Firestore para guardar los datos de los clientes.

Para ejecutar el proyecto con otra configuración, se debe utilizar una aplicación web de Firebase y configurar sus credenciales correspondientes.

## Autora

Vanessa Riffo

**Proyecto:** Programación de Componentes – exa-PC-Vanessa-Riffo ejercicio2-formulario