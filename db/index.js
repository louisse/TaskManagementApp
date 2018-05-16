const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Louisse',
  password: 'louisse67',
  port: 5432,
});


module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
};