// helpers/JWT.js
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import { executeQuery } from '../helpers/dbHelper'; // Ajusta la ruta según la ubicación real de tu archivo

export async function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log("authHeader recibido:", authHeader); // Depuración

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Token no proporcionado o formato incorrecto' });
    }

    const token = authHeader.split(' ')[1];
    console.log("Token extraído:", token); // Depuración

    try {
        // Decodificar el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decodificado:", decoded); // Depuración

        // Verificar que la sesión esté activa en la base de datos
        const session = await executeQuery(
            'SELECT * FROM Session WHERE UserId = @UserId AND Token = @Token AND ExpiresAt > GETDATE() AND IsActive = 1',
            [
                { name: 'UserId', type: sql.Int, value: decoded.id },
                { name: 'Token', type: sql.NVarChar, value: token }
            ]
        );

        if (session.recordset.length === 0) {
            return res.status(403).json({ msg: 'Token inválido o sesión expirada/inactiva' });
        }

        req.user = decoded;
        req.token = token;
        next();
    } catch (err) {
        console.error("Error al validar el token:", err);
        return res.status(403).json({ msg: 'Token inválido' });
    }
}
