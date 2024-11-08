import jwt from 'jsonwebtoken';
import sql from 'mssql';
import { executeQuery } from './dbHelper';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

export async function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Token no proporcionado o formato incorrecto' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Verificar si la sesión está activa en la base de datos
        const sessionResult = await executeQuery(
            'SELECT * FROM Session WHERE UserId = @UserId AND Token = @Token AND ExpiresAt > GETDATE() AND IsActive = 1',
            [
                { name: 'UserId', type: sql.Int, value: decoded.id },
                { name: 'Token', type: sql.NVarChar, value: token }
            ]
        );

        if (sessionResult.recordset.length === 0) {
            return res.status(403).json({ msg: 'Sesión expirada o inválida' });
        }

        req.user = decoded;
        req.token = token;
        next();
    } catch (err) {
        console.error("Error al validar el token:", err.message);
        return res.status(403).json({ msg: 'Token inválido' });
    }
}
