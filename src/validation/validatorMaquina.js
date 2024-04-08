import { check } from 'express-validator';

export const validatorMaqui = [
    check('nombre', 'El nombre es requerido').isLength({ max: 50 }).notEmpty().matches(/^[a-zA-Z\s]*$/).withMessage('El nombre solo puede contener letras y espacios'),
    check('marca', 'La marca es requerida, no puede estar vacia').isLength({ max: 50 }).notEmpty(),
    check('placa', 'La placa es requerida, no puede estar vacia').isLength({ max: 50 }).notEmpty(),
    check('modelo', 'El modelo es requerido, no puede estar vacia').isLength({ max: 50 }).notEmpty(),
    check('serial', 'Serial requerido, no puede estar vacio').isLength({ max: 50 }).notEmpty(),
    check('descripcion', 'La descripción de la máquina es requerida').isLength({ max: 50 }).notEmpty(),
    // check('estado', 'Estado incorrecto').isIn(['con_mantenimiento', 'calibracion_vigente', 'no_realizado_calibracion','sin_calibracion','dar_baja','no_cuenta_mantenimienton','mantenimiento_correctivo','mantenimiento_preventivo']).isEmpty(),
    // check('id_usuario', 'identificacion de usuario requerido').isLength({ max: 50 }).notEmpty().isNumeric(),
    // check('id_area', 'nombre de de área requerido y debe ser numérico').isLength({ max: 50 }).notEmpty().isNumeric(),
    check('id_ambiente', 'Ambiente requerido y debe ser numérico').isLength({ max: 50 }).notEmpty().isNumeric(),
    check('estado_maquina', 'Estado incorrecto, debe ser  "funcional, fuera_de_servicio"').isIn(['funcional', 'fuera_de_servicio']),
    check('img', 'Imagen requerida').notEmpty(),
    check('manual', 'Manual requerido').notEmpty()
];
