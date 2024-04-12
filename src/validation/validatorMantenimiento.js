import { check } from 'express-validator';

export const validatorMante = [
    check('fecha_mantenimiento', 'Fecha requerida').matches(/^\d{4}-\d{2}-\d{2}$/),
    check('hora_mantenimiento', 'Hora requerida').matches(/^([01]\d|2[0-3]):[0-5]\d$/),
    check('descripcion', 'La descripción es requerida').notEmpty(),
    check('descripcion', 'Longitd maxima de 50 carcateres').isLength({ max: 50 }).notEmpty(),
    check('tipo_mantenimiento', 'Por favor, eleccione un tipo de mantenimiento').isIn(['preventivo', 'correctivo','calibracion']),
    check('id_maquina', 'Seleccione una maquina ').isLength({ max: 10 }).notEmpty().isNumeric().withMessage(' '),
    check('id_usuario', 'seleccione un usuario ').isLength({ max: 50 }).notEmpty().isNumeric().withMessage(' '),
];

