import { check } from 'express-validator';

export const validatorMante = [
    check('fecha_mantenimiento', 'La fecha es requerida y debe tener A-M-D').matches(/^\d{4}-\d{2}-\d{2}$/).notEmpty(),
    check('hora_mantenimiento', 'La hora es requerida y debe ser en MIN-SEG ').isLength({ max: 50 }).notEmpty().matches(/^([01]\d|2[0-3]):[0-5]\d$/).notEmpty(),
    check('descripcion', 'La descripción es requerida').isLength({ max: 50 }).notEmpty(),
    check('tipo_mantenimiento', 'El tipo de mantenimiento es incorrecto').isIn(['preventivo', 'correctivo']),
    check('id_maquina', 'La máquina es requerida, ').isLength({ max: 10 }).notEmpty().isNumeric().withMessage(' ID numérico'),
    check('id_usuario', 'El usuario es requerido, ').isLength({ max: 50 }).notEmpty().isNumeric().withMessage(' ID numerico'),
];


