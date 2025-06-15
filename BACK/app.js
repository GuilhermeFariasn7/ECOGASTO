const express = require('express');
const cors = require('cors');
const app = express();

const uploadRoute = require('./routes/upload');
const path = require('path');

// Middleware para permitir acesso à pasta pública
app.use('/imagensitem', express.static(path.join(__dirname, 'public/imagensitem')));


app.use(cors());
app.use(express.json());

// Conexão com o banco de dados MySQL
const conn = require('./db/conn');
conn();

const routes = require('./routes/router');
app.use('/api', uploadRoute);
app.use('/api', routes);



//----------------------------------------------------------------------

app.listen(8080, () => {
    console.log("Servidor online!");
});
