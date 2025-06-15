const mysql = require('mysql2/promise'); // Use o mysql2/promise
let vcont = 0;
async function connect() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'admin',
            database: 'ecogasto',
        });
        vcont += 1;
        console.log("Banco MySQL conectado! ", vcont);
        return connection;
    } catch (err) {
        console.error("Erro ao conectar ao banco de dados MySQL:", err);
        throw err; // Lança o erro caso a conexão falhe
    }
}

module.exports = connect;
