import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import auRouter from './src/router/autenticacion.routes.js';
import usuarioRouter from './src/router/usuario.routes.js';
import maquinaRouter from './src/router/maquina.routes.js';
import mantenimientoRouter from './src/router/mantenimiento.routes.js';
import ambienteRouter from './src/router/ambiente.routes.js';
import areaRouter from './src/router/area.routes.js';
import login from './src/router/login.routes.js';
import count from './src/router/contador.routes.js';
import Nman from './src/router/Nmantenimiento.routes.js';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: ".env" })


const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser());
app.use(cors({
    origin: 'http://' + process.env.IP_HOST + ':5173', //
    credentials: true,
}));

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.get('/documents', (req, res) => {
    res.render('index.ejs');
});

app.use(express.static('./public'));

export const __dirname = dirname(fileURLToPath(import.meta.url));
app.use('/images', express.static(join(__dirname, 'public')));


app.use(auRouter);
app.use('/usuario', usuarioRouter);
app.use('/maquina', maquinaRouter);
app.use('/mantenimiento', mantenimientoRouter);
app.use('/ambiente', ambienteRouter);
app.use('/area', areaRouter);
app.use('/api', login);
app.use('/notificacion', Nman);
app.use(count);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});