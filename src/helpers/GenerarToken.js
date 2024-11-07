import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config(); // Asegúrate de cargar las variables de entorno al inicio

// Función para generar y devolver un token JWT
export function generateAndStoreToken(userId) {
    if (!process.env.JWT_SECRET) {
        throw new Error("La clave JWT_SECRET no está definida en el archivo de entorno.");
    }

    // Genera el token con el ID del usuario en el payload y una duración de 6 horas
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '6h' });
    return token;
}
