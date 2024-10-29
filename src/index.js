import app from './app.js'
// import { GetConnection } from './DataBase/contection/Conexion'
// import { GetConnection } from './DataBase/contection/Conexion.js';
import configuracion from './configuracion'

let puerto = configuracion.port;
app.listen(app.get('puerto'));
