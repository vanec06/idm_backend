import express from 'express';
import iniciarSesion from '../controllers/login.controller.js';
import { recuperarContraseña, validarRuta } from '../controllers/autenticacion.controllers.js';

const login = express.Router();

login.post('/login', iniciarSesion);
login.get('/validarRuta', validarRuta)
login.post('/recuperar', recuperarContraseña)

export default login;
