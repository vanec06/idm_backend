import { check } from "express-validator";

export const validatorNotifi = [
    check ('fecha', 'Fecha requerida ').notEmpty(),
    check ('comentarios', 'Es requerido que haga una descripcion o comentario').isLength({ max: 50 }).notEmpty(),
    check ('tipo_mantenimiento','Por favor, seleccione una opción').isIn(['preventivo', 'correctivo','calibracion']),
    check ('id_maquina','Nombre de la maquina y placa ').isLength({ max: 10 }).notEmpty().isNumeric().withMessage(' numérico'),
];