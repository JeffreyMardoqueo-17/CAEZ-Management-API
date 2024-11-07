import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Función para generar y devolver un token JWT
export function generateAndStoreToken(userId) {
    if (!process.env.JWT_SECRET) {
        throw new Error("La clave JWT_SECRET no está definida en el archivo de entorno.");
    }

    // Genera el token usando la clave secreta desde las variables de entorno
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}
