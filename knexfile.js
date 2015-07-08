module.exports = {

  client: 'postgresql',
  connection: {
    host     : process.env.APP_DB_HOST     || ,
    user     : process.env.APP_DB_USER     || ,
    password : process.env.APP_DB_PASSWORD || ,
    database : process.env.APP_DB_NAME     || 
  },
  
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }

};