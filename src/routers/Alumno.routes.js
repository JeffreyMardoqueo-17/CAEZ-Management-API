import { Router } from 'express';
import AlumnoController from '../controllers/Alumno.controller';
import { validateToken } from '../helpers/JWT';

const route = Router();

// Obtener todos los alumnos
route.get('/alumnos', AlumnoController.getAllAlumnos);
route.get('/alumnos/:id', validateToken, AlumnoController.getAlumnoById);
// route.get('/alumnos/numDocumento/:numDocumento', validateToken, AlumnoController.ge);
route.post('/alumnos', validateToken, AlumnoController.createAlumno);
route.put('/alumnos/:id', validateToken, AlumnoController.updateAlumno);
route.delete('/alumnos/:id', validateToken, AlumnoController.deleteAlumno);

export default route;
