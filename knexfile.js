var config = require('./config.js');

module.exports = {

  client: 'postgresql',
  connection: {
    host     : process.env.APP_DB_HOST     || config.db_host,
    user     : process.env.APP_DB_USER     || config.db_user,
    password : process.env.APP_DB_PASSWORD || config.db_password,
    database : process.env.APP_DB_NAME     || config.db_database
  },
  
  pool: {
    min: 0,
    max: 10
  }//,
  // migrations: {
  //   tableName: 'knex_migrations'
  // }

};




