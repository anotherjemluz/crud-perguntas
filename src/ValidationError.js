// tratamento genérico para erros
module.exports = function ValidationError(message) {
  this.name = 'ValidationError'
  this.message = message
}