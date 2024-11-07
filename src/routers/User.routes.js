import { Router } from 'express';
import UserController from '../controllers/User.controller';
// import { validateToken } from '../helpers/JWT';
const route = Router();

route.get('/users', UserController.getUsers);
route.get('/users/:id', UserController.getUserById);
route.post('/users', UserController.createUser);
route.put('/users/:id', UserController.updateUser);
route.delete('/users/:id', UserController.deleteUser);
route.post('/users/login', UserController.loginUser);

export default route;