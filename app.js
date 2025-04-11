const express = require('express');
const bodyParser = require('body-parser');
const rutas = require('./src/routes');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});

app.use('/', rutas);

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));