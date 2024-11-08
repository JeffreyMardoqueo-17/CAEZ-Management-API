import { Router } from "express";
import { GetParentezcos, DeleteParentezco, PutParentezco, PostParentezco, GetParentezcoPorId } from "../controllers/Parentezco.controller";
import { validateToken } from '../helpers/JWT';
import { ValidateCreateParentezco, ValidateUpdateParentezco } from '../validators/Parentezco.validator'

const route = Router();

//ya estan las validaciones d elos inputs solo faltan las del tocken
route.get('/Parentezcos', validateToken, GetParentezcos);
route.get('/Parentezcos/:id', validateToken, GetParentezcoPorId);
route.post('/Parentezcos', validateToken, ValidateCreateParentezco, PostParentezco);
route.delete('/Parentezcos/:id', validateToken, DeleteParentezco);
route.put('/Parentezcos/:id', validateToken, ValidateUpdateParentezco, PutParentezco);


export default route;