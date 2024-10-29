import express from "express";
import { GetRoles, GetRolPorId, PutRol, PostRol, DeleteRol } from '../controllers/Role.controller';
import { validateToken } from '../helpers/JWT';
import { ValidateCreateRole, ValidateUpdateRole } from '../validators/Role.validator'

const route = express.Router();

route.get('/Role', GetRoles);
route.get('/Role/:id', GetRolPorId);
route.post('/Role', ValidateCreateRole, PostRol);
route.put('/Role/:id', ValidateUpdateRole, PutRol);
route.delete('/Role/:id', DeleteRol);

export default route;