import express from 'express';
import {GetFacturas, GetFacturaPorId, PostFactura} from '../controllers/Factura.controller'

const router = express.Router();

router.get('/facturas', GetFacturas);
router.get('/facturas/:id', GetFacturaPorId);
router.post('/facturas', PostFactura);

export default router;
