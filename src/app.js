import express from 'express';
import configuracion from './configuracion';
import ParentezcoRouter from './routers/Parentezco.routes'; // Importa el enrutador de Parentezco
import TurnoRputer from './routers/Turno.routes'
import GradoRouter from './routers/Grado.routes'
import TipoDocumentos from './routers/TipoDocumento.routes'
import TipoPago from './routers/TipoPago.routes'
import Mes from './routers/Mes.routes'
import Direcciones from './routers/Direcciones.routes'
// import Administradores from './routers/Administradores.routes'
import Role from './routers/Role.routes'
import Grupos from "./routers/Grupo.routes";
import Sexo from './routers/Sexo.routes';
const cors = require("cors");

const app = express();
const port = configuracion.port; // Define la variable port utilizando const

app.set('port', port);

app.use(cors()); // 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(ParentezcoRouter); //parentezco Router
app.use(TurnoRputer) //turno
app.use(GradoRouter)//grado
app.use(TipoDocumentos) //tipo doc
app.use(TipoPago) //tipo pago
app.use(Mes) //mes
app.use(Direcciones);//direcciones
app.use(Role);
app.use(Grupos)
app.use(Sexo)
// app.use(ActualizarFondo);//actualizar fondo 
// app.use(Administradires);


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

export default app;