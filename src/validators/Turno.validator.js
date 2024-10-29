import { check } from 'express-validator';
import { validateResult } from '../helpers/ValidateHeper';

const ValidatePostTurno = [
    check('Nombre')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .withMessage('El nombre debe ser un tipo texto no vacío')
        .isLength({ max: 50 })
        .withMessage('El nombre debe tener un máximo de 50 caracteres'),
    (req, res, next) => { //verificar, retornar o que siga todo el flujo
        validateResult(req, res, next)
    }
];

const ValidatePutTurno = [
    check('Nombre')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .withMessage('El nombre debe ser un tipo texto no vacío')
        .isLength({ max: 50 })
        .withMessage('El nombre debe tener un máximo de 50 caracteres'),
    (req, res, next) => { //verificar, retornar o que siga todo el flujo
        validateResult(req, res, next)
    }
];
export { ValidatePostTurno, ValidatePutTurno };
