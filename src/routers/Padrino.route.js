import { Router } from 'express';
import PadrinoController from '../controllers/Padrino.controller';
import { validateToken } from '../helpers/JWT';

const route = Router();

route.get('/padrinos', validateToken, PadrinoController.getPadrinos);
route.get('/padrinos/:id', validateToken, PadrinoController.getPadrinoById);
route.post('/padrinos', validateToken, PadrinoController.createPadrino);
route.put('/padrinos/:id', validateToken, PadrinoController.updatePadrino);
route.delete('/padrinos/:id', validateToken, PadrinoController.deletePadrino);

export default route;
