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

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.get('/documents', (req, res) => {
    res.render('index.ejs');
});

app.use(express.static('./public'));

app.use(auRouter);
app.use('/usuario', usuarioRouter);
app.use('/maquina', maquinaRouter);
app.use('/mantenimiento', mantenimientoRouter);
app.use('/ambiente', ambienteRouter);
app.use('/area', areaRouter);
app.use('/api', login);
app.use(count)
app.use(Nman)

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});