import { Router } from "express";
import { GetTurnos, GetTurnoPorId, PostTurno, DeleteTurno, PutTurno } from '../controllers/Turno.controller'; // Importa los controladores del Turno
import { validateToken } from '../helpers/JWT';
import { ValidatePostTurno, ValidatePutTurno } from '../validators/Turno.validator'

const route = Router();

// Rutas, aqui esta ya listo las validaciones, solo fatla la validaciones del tocken
route.get('/Turnos', GetTurnos); // Ruta para obtener todos los turnos
route.get('/Turnos/:id', GetTurnoPorId); // Ruta para obtener un turno por su ID
route.post('/Turnos', ValidatePostTurno, PostTurno); // Ruta para insertar un nuevo turno
route.delete('/Turnos/:id', DeleteTurno); // Ruta para eliminar un turno por su ID
route.put('/Turnos/:id', ValidatePutTurno, PutTurno); // Ruta para actualizar un turno por su ID

export default route;