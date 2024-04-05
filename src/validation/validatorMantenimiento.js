import { check } from 'express-validator';

export const validatorMante = [
    check('fecha_mantenimiento', 'La fecha es requerida y debe tener A-M-D').matches(/^\d{4}-\d{2}-\d{2}$/).notEmpty(),
    check('hora_mantenimiento', 'La hora debe ser en MIN-SEG ').matches(/^([01]\d|2[0-3]):[0-5]\d$/).notEmpty(),
    check('descripcion', 'La descripción es requerida').notEmpty(),
    check('descripcion', 'Longitd maxima de 50 carcateres').isLength({ max: 50 }).notEmpty(),
    check('tipo_mantenimiento', 'seleccione').isIn(['preventivo', 'correctivo','calibracion']),
    check('id_maquina', 'ID, maquina ').isLength({ max: 10 }).notEmpty().isNumeric().withMessage(' numérico'),
    check('id_usuario', 'ID, usuario ').isLength({ max: 50 }).notEmpty().isNumeric().withMessage(' numerico'),
];

