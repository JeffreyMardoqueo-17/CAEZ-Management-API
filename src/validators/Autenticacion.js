const jwt = require('jsonwebtoken');
const { secretKey } = require('../configuration/jwt');

function autenticacion(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.administrador = decoded.administrador;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
}

module.exports = autenticacion;
