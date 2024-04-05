import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';
import { cargarArchivo } from '../helpers/cargarArchivos.js';

export const registrarMantenimiento = async (req, res) => {
  try {
    // console.log(req.body.evidencia)
    let error1 = validationResult(req);
    if (!error1.isEmpty()) {
      return res.status(400).json(error1);
    }

    const cargar = await cargarArchivo([req.body.evidencia], 'evidencia')
    const evidencia = cargar[0];

    const { fecha_mantenimiento, hora_mantenimiento, descripcion, tipo_mantenimiento, id_maquina, id_usuario } = req.body;

    const sql = `INSERT INTO mantenimiento(fecha_mantenimiento,hora_mantenimiento,descripcion,tipo_mantenimiento,id_maquina,id_usuario,evidencia)
        VALUES (?, ?, ?, ?, ?, ?,?)`;

    const values = [fecha_mantenimiento, hora_mantenimiento, descripcion, tipo_mantenimiento, id_maquina, id_usuario, evidencia];

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
    if (!error1.isEmpty()) {
      return res.status(400).json(error1);
    }
    const id = req.params.id;
    const { fecha_mantenimiento, hora_mantenimiento, descripcion, tipo_mantenimiento, id_maquina, id_usuario } = req.body;

    let evidencia = null;
    if (req.body.evidencia) {
      const cargar = await cargarArchivo([req.body.evidencia], 'evidencia')
      if (cargar == false) {
        return res.status(200).json({errors: 'Archivo no permitido', path: 'evidencia'});
      } else {
        evidencia = cargar[0];
      }
    }

    const sql = `
            UPDATE mantenimiento
            SET fecha_mantenimiento=?, hora_mantenimiento=?, descripcion=?, tipo_mantenimiento=?, id_maquina=?, id_usuario=?, evidencia=IFNULL(?, evidencia)
            WHERE id_mantenimiento = ?`;

    const values = [fecha_mantenimiento, hora_mantenimiento, descripcion, tipo_mantenimiento, id_maquina, id_usuario, evidencia, id];

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
      message: 'Error en el servidor' + err,
    });
  }
};

export const listarMantenimientos = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT mantenimiento.id_maquina, mantenimiento.id_usuario,evidencia,maquina.nombre AS nombre_maquina,usuario.nombres AS nombre_usuario,mantenimiento.descripcion AS descripcion_mantenimiento,id_mantenimiento,fecha_mantenimiento,tipo_mantenimiento,hora_mantenimiento FROM   maquina INNER JOIN   mantenimiento ON maquina.id_maquina = mantenimiento.id_maquina INNER JOIN  usuario ON usuario.id_usuario = mantenimiento.id_usuario;  ');
    res.status(200).json(result);

  } catch (e) {
    res.status(500).json({ massage: 'Error en el controlador mantenimiento:' + e });
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

export const historialMantenmientos = async (req, res) => {
  try {
    const id_maquina = req.params.id;

    const sql =
      "SELECT CONCAT(us.nombres,' ', us.apellidos) as tecnico, us.identificacion, mt.*, mq.* FROM mantenimiento mt JOIN usuario us ON mt.id_usuario = us.id_usuario JOIN maquina mq ON mt.id_maquina = mq.id_maquina WHERE mq.id_maquina = ?";

    const [result] = await pool.query(sql, id_maquina);
    console.log(result.length);

    res.status(200).json({ status: true, data: result });
  } catch (error) {
    res
      .status(200)
      .json({ status: false, error: "Erro interno del servidor: " + error });
  }
};