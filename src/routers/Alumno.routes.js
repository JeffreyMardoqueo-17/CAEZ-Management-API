import { Router } from 'express';
import AlumnoController from '../controllers/Alumno.controller'; // Asegúrate de que el path sea correcto
import { validateToken } from '../helpers/JWT'; // Si tienes middleware de autenticación

const route = Router();

// Definición de rutas
route.get('/alumnos', AlumnoController.getAllAlumnos); // Asegúrate de que "getAllAlumnos" exista
route.get('/alumnos/:id', validateToken, AlumnoController.getAlumnoById);
route.get('/alumnos/numDocumento/:numDocumento', validateToken, AlumnoController.getAlumnoByNumDocumento);
route.post('/alumnos', validateToken, AlumnoController.createAlumno);
route.put('/alumnos/:id', validateToken, AlumnoController.updateAlumno);
route.put('/alumnos/mass-update', validateToken, AlumnoController.massUpdateAlumnos); // Ruta para actualización masiva
route.delete('/alumnos/:id', validateToken, AlumnoController.deleteAlumno);

export default route;
