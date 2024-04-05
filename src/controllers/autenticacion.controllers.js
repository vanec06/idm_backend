import { pool } from '../database/conexion.js';
import jwt from 'jsonwebtoken';
import { transporter } from '../helpers/nodemailer.js';

export const validarUsuario = async (req, res) => {
    try {
        if (!req.body || !req.body.identificacion || !req.body.contraseña) {
            return { status: 400, message: 'Falta la identificación o contraseña en la solicitud' };
        }

        const { identificacion, contraseña } = req.body;

        let sql = `SELECT id_usuario, nombres, rol, identificacion FROM usuario WHERE identificacion = ? and contraseña = ?`;
        const [rows] = await pool.query(sql, [identificacion, contraseña]);

        if (rows.length > 0) {
            let token = jwt.sign({ user: rows }, process.env.AUT_SECRET, { expiresIn: process.env.AUT_EXPIRE });
            return { status: 200, token: token, message: 'Usuario autorizado..' };
        } else {
            return { status: 401, message: 'Usuario no encontrado...' };
        }
    } catch (e) {
        console.error('Error en el sistema:', e);
        return { status: 500, message: 'Error en el sistema' };
    }
};

export const validarToken = async (req, res, next) => {

    try {
        let token_usuario = req.headers['token'];

        if (!token_usuario) {
            return res.status(401).json({ message: 'Se requiere el token...' });
        } else {

            const decoded = jwt.verify(token_usuario, process.env.AUT_SECRET, (error, decoded) => {
                if (error) {
                    if (error.name === 'TokenExpiredError') {
                        return res.status(401).json({ message: 'Token caducado', autorizado: false });
                    } else {
                        return res.status(401).json({ message: 'Token inválido', autorizado: false });
                    }
                } else {
                    next();
                }
            });
        }
    } catch (e) {
        return res.status(401).json({ message: 'Error al validar el token: ' + e });
    }
}

export const validarRuta = async (req, res) => {

    try {
        let token_usuario = req.cookies.token;
        // console.log('TOKEN: ', token_usuario);
        if (!token_usuario) {
            return res.status(200).json({ autorizado: false, message: 'Se requiere el token...' });
        } else {

            const decoded = jwt.verify(token_usuario, process.env.AUT_SECRET, (error, decoded) => {
                if (error) {
                    if (error.name === 'TokenExpiredError') {
                        return res.status(200).json({ message: 'Token caducado', autorizado: false });
                    } else {
                        return res.status(200).json({ message: 'Token inválido', autorizado: false });
                    }
                } else {
                    return res.status(200).json({ message: 'Token valido', autorizado: true, user: decoded.user[0] });
                }
            });
        }
    } catch (e) {
        return res.status(500).json({ message: 'Error al validar el token: ' + e });
    }
}

export const recuperarContraseña = async (req, res) => {
    try {
        const { correo } = req.body;

        let sql = 'SELECT contraseña FROM usuario WHERE correo = ? and estado = 1';
        const [rows] = await pool.query(sql, correo);

        if (rows.length > 0) {
            const resp = await transporter.sendMail({
                from: 'idmsena2024@outlook.com',
                to: req.body.correo,
                subject: 'IDM - Recuperación de contraseña',
                html: `<p> Estimado usuario, <br> La contraseña para que pueda obtener accesso al sistema IDM es la siguiente: <br> <b>Contraseña</b> ${rows[0].contraseña} <p>`
            })

            if (resp.messageId) {
                return res.status(200).json({
                    status: true,
                    message: "Recuperación exitosa, por favor, revise su correo"
                })
            } else {
                res.status(200).json({
                    status: false,
                    messge: 'Ocurrió un error al recuperar contraseña.'
                });
            }

        } else {
            return res.status(200).json({
                status: false,
                empty: "EL correo ingresado no existe"
            })
        }
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: "Ocurrió un error interno. " + e
        })
    }
}