# Descripción del Proyecto API-CAEZ

El proyecto API-CAEZ es una API RESTful desarrollada utilizando Node.js, Express y SQL Server para gestionar información sobre parentezcos. La API se conecta a una base de datos SQL Server utilizando Stored Procedures (SP) para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en la tabla Parentezco.

La arquitectura de la API sigue el patrón MVC (Modelo-Vista-Controlador), donde los controladores manejan las solicitudes HTTP, interactúan con la base de datos utilizando los SP y devuelven las respuestas adecuadas.

## Operaciones CRUD:

- **Obtener todos los parentezcos (GET):**
  - Método: GET
  - Ruta: /Parentezcos
  - Descripción: Obtiene todos los parentezcos existentes en la base de datos.

- **Obtener un parentezco por su ID (GET):**
  - Método: GET
  - Ruta: /Parentezcos/:id
  - Descripción: Obtiene un parentezco específico por su ID.

- **Agregar un nuevo parentezco (POST):**
  - Método: POST
  - Ruta: /Parentezcos
  - Descripción: Agrega un nuevo parentezco a la base de datos.

- **Actualizar un parentezco por su ID (PUT):**
  - Método: PUT
  - Ruta: /Parentezcos/:id
  - Descripción: Actualiza un parentezco existente en la base de datos.

- **Eliminar un parentezco por su ID (DELETE):**
  - Método: DELETE
  - Ruta: /Parentezcos/:id
  - Descripción: Elimina un parentezco de la base de datos por su ID.

La API utiliza un enfoque modular y escalable, permitiendo la adición de nuevas funcionalidades y la expansión a otras entidades relacionadas en el futuro. La implementación de los SP garantiza un acceso seguro y eficiente a la base de datos, optimizando el rendimiento de la API.

Para las validaciones, se utiliza Express Validator. La API se integra con SQL Server para almacenar y gestionar los datos de manera eficiente.

![Diagrama de la API]![image](https://github.com/JeffreyMardoqueo-17/API-CAEZ-/assets/126411958/17a08ec7-d0da-4d07-8be5-c380ba24864a)


