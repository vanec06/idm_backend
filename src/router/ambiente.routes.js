import { Router } from 'express';
import { actualizarAmbiente, buscarAmbientePorId, listarAmbientes, registrarAmbiente } from '../controllers/ambiente.controllers.js';
import { validarToken } from '../controllers/autenticacion.controllers.js';
import validationAmbiente from '../validation/validationAmbiente.js';

const ambienteRouter = Router();

ambienteRouter.get('/listar', listarAmbientes);
ambienteRouter.post('/registrar', /* validarToken, */ validationAmbiente, registrarAmbiente);
ambienteRouter.get('/buscar/:id', /* validarToken, */ buscarAmbientePorId);
ambienteRouter.put('/actualizar/:id', /* validarToken, */ validationAmbiente, actualizarAmbiente);

export default ambienteRouter;