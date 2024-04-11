import { check, validationResult } from 'express-validator';

const validationAmbiente = [
    check('nombre').notEmpty().withMessage('El nombre es requerido'),
    // check('nombre').exists().withMessage('El nombre es requerido')
        // .not().notEmpty().withMessage('El nombre no puede estar vacío')
        // .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
        // .trim().withMessage('No se permiten espacios al inicio o al final')
        // .customSanitizer(value => {
        //     return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        // }).withMessage('No se permiten caracteres especiales'),
    check('id_usuario').notEmpty().withMessage('Usuario Requerido'),
    check('area_id_area').notEmpty().withMessage('Area Requerida'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ errors: errors.array() });
        }
        next();
    }

];

export default validationAmbiente;
