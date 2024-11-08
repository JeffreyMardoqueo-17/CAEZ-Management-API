import { Router } from 'express';
import UserController from '../controllers/User.controller';
import { validateToken } from '../helpers/JWT';
const route = Router();

route.get('/users', validateToken, UserController.getUsers);
route.get('/users/:id', validateToken, UserController.getUserById);
route.post('/users', validateToken, UserController.createUser);
route.put('/users/:id', validateToken, UserController.updateUser);
route.delete('/users/:id', validateToken, UserController.deleteUser);

route.post('/users/login', UserController.loginUser);
//lagout
route.post('/users/logout', validateToken, UserController.logoutUser);
route.get('/users/check-session', validateToken, UserController.checkSession);

export default route;