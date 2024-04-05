import { Router } from 'express';
import { registrarUsuario, buscarusuarios, listarusuarios, eliminarUsuario, actualizarUsuario, cambiarEstadoUsuario } from '../controllers/usuario.controllers.js';
//
import validateUsuario from '../validation/usuario.validation.js';

const usuarioRouter = Router();

usuarioRouter.post('/registrar', validateUsuario, registrarUsuario);
usuarioRouter.get('/buscar/:identificacion', buscarusuarios);
usuarioRouter.get('/listar', listarusuarios);
usuarioRouter.put('/actualizar/:id',  /*validarToken,*/ validateUsuario, actualizarUsuario);
usuarioRouter.delete('/eliminar/:id',/*  validarToken,  */eliminarUsuario);
usuarioRouter.put('/cambiarestado/:identificacion', /* validarToken,  */cambiarEstadoUsuario);

export default usuarioRouter;
