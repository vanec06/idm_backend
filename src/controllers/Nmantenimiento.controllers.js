import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const registrarNotificacion = async (req, res) => {
  try {
    console.log(req.body)
    let error1 = validationResult(req);
    if (!error1.isEmpty()) {
      return res.status(400).json(error1);
    }
    const { fecha, estado, comentarios, tipo_mantenimiento, id_maquina } = req.body;
    const sql = `INSERT INTO notificacion_mantenimiento (fecha, comentarios, tipo_mantenimiento, id_maquina) VALUES (?, ?, ?, ?)`;

    const values = [fecha, comentarios, tipo_mantenimiento, id_maquina];

    const [rows] = await pool.query(sql, values);

    if (rows.affectedRows > 0) {
      return res.status(200).json({
        'status': "200 OK",
        'message': 'Se registró con éxito la notificación',
      });
    } else {
      return res.status(404).json({
        status: "404 Not Found",
        message: 'No se encontró la notificación para actualizar',
      });
    }
  } catch (err) {
    res.status(500).json({
      'status': "500 Internal Server Error",
      'message': 'Error en el servidor ' + err
    });
  }
};


export const listarNotificacion = async (req, res) => {
  try {

    const filtro = req.body.filtro;
    let sql = 'SELECT id_notificacion,notificacion_mantenimiento.id_maquina,maquina.nombre AS nombre_maquina, fecha, notificacion_mantenimiento.estado,tipo_mantenimiento, comentarios FROM notificacion_mantenimiento INNER JOIN maquina ON maquina.id_maquina = notificacion_mantenimiento.id_maquina ';

    // console.log(filtro);

    if (filtro == true) {
      sql += "WHERE notificacion_mantenimiento.estado = 3 OR notificacion_mantenimiento.estado = 1 order by notificacion_mantenimiento.fecha desc "
    }

    const [result] = await pool.query(sql);
    res.status(200).json(result);

  } catch (e) {
    res.status(500).json({ massage: 'Error en el controlador notificacion:' + e });
  }
};


export const buscarNotificacion = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.query('SELECT maquina.nombre AS nombre_maquina, fecha, notificacion_mantenimiento.estado,tipo_mantenimiento, comentarios FROM notificacion_mantenimiento INNER JOIN maquina ON maquina.id_maquina = notificacion_mantenimiento.id_maquina', [id]);

    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({
        status: "404 Not Found",
        message: 'No se encontró la notificacion',
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

export const actualizarNotificacion = async (req, res) => {
  try {
    let error1 = validationResult(req);
    if (!error1.isEmpty()) {
      return res.status(400).json(error1);
    }
    const id = req.params.id;
    const { fecha, estado, comentarios, tipo_mantenimiento, id_maquina } = req.body;


    const sql = `
            UPDATE notificacion_mantenimiento
            SET fecha=?, estado=?, comentarios=?, tipo_mantenimiento=?, id_maquina=?
            WHERE id_notificacion = ?`;

    const values = [fecha, estado, comentarios, tipo_mantenimiento, id_maquina, id];

    const [result] = await pool.query(sql, values);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: "200 OK",
        message: 'Se actualizó con éxito la notificacion',
      });
    } else {
      return res.status(404).json({
        status: "404 Not Found",
        message: 'No se actualizó la notificacion'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "500 Internal Server Error",
      message: 'Error en el servidor' + err,
    });
  }
};


export const eliminarNotificacion = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.query('DELETE FROM notificacion_mantenimiento WHERE id_notificacion = ?', [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({
        status: "200 OK",
        message: 'Se eliminó con éxito la notificacion',
      });
    } else {
      res.status(404).json({
        status: "404 Not Found",
        message: 'No se encontró la notificacion para eliminar',
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

export const cambiarEstado = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const sql = "UPDATE notificacion_mantenimiento set estado = ? WHERE id_notificacion = ?";
    const [rows] = await pool.query(sql, [data.estado, id])
    if (rows.affectedRows) {
      res.status(200).json({ status: true, message: "Operación exitosa." })
    } else {
      res.status(200).json({ status: false, message: "Error al realizar la operación." })
    }
  } catch (error) {
    res.status(200).json({ status: false, error: "Error interno del servodro:  " + error })
  }
}