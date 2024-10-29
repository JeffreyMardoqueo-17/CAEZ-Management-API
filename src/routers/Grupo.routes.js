
import {Router} from 'express';
import {GetGrupos, getGrupoID} from '../controllers/Grupos.controller';

const router = Router();
router.get('/grupos/', GetGrupos);
router.get('/grupos/:id', getGrupoID);

export default router;