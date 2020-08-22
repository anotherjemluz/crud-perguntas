module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'quiz',
      user: 'postgres',
      password: 'admin'
    },
    migrations: {
      diretory: __dirname + '/back/migrations'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      diretory: __dirname + '/back/migrations'
    }
  }
}