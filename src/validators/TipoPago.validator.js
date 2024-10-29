import { check } from 'express-validator';
import { validateResult } from '../helpers/ValidateHeper';

const ValidateCreateTipoPago = [
    check('Nombre')
        .exists()
        .withMessage('El nombre es requerido')
        .not()
        .isEmpty()
        .withMessage('El nombre no puede estar vacío')
        .isString()
        .withMessage('El nombre debe ser un tipo texto')
        .isLength({ max: 50 })
        .withMessage('El nombre no puede exceder los 50 caracteres'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];

const ValidateUpdateTipoPago = [
    check('Nombre')
        .optional()
        .not()
        .isEmpty()
        .withMessage('El nombre no puede estar vacío')
        .isString()
        .withMessage('El nombre debe ser un tipo texto')
        .isLength({ max: 50 })
        .withMessage('El nombre no puede exceder los 50 caracteres'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];

export { ValidateCreateTipoPago, ValidateUpdateTipoPago };