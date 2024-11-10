import { Router } from 'express';
import EncargadoController from '../controllers/Encargado.controller';
import { validateToken } from '../helpers/JWT';

const route = Router();

// Rutas para Encargado
route.get('/encargados', validateToken, EncargadoController.getEncargados);
route.get('/encargados/:id', validateToken, EncargadoController.getEncargadoById);
route.post('/encargados', validateToken, EncargadoController.createEncargado);
route.put('/encargados/:id', validateToken, EncargadoController.updateEncargado);
route.delete('/encargados/:id', validateToken, EncargadoController.deleteEncargado);

export default route;
