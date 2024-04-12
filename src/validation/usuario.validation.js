import { check, validationResult } from 'express-validator';

const validateUsuario = [

    check('identificacion')
        .exists().withMessage('La identificación es requerida')
        .isNumeric().withMessage('La identificación debe ser numérica y ')
        .not().isEmpty().withMessage('no puede estar vacía'),

    check('nombres')
        .exists().withMessage('El nombre es requerido')
        .not().isEmpty().withMessage('El nombre no puede estar vacío, ')
        .matches(/^[A-Za-z0-9ñÑ\s]+$/).withMessage('solo puede contener letras y espacios'),
    // .blacklist('~!@#$%^&*()_+=`{}[]:;\'<>,.?/\\|"').withMessage('Caracteres no permitidos en el nombre'),
    // .customSanitizer(value => {
    //     return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // }).withMessage('No se permiten etiquetas de script'),

    check('apellidos')
        .exists().withMessage('Los apellidos son requeridos')
        .not().isEmpty().withMessage('Los apellidos no pueden estar vacíos,')
        .matches(/^[A-Za-z0-9ñÑ\s]+$/).withMessage('El apellido solo puede contener letras y espacios ')
        .trim().withMessage('No se permiten espacios al inicio o al final')
        .escape().withMessage(' no se permiten caracteres especiales'),
    // .blacklist('~!@#$%^&*()_+=`{}[]:;\'<>,.?/\\|"').withMessage('Caracteres no permitidos en los apellidos')
    // .customSanitizer(value => {
    //     return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // }).withMessage('No se permiten etiquetas de script'),

    check('telefono')
        .exists().withMessage('El número de teléfono es requerido')
        .not().isEmpty().withMessage('El número de teléfono no puede estar vacío')
        .matches(/^[\d\s\-()+]+$/).withMessage('Formato de número de teléfono no válido. Solo se permiten dígitos, espacios, guiones y paréntesis.')
        .trim().withMessage('No se permiten espacios al inicio o al final')
        .escape().withMessage(', no se permiten caracteres especiales'),

    check('correo')
        .exists().withMessage('El correo electrónico es requerido')
        .not().isEmpty().withMessage('El correo electrónico no puede estar vacío')
        .isEmail().withMessage('El formato del correo electrónico no es válido')
        .trim().withMessage('No se permiten espacios al inicio o al final')
        .normalizeEmail().withMessage(', no es válido'),

    check('estado')
        .exists().withMessage('El estado es requerido')
        .isIn(['activo', 'inactivo']).withMessage('Por favor, seleccione una opción'),

    check('rol')
        .exists().withMessage('El rol es requerido')
        .isIn(['administrador', 'tecnico', 'instructor']).withMessage('Por favor, seleccione una opción'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ errors: errors.array() });
        }
        next();
    }
];

export default validateUsuario;