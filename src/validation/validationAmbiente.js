import { check, validationResult } from 'express-validator';

const validationAmbiente = [
    check('nombre').notEmpty().withMessage('Nombre ambiente requerido'),
    check('id_usuario').notEmpty().withMessage('Por favor, seleccione un usuario'),
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
