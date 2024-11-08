import { Router } from 'express';
import { GetTiposDocumento, GetTipoDocumentoPorId, PostTipoDocumento, PutTipoDocumento, DeleteTipoDocumento } from '../controllers/TipoDocumento.controller';
import { validateToken } from '../helpers/JWT';
import { ValidateCreateTipoDoc, ValidateUpdateTipoDoc } from '../validators/TipoDocumento.validator'

const route = Router();

// Rutas
//ya estan las validaciones d elos inputs solo faltan las del tocken
route.get('/TiposDocumento', validateToken, GetTiposDocumento);
route.get('/TiposDocumento/:id', validateToken, GetTipoDocumentoPorId);
route.post('/TiposDocumento', validateToken, ValidateCreateTipoDoc, PostTipoDocumento);
route.put('/TiposDocumento/:id', validateToken, ValidateUpdateTipoDoc, PutTipoDocumento);
route.delete('/TiposDocumento/:id', validateToken, DeleteTipoDocumento);

export default route;