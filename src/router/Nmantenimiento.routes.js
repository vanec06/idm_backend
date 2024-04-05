import { Router } from 'express';
import { registrarNotificacion, buscarNotificacion,listarNotificacion,actualizarNotificacion,eliminarNotificacion, cambiarEstado } from '../controllers/Nmantenimiento.controllers.js';
import { validarToken } from '../controllers/autenticacion.controllers.js';
import {validatorNotifi} from '../validation/validationNotificacion.js';

const Nman = Router();

Nman.post('/registrar',validatorNotifi, registrarNotificacion);
Nman.post('/listar', listarNotificacion);
Nman.put('/actualizar/:id', actualizarNotificacion);
Nman.get('/buscar/:id', buscarNotificacion);
Nman.delete('/eliminar/:id', eliminarNotificacion);
Nman.put('/estado/:id', cambiarEstado);

export default Nman;
