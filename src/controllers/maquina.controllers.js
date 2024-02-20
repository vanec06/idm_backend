import { pool } from '../database/conexion.js';
import multer from 'multer';
import{validationResult} from 'express-validator';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destinationFolder = "public/";
        
        if (file.fieldname === "img") {
            destinationFolder += "img/";
        } else if (file.fieldname === "manual") {
            destinationFolder += "pdf/";
        }

        cb(null, destinationFolder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,file.originalname);
    }
});

const upload = multer({ storage: storage });
export const cargarImagen = upload.fields([{ name: 'img', maxCount: 1 }, { name: 'manual', maxCount: 1 }]);



export const registrarMaquina = async (req, res) => {
    try {
        console.log(req.files,"fileeee")
        let error1 = validationResult(req);     
        if (!error1.isEmpty()){
            return res.status(400).json(error1);
        }
        
        const { nombre, marca, placa, modelo, cantidad, serial, descripcion, estado, id_usuario, id_area, id_ambiente } = req.body;
        let imagen = "";
        let manual = "";
        if(req.files !== undefined){
             imagen = req.files.img[0].originalname;
             manual = req.files.manual[0].originalname;

        }else{
            return res.status(400).json({
                'status': "400 Bad Request",
                'message': 'La imagen es requerida',
            });            
        }
        console.log(manual,imagen,req.files)

        const sql = `INSERT INTO maquina(nombre, marca, placa, modelo, cantidad, manual, serial, imagen, descripcion, estado, id_usuario, id_area, id_ambiente)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [nombre, marca, placa, modelo, cantidad, manual, serial, imagen, descripcion, estado, id_usuario, id_area, id_ambiente];

        const [rows] = await pool.query(sql, values);

        if (rows.affectedRows > 0) {
            return res.status(200).json({
                'status': "200 OK",
                'message': 'Se registró con éxito la máquina',
            });
        } else {
            return res.status(404).json({
                'status': "404 Not Found",
                'message': 'No se registró la máquina'
            });
        }
    } catch (err) {
        res.status(500).json({
            'status': "500 Internal Server Error",
            'message': 'Error en el servidor ' + err
        });
    }
};

export const buscarMaquina = async (req, res) => {
    try {
        const id = req.params.id;
        const [result] = await pool.query('SELECT  usuario.nombres AS nombre_usuario , area.nombre AS nombre_area, ambiente.nombre AS nombre_ambiente, maquina.nombre AS nombre_maquina , maquina.estado AS estado_maquina,id_maquina,  marca, placa, modelo, cantidad, manual, serial, imagen, descripcion FROM usuario INNER JOIN  maquina ON usuario.id_usuario = maquina.id_usuario INNER JOIN  area ON area.id_area = maquina.id_area INNER JOIN ambiente ON ambiente.id_ambiente = maquina.id_ambiente WHERE id_maquina = ?', [id]);

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
        const [result] = await pool.query('SELECT usuario.nombres AS nombre_usuario , area.nombre AS nombre_area, ambiente.nombre AS nombre_ambiente, maquina.nombre AS nombre_maquina , maquina.estado AS estado_maquina,id_maquina,  marca, placa, modelo, cantidad, manual, serial, imagen, descripcion FROM usuario INNER JOIN  maquina ON usuario.id_usuario = maquina.id_usuario INNER JOIN  area ON area.id_area = maquina.id_area INNER JOIN ambiente ON ambiente.id_ambiente = maquina.id_ambiente;');
        res.status(200).json(result);

    } catch (e) {
        res.status(500).json({ message: 'Error en el controlador maquina: ' +e });
    }
};

export const darDeBajaMaquina = async (req, res) => {
    let responseSent = false;
    
    try {
        const id = req.params.id;

        const sql = `UPDATE maquina SET estado_maquina = 'inactivo' WHERE id_maquina = ?
        `;

        const values = [id];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: "200 OK",
                message: 'Se dio de baja la máquina con éxito',
            });
        } else {
            return res.status(404).json({
                status: "404 Not Found",
                message: 'No se encontró la máquina para dar de baja',
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
        let error1 = validationResult(req);
        if (!error1.isEmpty()) {
            return res.status(400).json(error1);
        }

        const id = req.params.id;
        const { nombre, marca, placa, modelo, cantidad, manual, serial, descripcion, estado, id_usuario, id_area, id_ambiente } = req.body;

        // Verificar si req.file está definido
        const imagen = req.file ? req.file.originalname : '';

        const sql = `
            UPDATE maquina
            SET nombre=?, marca=?, placa=?, modelo=?, cantidad=?, manual=?, serial=?, imagen=?, descripcion=?, estado=?, id_usuario=?, id_area=?, id_ambiente=?
            WHERE id_maquina = ?
        `;
        
        const values = [nombre, marca, placa, modelo, cantidad, manual, serial, imagen, descripcion, estado, id_usuario, id_area, id_ambiente, id];

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
            message: 'Error en el servidor',
        });
    }
};
