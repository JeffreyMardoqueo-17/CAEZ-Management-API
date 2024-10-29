import jwt from 'jsonwebtoken';

export function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // si no hay token, devuelve un error 401

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.sendStatus(403); // si el token es inválido, devuelve un error 403
        req.user = user;
        next(); // pasa al siguiente middleware o ruta
    });
}
