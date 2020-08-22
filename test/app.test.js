// acessar a raiz da aplicaçao e verificar se a resposta foi 200
// utilizar return ou await para sincronizar a função

const request = require('supertest')
const app = require('../src/app')

test('Deve responder na raiz', () => {
  return request(app).get('/').then(res => { expect(res.status).toBe(200) })
})