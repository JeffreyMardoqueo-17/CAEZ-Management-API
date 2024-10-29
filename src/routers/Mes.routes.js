import { Router } from 'express';
import { GetMesPorNombre, GetMeses, BuscarMesPorTexto } from '../controllers/Mes.controller';
import { validateToken } from '../helpers/JWT';
const route = Router();

// Rutas
route.get('/Meses/', validateToken, GetMeses);
route.get('/Meses/:nombre', validateToken, GetMesPorNombre);
route.post('/Meses/Buscar',validateToken, BuscarMesPorTexto);
export default route;