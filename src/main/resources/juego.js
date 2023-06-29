const $ = require('jquery');
global.$ = global.jQuery = $;

const fs = require('fs');
const path = require('path');

function initializeGame() {
    function generarCuadro() {
        var imagenes = $('#imageContainer').find('img');
        var numImagenes = imagenes.length;

        var numCols = 3; // Número de columnas deseado
        var numRows = Math.ceil(numImagenes / numCols); // Calcular el número de filas

        var container = $('#container');
        container.html(''); // Limpiar el contenido actual

        for (var i = 0; i < numRows; i++) {
            var row = $('<div>').addClass('row');

            for (var j = 0; j < numCols; j++) {
                var imgIndex = i * numCols + j;
                if (imgIndex < numImagenes) {
                    var img = $(imagenes[imgIndex]).clone();
                    var block = $('<div>').addClass('block');
                    block.css('background-image', 'url(' + img.attr('src') + ')');
                    block.css('background-size', '190px 200px');
                    block.append(img);
                    row.append(block);
                }
            }

            container.append(row);
        }
    }

    $('#inputFile').on('change', loadImages);

    function loadImages() {
        var filesInput = $('#inputFile')[0];
        var files = filesInput.files;
        var imageContainer = $('#imageContainer');
        var imageCount = $('#imageCount');

        if (imageCount.text() >= 15) {
            alert('Solo se aceptan 15 imágenes');
            return;
        }

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            if (!file.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();
            reader.onload = (function (aFile) {
                return function (e) {
                    var imgContainer = $('<div>').addClass('image-item');

                    var closeButton = $('<span>').addClass('close-button');
                    closeButton.html('&times;');
                    closeButton.on('click', function() {
                        deleteImage(imgContainer);
                    });

                    var img = $('<img>').addClass('thumbnail');
                    img.css('width', '190px');
                    img.css('height', '200px');
                    img.attr('src', e.target.result);

                    imgContainer.append(closeButton);
                    imgContainer.append(img);
                    imageContainer.append(imgContainer);
                    imageCount.text(parseInt(imageCount.text()) + 1);
                };
            })(file);

            reader.readAsDataURL(file);
        }
    }

    function deleteImage(imageContainer) {
        var imageCount = $('#imageCount');
        imageCount.text(parseInt(imageCount.text()) - 1);
        imageContainer.remove();
    }

    $('#Aleatorizar').on('click', aleatorizar);

    function aleatorizar() {
        var blocks = $('.block');
        var imageArray = [];

        for (var i = 0; i < blocks.length; i++) {
            var block = $(blocks[i]);
            var img = block.find('img').eq(0);
            imageArray.push(img);
        }

        shuffleArray(imageArray); // Aleatorizar las imágenes

        for (var i = 0; i < blocks.length; i++) {
            var block = $(blocks[i]);
            var img = imageArray[i].clone();
            block.html('');
            block.css('background-image', 'url(' + img.attr('src') + ')');
            block.append(img);
        }
    }

    function shuffleArray(array) {
        var currentIndex = array.length;
        var temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write('Archivo no encontrado');
            } else {
                res.write(data);
            }
            res.end();
        });
    } else if (req.url === '/script.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        fs.readFile(path.join(__dirname, 'script.js'), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write('Archivo no encontrado');
            } else {
                res.write(data);
            }
            res.end();
        });
    } else {
        res.writeHead(404);
        res.write('Página no encontrada');
        res.end();
    }
});

server.listen(3000, 'localhost', () => {
    console.log('Servidor en ejecución en http://localhost:3000/');
});

initializeGame();
