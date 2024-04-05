import { Router } from 'express';
import { registrarMaquina, buscarMaquina, listarMaquinas, actualizarMaquina, darDeBajaMaquina } from '../controllers/maquina.controllers.js';
import { validarToken } from '../controllers/autenticacion.controllers.js';
import { validatorMaqui } from '../validation/validatorMaquina.js';

const maquinaRouter = Router();

maquinaRouter.post('/registrar', /* validarToken, */ validatorMaqui, registrarMaquina);
maquinaRouter.get('/buscar/:id', buscarMaquina);
maquinaRouter.post('/listar', listarMaquinas);
maquinaRouter.put('/debaja/:id', /* validarToken, */ darDeBajaMaquina);
maquinaRouter.put('/actualizar/:id', /* validarToken, */ validatorMaqui, actualizarMaquina);

export default maquinaRouter;
