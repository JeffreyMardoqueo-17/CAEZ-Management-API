import { Router } from "express";
import { GetParentezcos, DeleteParentezco, PutParentezco, PostParentezco, GetParentezcoPorId } from "../controllers/Parentezco.controller";
import { validateToken } from '../helpers/JWT';
import { ValidateCreateParentezco, ValidateUpdateParentezco } from '../validators/Parentezco.validator'

const route = Router();

//ya estan las validaciones d elos inputs solo faltan las del tocken
route.get('/parentezcos', validateToken, GetParentezcos);
route.get('/parentezcos/:id', validateToken, GetParentezcoPorId);
route.post('/parentezcos', validateToken, ValidateCreateParentezco, PostParentezco);
route.delete('/parentezcos/:id', validateToken, DeleteParentezco);
route.put('/parentezcos/:id', validateToken, ValidateUpdateParentezco, PutParentezco);


export default route;