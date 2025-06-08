const { Pool } = require('pg');

const pool = new Pool({
    user: 'lucacolazo',
    host: 'localhost',
    database: 'todo_app',
    password: '',
    port: 5432,
});

module.exports = pool; 