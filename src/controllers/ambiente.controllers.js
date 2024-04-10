import { pool } from '../database/conexion.js';

export const registrarAmbiente = async (req, res) => {
    try {
        const { nombre, id_usuario, area_id_area } = req.body;

        const sql = `
            INSERT INTO ambiente (nombre, id_usuario, area_id_area)
            VALUES (?,?,?)
        `;

        const values = [nombre, id_usuario, area_id_area];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: "200 OK",
                message: 'Ambiente registrado con éxito',
            });
        } else {
            return res.status(400).json({
                status: "400 Bad Request",
                message: 'No se pudo registrar el ambiente',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "500 Internal Server Error",
            message: 'Error en el servidor' + err.message,
        });
    }
};


export const listarAmbientes = async (req, res) => {
    try {
        let sql = 'select area.nombre as nombre_area, ambiente.*, CONCAT(usuario.nombres, " ", usuario.apellidos) as encargado from ambiente join area on ambiente.area_id_area = area.id_area join usuario on ambiente.id_usuario = usuario.id_usuario '
        let result = [];
        if (req.body.area) {
            sql += 'WHERE ambiente.area_id_area = ?'
            // console.log(sql);
            result = await pool.query(sql, req.body.area);
        } else {
            result = await pool.query(sql);
        }

        await res.status(200).json(result[0]);

    } catch (e) {
        res.status(500).json({ massage: 'Error en el controlador ambiente:' + e });
    }
};

export const buscarAmbientePorId = async (req, res) => {
    try {
        const id = req.params.id;

        const sql = `
            SELECT * FROM ambiente
            WHERE id_ambiente = ?
        `;

        const values = [id];

        const [result] = await pool.query(sql, values);

        if (result.length > 0) {
            return res.status(200).json(result[0]);
        } else {
            return res.status(404).json({
                status: "404 Not Found",
                message: 'No se encontró el ambiente',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "500 Internal Server Error",
            message: 'Error en el servidor' + err.message,
        });
    }
};
export const actualizarAmbiente = async (req, res) => {
    try {
        let id = req.params.id;
        let { nombre, id_usuario, area_id_area } = req.body;

        let sql = `UPDATE ambiente SET nombre=?, id_usuario=?, area_id_area=? WHERE id_ambiente = ?`;
        const [rows] = await pool.query(sql, [nombre, id_usuario, area_id_area, id]);

        if (rows.affectedRows > 0)
            return res.status(200).json({
                'status': "200 OK",
                'message': 'Se actualizo con exito el ambiente',
            });
        else
            return res.status(401).json({
                'status': "404 Not Found",
                'message': 'No se actualizo el ambiente'
            });
    } catch (err) {
        res.status(500).json({
            'status': "500 Internal Server Error",
            'message': 'Error en el servidor' + err.message,
        });
    }
};