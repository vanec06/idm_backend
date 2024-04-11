import { check } from 'express-validator';

export const validatorMaqui = [
    check('nombre', 'El nombre es requerido').isLength({ max: 50 }).notEmpty(),
    check('marca', 'La marca es requerida, no puede estar vacia').isLength({ max: 50 }).notEmpty(),
    check('placa', 'La placa es requerida, no puede estar vacia').isLength({ max: 50 }).notEmpty(),
    check('modelo', 'El modelo es requerido, no puede estar vacia').isLength({ max: 50 }).notEmpty(),
    check('serial', 'Serial requerido, no puede estar vacio').isLength({ max: 50 }).notEmpty(),
    check('descripcion', 'La descripción de la máquina es requerida').isLength({ max: 50 }).notEmpty(),
    check('id_ambiente', 'Ambiente requerido y debe ser numérico').isLength({ max: 50 }).notEmpty().isNumeric(),
    check('estado_maquina', 'Por favor seleccione un estado para la maquina').isIn(['funcional', 'fuera_de_servicio']),
    check('estado', 'Por favor seleccione un estado').isIn(['con_mantenimiento', 'calibracion_vigente', 'no_realizado_calibracion','sin_calibracion', 'dar_baja', 'no_cuenta_mantenimiento','mantenimiento_correctivo','mantenimiento_preventivo' ]),
    check('img', 'Imagen requerida').notEmpty(),
    check('manual', 'Manual requerido').notEmpty()
];                                                  ''