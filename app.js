// modulo da aplicação utilizado pelo teste e pelo servidor
const express = require('express')
const app = express()

const consign = require('consign')
const path = require('path');
const favicon = require('express-favicon');
var history = require('connect-history-api-fallback');
const port = process.env.PORT || 3000;

// database config
const knex = require('knex')
const knexfile = require('./knexfile')
// const env = process.env.NODE{}
app.db = knex(knexfile.production)

// habilita o diretorio do favicon
app.use(favicon(__dirname + '/dist/favicon.ico'));

// habilita navegação do vue router
app.use(history({ verbose: true }));

// habilita os diretorios
app.use(express.static(__dirname + '/dist'));
app.use(express.static(path.join(__dirname + '/dist', 'build')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist', 'build', 'index.html'));
});

// cwd => especifica o diretorio padrao para o consign
// verbose => omite a inicialização do consign
// (o consign é responsável por organizar e injetar dependencias na aplicação)
consign({ cwd: process.cwd()+'src', verbose: true })
  .then('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/router.js')
  .into(app)

// teste generico de rota
// app.get('/', (req, res) => { res.status(200).send('oi') })

// middleware para tratamento de erros
// verificar o ValidationError.js
app.use((err, req, res, next) => {
  const { name, message } = err
  if (name === 'ValidationError') res.status(400).json({ error: message })
  next(err)
})

app.listen(port, () => {
  console.log('Backend rodando...');
}); 

module.exports = app