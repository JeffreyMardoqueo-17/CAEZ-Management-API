import express from 'express'; // Importa express
import SexoController from '../controllers/Sexo.controller';

const router = express.Router();

// Ruta para obtener todos los sexos
router.get('/sexos', SexoController.getTodosSexos);

// Ruta para obtener un sexo específico por ID
router.get('/sexos/:id', SexoController.getSexoById);

export default router;
