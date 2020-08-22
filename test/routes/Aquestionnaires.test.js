const request = require('supertest')
const app = require('../../src/app')

const MAIN_ROUTE = '/questionnaires'
const title = `${Date.now()} Random Title`
const newTitle = `New Title`

// inserção de dados antes dos testes
beforeAll(async () => {
  // registra 3 quizes
  const reqQuiz = await app.services.questionnaires.save({ title: `${Date.now()} Title 1 (Quiz Test)` })
  dummyQuiz = { ...reqQuiz[0] }

  // registra 1 questão no primeiro quiz
  const reqQuestion = await app.services.questions.save({ text: `${Date.now()} Question 1 (Quiz Test)`, quizId: dummyQuiz.id })
  dummyQuestion = { ...reqQuestion[0] }

  // registra 3 respostas na questão anterior
  const reqAnswer = await app.services.answers.save({ text: `${Date.now()} Answer 1 (Quiz Test)`, score: 10, questionId: dummyQuestion.id })
  dummyAnswer = { ...reqAnswer[0] }

  const reqAnswer2 = await app.services.answers.save({ text: `${Date.now()} Answer 2 (Quiz Test)`, score: 10, questionId: dummyQuestion.id })
  dummyAnswer2 = { ...reqAnswer2[0] }

  const reqAnswer3 = await app.services.answers.save({ text: `${Date.now()} Answer 3 (Quiz Test)`, score: 10, questionId: dummyQuestion.id })
  dummyAnswer3 = { ...reqAnswer3[0] }
})

test('Deve inserir um quiz no banco', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ title })
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.title).toBe(title)
    })
})

describe('Não deve inserir um quiz quando:', () => {
  const testTemplate = (newData, errorMessage) => { 
    return request(app).post(MAIN_ROUTE)
      .send({ 
        title,  
        ...newData
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe(errorMessage)
      })
  }

  test('não houver título', () => testTemplate({ title: null }, 'Seu questionário precisa de um titulo.'))
  test('houver título repetido', () => testTemplate({ title: dummyQuiz.title }, 'Já existe um questionário com esse título.'))
})

test('Deve listar todos os quizes', () => {
  return request(app).get(MAIN_ROUTE)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
    })
})
5
test('Deve listar um quiz completo', () => {
  return request(app).get(`${MAIN_ROUTE}/${dummyQuiz.id}`)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body).not.toBeNull()
      expect(res.body).toHaveProperty('qList')
      expect(res.body.qList).not.toBeNull()
    })
})

test('Deve atualizar um quiz no banco', async () => {

  const res = await request(app).put(`${MAIN_ROUTE}/${dummyQuiz.id}`)
    .send({ title: newTitle })

  expect(res.status).toBe(200)
  expect(res.body.title).toBe(newTitle)
})

test('Não deve atualizar um quiz com titulo existente', () => {
  return request(app).put(`${MAIN_ROUTE}/${dummyQuiz.id}`)
    .send({ title: newTitle })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Já existe um questionário com esse título.')
    })
})

test('Deve remover um quiz do banco', () => {
  return request(app).delete(`${MAIN_ROUTE}/${dummyQuiz.id}`)
    .then(res => {
      console.log(res)
      expect(res.status).toBe(200)
      expect(res.body.msg).toBe('Quiz removido.')
    })
})