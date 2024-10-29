import { Router } from 'express';
import { GetTiposDocumento, GetTipoDocumentoPorId, PostTipoDocumento, PutTipoDocumento, DeleteTipoDocumento } from '../controllers/TipoDocumento.controller';
import { validateToken } from '../helpers/JWT';
import { ValidateCreateTipoDoc, ValidateUpdateTipoDoc } from '../validators/TipoDocumento.validator'

const route = Router();

// Rutas
//ya estan las validaciones d elos inputs solo faltan las del tocken
route.get('/TiposDocumento', GetTiposDocumento);
route.get('/TiposDocumento/:id', GetTipoDocumentoPorId);
route.post('/TiposDocumento', ValidateCreateTipoDoc, PostTipoDocumento);
route.put('/TiposDocumento/:id', ValidateUpdateTipoDoc, PutTipoDocumento);
route.delete('/TiposDocumento/:id', DeleteTipoDocumento);

export default route;