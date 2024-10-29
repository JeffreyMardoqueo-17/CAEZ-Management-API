// Importa dotenv para cargar las variables de entorno
import dotenv from 'dotenv';
import sql from 'mssql';

// Carga las variables desde el archivo .env.local
dotenv.config({ path: 'C:\\Users\\Jeffrey Mardoqueo\\Pictures\\API-CAEZ\\.env.local' });

// Configurando la base de datos usando las variables de entorno
const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // Convierte a booleano
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' // Convierte a booleano
    }
};


// Conexión asincrónica
export async function GetConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.log('Connection error:', error);
    }
}

export default sql;
