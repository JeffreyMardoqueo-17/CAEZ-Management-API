import express from "express";
import { GetRoles, GetRolPorId, PutRol, PostRol, DeleteRol } from '../controllers/Role.controller';
import { validateToken } from '../helpers/JWT';
import { ValidateCreateRole, ValidateUpdateRole } from '../validators/Role.validator'

const route = express.Router();

route.get('/Role', validateToken, GetRoles);
route.get('/Role/:id', validateToken, GetRolPorId);
route.post('/Role', validateToken, ValidateCreateRole, PostRol);
route.put('/Role/:id', validateToken, ValidateUpdateRole, PutRol);
route.delete('/Role/:id', validateToken, DeleteRol);

export default route;