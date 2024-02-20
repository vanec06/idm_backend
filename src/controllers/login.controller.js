import { pool } from '../database/conexion.js';
import { validarUsuario } from './autenticacion.controllers.js';

const iniciarSesion = async (req, res) => {
  try { 
    const { identificacion, contraseña } = req.body;

    const result = await validarUsuario(req, res);

    if (result.status === 200) {
        return res.status(result.status).json({ token: result.token, message: result.message });
    } else {
        return res.status(result.status).json({ message: result.message });
    }
} catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return res.status(500).json({ message: 'Error en el sistema' });
}
};
    
export default iniciarSesion;