import { Router } from 'express';
// import pago from '../controllers/Pago.controller'; // Asegúrate de que el path sea correcto
import PagoController from '../controllers/Pago.controller';
import { validateToken } from '../helpers/JWT'; // Middleware de autenticación

const route = Router();

// Definición de rutas para pagos
route.get('/pagos', validateToken, PagoController.getAllPagos); // Obtener todos los pagos
route.post('/pagos/documento', validateToken, PagoController.getPagosByNumDocumento);

route.post('/pagos', validateToken, PagoController.createPago); // Crear un nuevo pago
// route.put('/pagos/:id', validateToken, PagoController.updatePago); // Actualizar un pago existente
// route.delete('/pagos/:id', validateToken, PagoController.anularPago); // Anular un pago

export default route;
