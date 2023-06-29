const express = require('express');
const mysql = require('mysql2');
const bp = require('body-parser');
const multer = require('multer');
const app = express();

app.use(bp.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('images'), function (req, res) {

    let conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'lab10',
        port: 3306
    });

    conn.connect(function(err) {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            res.status(500).json({ error: 'Error al conectar con la base de datos' });
            return;
        }

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const filePath = file.path; // Ruta del archivo en el servidor

            const query = 'INSERT INTO imagenes (imagen) VALUES (?)'; // Cambio en la columna de la tabla
            conn.query(query, [filePath], function(error, results, fields) {
                if (error) {
                    console.error('Error al guardar la imagen en la base de datos:', error);
                    res.status(500).json({ error: 'Error al guardar la imagen en la base de datos' });
                    return;
                }
                console.log('Imagen guardada en la base de datos');
            });
        }

        res.status(200).json({ message: 'Imágenes subidas y guardadas en la base de datos' });
    });
});

// Iniciar el servidor
app.listen(3000, function () {
    console.log('Servidor iniciado en el puerto 3000');
});
