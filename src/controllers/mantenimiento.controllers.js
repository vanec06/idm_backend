import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const registrarMantenimiento = async (req, res) => {
    try {
        console.log(req.body)
        let error1 = validationResult(req);
        if (!error1.isEmpty()){
            return res.status(400).json(error1);
        }
        
        const { fecha_mantenimiento,hora_mantenimiento,descripcion,tipo_mantenimiento,id_maquina,id_usuario } = req.body;
 
        const sql = `INSERT INTO mantenimiento(   fecha_mantenimiento,hora_mantenimiento,descripcion,tipo_mantenimiento,id_maquina,id_usuario )
        VALUES (?, ?, ?, ?, ?, ?)`;

        const values = [fecha_mantenimiento,hora_mantenimiento,descripcion,tipo_mantenimiento,id_maquina,id_usuario];

        const [rows] = await pool.query(sql, values);

        if (rows.affectedRows > 0) {
            return res.status(200).json({
                'status': "200 OK",
                'message': 'Se registró con éxito el mantenimiento',
            });
        } else {
            return res.status(404).json({
                status: "404 Not Found",
                message: 'No se encontró el mantenimiento para actualizar',
            });            
        }
    } catch (err) {
        res.status(500).json({
            'status': "500 Internal Server Error",
            'message': 'Error en el servidor ' + err
        });
    }
};


export const actualizarMantenimiento = async (req, res) => {
    try {
        let error1 = validationResult(req);
        if (!error1.isEmpty()){
            return res.status(400).json(error1);
        }
        const id = req.params.id;
        const {fecha_mantenimiento,hora_mantenimiento,descripcion,tipo_mantenimiento,id_maquina,id_usuario } = req.body;


        const sql = `
            UPDATE mantenimiento
            SET fecha_mantenimiento=?, hora_mantenimiento=?, descripcion=?, tipo_mantenimiento=?, id_maquina=?, id_usuario=?
            WHERE id_mantenimiento = ?`;
        
        const values = [fecha_mantenimiento, hora_mantenimiento,descripcion,tipo_mantenimiento, id_maquina, id_usuario,id];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: "200 OK",
                message: 'Se actualizó con éxito el mantenimiento',
            });
        } else {
            return res.status(404).json({
                status: "404 Not Found",
                message: 'No se actualizó el mantenimiento'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "500 Internal Server Error",
            message: 'Error en el servidor'+err,
    });
}
};

export const listarMantenimientos = async (req,res) => {
  try {
      const [result] = await pool.query('SELECT maquina.nombre AS nombre_maquina,usuario.nombres AS nombre_usuario,mantenimiento.descripcion AS descripcion_mantenimiento,id_mantenimiento,fecha_mantenimiento,tipo_mantenimiento,hora_mantenimiento FROM   maquina INNER JOIN   mantenimiento ON maquina.id_maquina = mantenimiento.id_maquina INNER JOIN  usuario ON usuario.id_usuario = mantenimiento.id_usuario;  ');
      res.status(200).json(result);

        } catch (e) {
      res.status(500).json({ massage: 'Error en el controlador mantenimiento:' +e });
    }
};

export const buscarMantenimiento = async (req, res) => {
    try {
      const id = req.params.id;
      const [result] = await pool.query('SELECT  maquina.nombre AS nombre_maquina, usuario.nombres AS nombre_usuario,mantenimiento.descripcion AS descripcion_mantenimiento,id_mantenimiento,  fecha_mantenimiento,   tipo_mantenimiento,  hora_mantenimiento FROM   maquina INNER JOIN   mantenimiento ON maquina.id_maquina = mantenimiento.id_maquina INNER JOIN  usuario ON usuario.id_usuario = mantenimiento.id_usuario WHERE id_mantenimiento = ?', [id]);
  
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({
          status: "404 Not Found",
          message: 'No se encontró el mantenimiento',
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "500 Internal Server Error",
        message: 'Error en el servidor: ' + err,
      });
    }
  };
  
  export const eliminarMantenimiento = async (req, res) => {
    try {
      const id = req.params.id;
      const [result] = await pool.query('DELETE FROM mantenimiento WHERE id_mantenimiento = ?', [id]);
  
      if (result.affectedRows > 0) {
        res.status(200).json({
          status: "200 OK",
          message: 'Se eliminó con éxito el mantenimiento',
        });
      } else {
        res.status(404).json({
          status: "404 Not Found",
          message: 'No se encontró el mantenimiento para eliminar',
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "500 Internal Server Error",
        message: 'Error en el servidor: ' + err,
      });
    }
  };
  
  