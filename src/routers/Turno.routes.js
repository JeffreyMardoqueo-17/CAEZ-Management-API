import { Router } from "express";
import { GetTurnos, GetTurnoPorId, PostTurno, DeleteTurno, PutTurno } from '../controllers/Turno.controller'; // Importa los controladores del Turno
import { validateToken } from '../helpers/JWT';
import { ValidatePostTurno, ValidatePutTurno } from '../validators/Turno.validator'

const route = Router();

// Rutas, aqui esta ya listo las validaciones, solo fatla la validaciones del tocken
route.get('/Turnos', validateToken, GetTurnos); // Ruta para obtener todos los turnos
route.get('/Turnos/:id', validateToken, GetTurnoPorId); // Ruta para obtener un turno por su ID
route.post('/Turnos', validateToken, ValidatePostTurno, PostTurno); // Ruta para insertar un nuevo turno
route.delete('/Turnos/:id', validateToken, DeleteTurno); // Ruta para eliminar un turno por su ID
route.put('/Turnos/:id', validateToken, ValidatePutTurno, PutTurno); // Ruta para actualizar un turno por su ID

export default route;