import jwt from 'jsonwebtoken';

// Función para generar y devolver un token JWT
export function generateAndStoreToken(userId) {
    const token = jwt.sign({ id: userId }, 'your-secret-key', { expiresIn: '1h' }); // Añadimos expiresIn para seguridad
    return token;
}
