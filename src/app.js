import dotenv from 'dotenv';
import express from 'express';
import configuracion from './configuracion';
import ParentezcoRouter from './routers/Parentezco.routes';
import TurnoRouter from './routers/Turno.routes';
import GradoRouter from './routers/Grado.routes';
import TipoDocumentos from './routers/TipoDocumento.routes';
import TipoPago from './routers/TipoPago.routes';
import Mes from './routers/Mes.routes';
import Direcciones from './routers/Direcciones.routes';
import Role from './routers/Role.routes';
import Sexo from './routers/Sexo.routes';
import Users from './routers/User.routes';
import Padrino from './routers/Padrino.route';
import Encargado from './routers/Encargado.routes'
import AuditoriaEncargado from './routers/AuditoriaEncargado.routes'
import cors from 'cors';

// Carga las variables de entorno desde el archivo .env.local
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const app = express();
const port = configuracion.port || 9000; // Define el puerto, con un valor predeterminado

// Configuración de la aplicación
app.set('port', port);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de rutas
app.use(ParentezcoRouter);
app.use(TurnoRouter);
app.use(GradoRouter);
app.use(TipoDocumentos);
app.use(TipoPago);
app.use(Mes);
app.use(Direcciones);
app.use(Role);
app.use(Sexo);
app.use(Users);
app.use(Padrino);
app.use(Encargado);
app.use(AuditoriaEncargado);

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

export default app;
