import express from 'express';
import iniciarSesion from '../controllers/login.controller.js';

const login = express.Router();

login.post('/login', iniciarSesion);

export default login;
