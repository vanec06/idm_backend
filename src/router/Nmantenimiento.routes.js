import { Router } from 'express';
import { notificacion } from '../controllers/Nmantenimiento.controllers.js';

const Nman = Router();

Nman.post('/Nmantenimiento', notificacion);

export default Nman;
