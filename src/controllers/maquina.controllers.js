import { pool } from '../database/conexion.js';
import multer from 'multer';
import { validationResult } from 'express-validator';
import fsPromises from 'fs/promises';
import path from 'path';
import { __dirname } from '../../app.js';
import fs from 'fs';

const guardarImagen = async (files, folder) => {
    // console.log(files);
    if (files) {
        let names = [];

        for (let i = 0; i < files.length; i++) {
            if (files[i] != 'yes') {

                let carpeta = 'default';

                if (files[i].startsWith('data:image')) {
                    carpeta = 'img';
                } else if (files[i].startsWith('data:application/pdf')) {
                    carpeta = 'pdf'
                } else {
                    return false
                }
                // Crear carpeta si no existe
                const rutaCarpeta = path.join(__dirname, 'public', carpeta, folder);
                if (!fs.existsSync(rutaCarpeta)) {
                    fs.mkdirSync(rutaCarpeta, { recursive: true });
                }

                // Obtén la extensión del tipo MIME
                const tipoMIME = files[i].substring(5, files[i].indexOf(';'));
                const extension = tipoMIME.split('/')[1];

                // Sacar codigo base64
                const base64Data = files[i].split(',')[1];;
                const buffer = Buffer.from(base64Data, 'base64');

                // Guardar
                const nombreArchivo = Date.now() + '.' + extension;
                const rutaArchivo = path.join(rutaCarpeta, nombreArchivo);

                try {
                    await fsPromises.writeFile(rutaArchivo, buffer);
                    names[i] = nombreArchivo
                    console.log('Imagen guardada en:', rutaArchivo);
                    // res.json({ mensaje: 'Imagen guardada exitosamente' });
                } catch (error) {
                    console.error('Error al guardar la imagen:', error);
                    // res.status(500).json({ error: 'Error al guardar la imagen' });
                }
            }
        }

        return names;
    }
}

export const registrarMaquina = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ errors: errors.array() });
        }

        const archivos = await guardarImagen([req.body.img, req.body.manual], req.body.placa)
        if (archivos == false) {
            return res.status(200).json({ path: 'Solo se permiten imagens o documentos PDF' });
        }
        console.log(archivos);

        const { nombre, marca, placa, modelo, serial, descripcion, estado, id_ambiente, estado_maquina } = req.body;
        let imagen = archivos[0];
        let manual = archivos[1];


        const sql = `INSERT INTO maquina(nombre, marca, placa, modelo, manual, serial, imagen, descripcion, estado, id_ambiente, estado_maquina)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [nombre, marca, placa, modelo, manual, serial, imagen, descripcion, estado, id_ambiente, estado_maquina];

        const [rows] = await pool.query(sql, values);

        if (rows.affectedRows > 0) {
            return res.status(200).json({
                'status': true,
                'message': 'Se registró con éxito la máquina',
            });
        } else {
            return res.status(404).json({
                'status': false,
                'message': 'No se registró la máquina'
            });
        }
    } catch (err) {
        res.status(500).json({
            'status': false,
            'message': 'Error en el servidor ' + err
        });
    }
};

export const buscarMaquina = async (req, res) => {
    try {
        const id = req.params.id;
        // const [result] = await pool.query('SELECT usuario.nombres AS nombre_usuario , area.nombre AS nombre_area, ambiente.nombre AS nombre_ambiente, maquina.nombre AS nombre_maquina , maquina.estado, maquina.estado_maquina,id_maquina,  marca, placa, modelo, manual, serial, imagen, descripcion FROM usuario INNER JOIN  maquina ON usuario.id_usuario = maquina.id_usuario INNER JOIN  area ON area.id_area = maquina.id_area INNER JOIN ambiente ON ambiente.id_ambiente = maquina.id_ambiente WHERE id_maquina = ?', [id]);
        const [result] = await pool.query('SELECT area.nombre AS nombre_area, ambiente.nombre AS nombre_ambiente, maquina.nombre AS nombre_maquina , maquina.estado, maquina.estado_maquina,id_maquina,  marca, placa, modelo, manual, serial, imagen, descripcion FROM maquina INNER JOIN  area ON area.id_area = maquina.id_area INNER JOIN ambiente ON ambiente.id_ambiente = maquina.id_ambiente WHERE id_maquina = ?', [id]);

        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({
                status: "404 Not Found",
                message: 'Máquina no encontrada'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "500 Internal Server Error",
            message: 'Error en el servidor ' + err
        });
    }
};


export const listarMaquinas = async (req, res) => {
    try {
        let sql = 'SELECT area.nombre AS nombre_area, area.id_area, ambiente.nombre AS nombre_ambiente, ambiente.id_ambiente, maquina.nombre AS nombre_maquina, maquina.estado , maquina.estado_maquina ,id_maquina,  marca, placa, modelo, manual, serial, imagen, descripcion FROM maquina INNER JOIN  ambiente ON ambiente.id_ambiente = maquina.id_ambiente INNER JOIN area ON ambiente.area_id_area = area.id_area '

        if (req.body.limite == true) {
            sql += 'limit 5;'
        } else if (req.body.area) {
            sql += 'WHERE area.id_area = ' + req.body.area;
        }
        // console.log(sql);
        const [result] = await pool.query(sql);
        res.status(200).json(result);

    } catch (e) {
        res.status(500).json({ message: 'Error en el controlador maquina: ' + e });
    }
};

export const darDeBajaMaquina = async (req, res) => {
    let responseSent = false;

    try {
        const id = req.params.id;

        const sql = `UPDATE maquina SET estado_maquina = 'fuera_de_servicio' WHERE id_maquina = ?
        `;

        const values = [id];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: "200 OK",
                message: 'fuera de servicio del equipo',
            });
        } else {
            return res.status(404).json({
                status: "404 Not Found",
                message: 'No se encontró el equipo ',
            });
        }
    } catch (err) {
        if (!responseSent) {
            console.error(err);
            res.status(500).json({
                status: "500 Internal Server Error",
                message: 'Error en el servidor',
            });
            responseSent = true;
        }
    }
};


export const actualizarMaquina = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ errors: errors.array() });
        }

        // console.log(req.body);
        let imagen = null;
        let manual = null;

        const archivos = await guardarImagen([req.body.img, req.body.manual], req.body.placa)
        for (let i = 0; i < archivos.length; i++) {
            // console.log('xd: ', archivos.length);
            if (archivos[i] != undefined) {
                const archivo = archivos[i].split(".");

                if (archivo[i] == 'pdf') {
                    manual = archivos[i];
                } else {
                    imagen = archivos[i];
                }
            }
        }


        const id = req.params.id;
        const { nombre, marca, placa, modelo, serial, descripcion, estado, id_ambiente, estado_maquina } = req.body;



        const sql = `
            UPDATE maquina
            SET nombre=?, marca=?, placa=?, modelo=?, manual=IFNULL(?, manual), serial=?, imagen=IFNULL(?, imagen), descripcion=?, estado=?, id_ambiente=?,estado_maquina=?
            WHERE id_maquina = ?
        `;

        const values = [nombre, marca, placa, modelo, manual, serial, imagen, descripcion, estado, id_ambiente, estado_maquina, id];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: "200 OK",
                message: 'Se actualizó con éxito la máquina',
            });
        } else {
            return res.status(404).json({
                status: "404 Not Found",
                message: 'No se actualizó la máquina'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "500 Internal Server Error",
            message: 'Error en el servidor ' + err,
        });
    }
};
