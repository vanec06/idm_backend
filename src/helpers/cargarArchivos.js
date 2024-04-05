import fsPromises from 'fs/promises';
import path from 'path';
import { __dirname } from '../../app.js';
import fs from 'fs';

export const cargarArchivo = async (files, folder) => {

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