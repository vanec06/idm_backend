import { pool } from '../database/conexion.js';

export const notificacion = async (req, res) => {
    try {

        const { fecha, estado, comentarios, tipo_mantenimiento, id_maquina } = req.body;

        const [result] = await pool.query(
            'INSERT INTO notificacion_mantenimiento (fecha, estado, comentarios, tipo_manteniento, id_maquina) VALUES (?, ?, ?, ?, ?)',
            [fecha, estado, comentarios, tipo_mantenimiento, id_maquina]
        );        

        res.status(200).json(result);
    } catch (err) {
        console.error('Error en la ruta de notificacion:', err);
        res.status(500).json({ message: 'Error en el servidor: ' + err.message });
    }
};
