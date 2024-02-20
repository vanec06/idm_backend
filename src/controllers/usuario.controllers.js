import jwt from 'jsonwebtoken';
import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const registrarUsuario = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { identificacion, nombres, apellidos, telefono, correo, estado, rol } = req.body;
        const contraseña = identificacion;

        const sql = `INSERT INTO usuario(identificacion, nombres, apellidos, telefono, correo, estado, contraseña, rol) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [identificacion, nombres, apellidos, telefono, correo, estado, contraseña, rol];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ 
                'status':"200 OK",
                'message':'Se registro con exito el Usuario',
            });
        } else {
            return res.status(404).json({ 
                'status':"404 Not Found",
                'message':'No se registro el Usuario' 
            });
        }
    } catch (err) {
        res.status(500).json({
            'status':"500 Internal Server Error",
            'message':'Error en el servidor' + err.message,
        });
    }
};

export const buscarusuarios = async (req, res) => {
    try {
        let identificacion = req.params.identificacion;
        const [result] = await pool.query(`SELECT * FROM usuario WHERE identificacion = '${identificacion}'`);

        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({
                message: 'No se encontró el usuario',
            });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Error en el servidor ' + err.message,
        });
    }
};


export const listarusuarios = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM usuario');
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json({ massage: 'Error en el servidor' + err.message });
    }
};

export const actualizarUsuario = async (req, res) => {
    try{ 
        let id = req.params.id;
        let{identificacion,nombres,apellidos,telefono,correo,estado,rol} =req.body;
        const contraseña = identificacion;

        let sql = `UPDATE usuario SET identificacion='${identificacion}', nombres='${nombres}', apellidos='${apellidos}', telefono= '${telefono}', correo='${correo}', estado='${estado}', contraseña='${contraseña}', rol='${rol}'
        WHERE id_usuario= ${id}`;

        const [rows] = await pool.query(sql);
        
        if (rows.affectedRows > 0)
            return res.status(200).json({ 
                'status':"200 OK",
                'message':'Se actualizo con exito el Usuario',
            });
        else
            return res.status(404).json({ 
                'status':"404 Not Found",
                'message':'No se actualizo el Usuario' 
            });
    } catch (err) {
        res.status(500).json({
            'status':"500 Internal Server Error",
            'message':'Error en el servidor' + err
        });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        let id = req.params.id;

        let sqlMantenimiento = `DELETE FROM mantenimiento WHERE id_usuario=${id}`;
        await pool.query(sqlMantenimiento);

        let sqlUsuario = `DELETE FROM usuario WHERE id_usuario=${id}`;
        const [rows] = await pool.query(sqlUsuario);

        if (rows.affectedRows > 0)
            return res.status(200).json({
                'status': "200 OK",
                'message': 'Se elimino con exito el Usuario',
            });
        else
            return res.status(404).json({
                'status': "404 Not Found",
                'message': 'No se elimino el Usuario'
            });
    } catch (err) {
        res.status(500).json({
            'status': "500 Internal Server Error",
            'message': 'Error en el servidor' + err
        });
    }
};


export const cambiarEstadoUsuario = async (req, res) => {
    try {
        const { identificacion } = req.params;

        const sql = `UPDATE usuario SET estado = 'inactivo' WHERE identificacion = '${identificacion}'`;

        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ 
                'status': "200 OK",
                'message': 'Se actualizó con éxito el estado del usuario'
            });
        } else {
            return res.status(404).json({ 
                'status': "404 Not Found",
                'message': 'No se encontró el usuario con la identificación proporcionada' 
            });
        }
    } catch (err) {
        res.status(500).json({
            'status': "500 Internal Server Error",
            'message': 'Error en el servidor' + err
        });
    }
};
    
