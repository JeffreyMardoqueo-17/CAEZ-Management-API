import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

/**
 * Genera un token JWT para un usuario.
 * @param {number} userId - ID del usuario.
 * @returns {string} - Token JWT.
 */
export function generateAndStoreToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '6h' });
}
