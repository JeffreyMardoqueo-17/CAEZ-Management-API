import { Router } from "express";
import { GetParentezcos, DeleteParentezco, PutParentezco, PostParentezco, GetParentezcoPorId } from "../controllers/Parentezco.controller";
import { validateToken } from '../helpers/JWT';
import { ValidateCreateParentezco, ValidateUpdateParentezco } from '../validators/Parentezco.validator'

const route = Router();

//ya estan las validaciones d elos inputs solo faltan las del tocken
route.get('/Parentezcos', GetParentezcos);
route.get('/Parentezcos/:id', GetParentezcoPorId);
route.post('/Parentezcos', ValidateCreateParentezco, PostParentezco);
route.delete('/Parentezcos/:id', DeleteParentezco);
route.put('/Parentezcos/:id', ValidateUpdateParentezco, PutParentezco);


export default route;