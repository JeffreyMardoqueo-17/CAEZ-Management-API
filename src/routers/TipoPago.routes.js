import { Router } from 'express';
import { GetTiposPago, GetTipoPagoPorId, PostTipoPago, PutTipoPago, DeleteTipoPago } from '../controllers/TipoPago.controller';
import { ValidateCreateTipoPago, ValidateUpdateTipoPago } from '../validators/TipoPago.validator';
import { validateToken } from '../helpers/JWT';

const route = Router();

// Rutas
//ya estan las validaciones d elos inputs solo faltan las del tocken
route.get('/TiposPago', validateToken, GetTiposPago);
route.get('/TiposPago/:id', validateToken, GetTipoPagoPorId);
route.post('/TiposPago', validateToken, ValidateCreateTipoPago, PostTipoPago);
route.put('/TiposPago/:id', validateToken, ValidateUpdateTipoPago, PutTipoPago);
route.delete('/TiposPago/:id', validateToken, DeleteTipoPago);
// route.post('/TiposPago/Buscar/',validateToken, BuscarTipoPagoPorTexto)

export default route; 