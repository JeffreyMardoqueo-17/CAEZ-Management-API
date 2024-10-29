import { Router } from 'express';
import { GetGrados, GetGradoPorId, PostGrado, PutGrado, DeleteGrado } from '../controllers/Grado.controller';
import { ValidateCreateGrado, ValidateUpdateGrado } from '../validators/Grado.validator';
import { validateToken } from '../helpers/JWT';

const router = Router();
//ya estan las validaciones d elos inputs solo faltan las del tocken
router.get('/Grados', GetGrados);
router.get('/Grados/:id', GetGradoPorId);
router.post('/Grados', ValidateCreateGrado, PostGrado);
router.put('/Grados/:id', ValidateUpdateGrado, PutGrado);
router.delete('/Grados/:id', DeleteGrado);

export default router;
