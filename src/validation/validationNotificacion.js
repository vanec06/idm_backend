import { check } from "express-validator";

export const validatorNotifi = [
    check ('fecha', 'La fecha es requerida y debe tener A-M-D').notEmpty(),
    check ('comentarios', 'es requerido que haga una descripcion o comentario').isLength({ max: 50 }).notEmpty(),
    check ('tipo_mantenimiento','por favor, seleccione una opcion').isIn(['preventivo', 'correctivo']),
    check ('id_maquina','ID, maquina ').isLength({ max: 10 }).notEmpty().isNumeric().withMessage(' numérico'),
];