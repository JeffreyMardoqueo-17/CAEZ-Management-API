import { Router } from "express";
import { GetDirecciones, PostDireccion, DeleteDireccion, PutDireccion, GetDireccionPorId } from '../controllers/Direcciones.controller'
import { validateToken } from '../helpers/JWT';
import { ValidateCreateDireccion, ValidateUpdateDireccion } from '../validators/Direcciones.validator';
const route = Router();

//qui ya esta listo, las validaciones ya estas, solo falta lo del tocken
route.get('/direcciones', validateToken, GetDirecciones);
route.get('/direcciones/:id', validateToken, GetDireccionPorId);
route.post('/direcciones', validateToken, ValidateCreateDireccion, PostDireccion);
route.delete('/direcciones/:id', validateToken, DeleteDireccion);
route.put('/direcciones/:id', validateToken, ValidateUpdateDireccion, PutDireccion);

export default route;