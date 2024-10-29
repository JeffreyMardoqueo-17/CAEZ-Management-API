import { check } from 'express-validator';
import { validateResult } from '../helpers/ValidateHeper';

const ValidateCreateDireccion = [
    check('Nombre')
        .exists()
        .withMessage('El nombre es requerido')
        .not()
        .isEmpty()
        .withMessage('El nombre no puede estar vacío')
        .isLength({ max: 200 })
        .withMessage('El nombre no puede exceder los 200 caracteres'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];

const ValidateUpdateDireccion = [
    check('Nombre')
        .optional()
        .not()
        .isEmpty()
        .withMessage('La direccion no puede estar vacío')
        .isLength({ max: 200 })
        .withMessage('La direccion no puede exceder los 200 caracteres'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];

export { ValidateCreateDireccion, ValidateUpdateDireccion };