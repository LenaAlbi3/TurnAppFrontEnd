# TurnApp Frontend

Frontend de TurnApp desarrollado con Vite.

## Requisitos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión 18 o superior recomendada)
- pnpm

Para instalar pnpm globalmente:

```bash
npm install -g pnpm
```

## Instalación

Clona el repositorio:

```bash
git clone <https://github.com/aitorarz/TurnAppFront>
cd TurnAppFront
```

Instala las dependencias:

```bash
pnpm install
```

## Ejecución en desarrollo

Inicia el servidor de desarrollo:

```bash
pnpm run dev
```

## Tecnologías

- Vite
- JavaScript
- React
- pnpm

## Licencia

Proyecto privado.


## A chequear 

revisar si aitor o delfi subieron algo mas
revisar rutas en appRouter y navbar y home del archivo delfi
volver a usar gemini con las correcciones en el backend y analizar las resoluciones en el front
revisar rutas y redirect de navbar login y register/register paciente
revisar las reservas de turnos, que funcione correctamente el enrutamiento entre los botones de agendar turno en home sobre nosotros y pagina de doctores. al seleccionar un doctor en la pagina doctores debe redirigirte a reserve appointment del doctor (revisar si poner un boton de sacar turno o ver doctores, puede haber una pagina con el perfil del doctor onclick en el doctor en la pagina doctores o que directamente vayas a un formulario de sacar turno y tengas los doctores en una lista seleccionable) verificar que al sacar turno aparezca registrado en el perfil de mis turnos (doctor y paciente, crear dos usuarios para verificar que funcionen ambos). revisar como cargar foto de perfil y poner la foto de perfil predeterminada en caso de que no haya pfp cargada (principalmente en el perfil de doctor, en paciente no es tan necesaria la foto de perfil, se puede usar una pfp generica nomas)
