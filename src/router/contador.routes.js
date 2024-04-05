import express from 'express';
import { getAreasCount, getMantenimientosCount, getMaquinasCount, getUsuariosCount, listarUltmos } from '../controllers/contador.controller.js';

const count = express.Router();

count.get('/contar/usuarios', getUsuariosCount);
count.get('/contar/maquinas', getMaquinasCount);
count.get('/contar/mantenimientos', getMantenimientosCount);
count.get('/contar/areas', getAreasCount);
count.get('/contar/nuevousuario', listarUltmos)

export default count;
