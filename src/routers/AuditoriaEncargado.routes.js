import { Router } from 'express';
import AuditoriaEncargadoController from '../controllers/AuditoriaEncargado.Controller';
import { validateToken } from '../helpers/JWT';

const router = Router();

// Rutas para la auditoría de encargados
router.get('/auditoria-encargado', validateToken, AuditoriaEncargadoController.getAllAuditoria);
router.get('/auditoria-encargado/fecha', validateToken, AuditoriaEncargadoController.getAuditoriaByDateRange);
router.get('/auditoria-encargado/fecha-especifica', validateToken, AuditoriaEncargadoController.getAuditoriaBySpecificDate);

export default router;
