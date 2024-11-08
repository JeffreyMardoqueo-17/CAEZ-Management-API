import { Router } from "express";
import { GetDirecciones, PostDireccion, DeleteDireccion, PutDireccion, GetDireccionPorId } from '../controllers/Direcciones.controller'
import { validateToken } from '../helpers/JWT';
import { ValidateCreateDireccion, ValidateUpdateDireccion } from '../validators/Direcciones.validator';
const route = Router();

//qui ya esta listo, las validaciones ya estas, solo falta lo del tocken
route.get('/Direcciones', validateToken, GetDirecciones);
route.get('/Direcciones/:id', validateToken, GetDireccionPorId);
route.post('/Direcciones', validateToken, ValidateCreateDireccion, PostDireccion);
route.delete('/Direcciones/:id', validateToken, DeleteDireccion);
route.put('/Direcciones/:id', validateToken, ValidateUpdateDireccion, PutDireccion);

export default route;