import { check, validationResult } from 'express-validator';

const validacionArea = [
    check('nombre').exists().withMessage('El nombre de área es requerido')
        .not().isEmpty().withMessage('El nombre de área no puede estar vacío')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/).withMessage('El nombre solo puede contener letras, espacios y tildes')
        .customSanitizer(value => {
            return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }).withMessage('No se permiten caracteres especiales'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ errors: errors.array() });
        }
        next();
    }
];


export default validacionArea;

