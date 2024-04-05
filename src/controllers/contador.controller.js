import { pool } from '../database/conexion.js';

export const getUsuariosCount = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT COUNT(*) AS total FROM usuario');
    res.json(result[0]);
  } catch (error) {
    console.error('Error al obtener la cantidad de usuarios:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getMaquinasCount = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT COUNT(*) AS total FROM maquina');
    res.json(result[0]);
  } catch (error) {
    console.error('Error al obtener la cantidad de máquinas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getMantenimientosCount = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT COUNT(*) AS total FROM mantenimiento');
    res.json(result[0]);
  } catch (error) {
    console.error('Error al obtener la cantidad de mantenimientos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const getAreasCount = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT COUNT(*) AS total FROM area');
    res.json(result[0]);
  } catch (error) {
    console.error('Error al obtener la cantidad de áreas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const listarUltmos = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM usuario ORDER BY id_usuario ASC LIMIT 5;');
    res.json(result);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};