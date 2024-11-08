import express from 'express'; // Importa express
import SexoController from '../controllers/Sexo.controller';
import { validateToken } from '../helpers/JWT';

const router = express.Router();

// Ruta para obtener todos los sexos
router.get('/sexos', validateToken, SexoController.getTodosSexos);

// Ruta para obtener un sexo específico por ID
router.get('/sexos/:id', validateToken, SexoController.getSexoById);

export default router;
