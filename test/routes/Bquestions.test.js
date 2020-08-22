const request = require('supertest')
const app = require('../../src/app')

const MAIN_ROUTE = '/questions'

const text = `${Date.now()} Question Here`

// inserção de dados antes dos testes
beforeAll(async () => {
  // registra 3 quizes
  const reqQuiz = await app.services.questionnaires.save({ title: `${Date.now()} Title (Question Test)` })
  dummyQuiz = { ...reqQuiz[0] }

  // registra 1 questão no primeiro quiz
  const reqQuestion = await app.services.questions.save({ text: `${Date.now()} Question 1 (Question Test)`, quizId: dummyQuiz.id })
  dummyQuestion = { ...reqQuestion[0] }

  // registra 1 questão no primeiro quiz
  const reqQuestion2 = await app.services.questions.save({ text: `${Date.now()} Question 2 (Question Test)`, quizId: dummyQuiz.id })
  dummyQuestion2 = { ...reqQuestion2[0] }

  // registra 3 respostas na questão anterior
  const reqAnswer = await app.services.answers.save({ text: `${Date.now()} Answer 1 (Question Test)`, score: 10, questionId: dummyQuestion.id })
  dummyAnswer = { ...reqAnswer[0] }

  const reqAnswer2 = await app.services.answers.save({ text: `${Date.now()} Answer 2 (Question Test)`, score: 10, questionId: dummyQuestion.id })
  dummyAnswer2 = { ...reqAnswer2[0] }

  const reqAnswer3 = await app.services.answers.save({ text: `${Date.now()} Answer 3 (Question Test)`, score: 10, questionId: dummyQuestion.id })
  dummyAnswer3 = { ...reqAnswer3[0] }
})

test('Deve inserir uma pergunta no banco', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ text, quizId: dummyQuiz.id })
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.text).toBe(text)
    })
})

describe('Não deve inserir uma pergunta quando:', () => {
  const testTemplate = (newData, errorMessage) => { 
    return request(app).post(MAIN_ROUTE)
      .send({ 
        text,
        quizId: dummyQuiz.id, 
        ...newData
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe(errorMessage)
      })
  }

  test('não referenciar o quiz', () => testTemplate({ quizId: null }, 'Id do quiz ausente.'))
  test('não houver conteúdo na pergunta', () => testTemplate({ text: null }, 'Sua pergunta precisa ser preenchida.'))
  test('houver título repetido', () => testTemplate({ text: dummyQuestion.text }, 'Já existe uma pergunta neste quiz com mesmo conteúdo.'))
})

test('Deve listar todas as perguntas', () => {
  return request(app).get(MAIN_ROUTE)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
    })
})

test('Deve listar uma pergunta completa', () => {
  return request(app).get(`${MAIN_ROUTE}/${dummyQuestion.id}`)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body).not.toBeNull()
      expect(res.body).toHaveProperty('aList')
    })
})

test('Não deve atualizar uma pergunta já existente no quiz', () => {
  return request(app).put(`${MAIN_ROUTE}/${dummyQuestion.id}`)
    .send({ text: dummyQuestion.text, quizId: dummyQuiz.id })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Já existe uma pergunta neste quiz com mesmo conteúdo.')
    })
})

test('Deve atualizar uma pergunta no banco', async () => {
  let updateText = `${Date.now()} New Title`

  return request(app).put(`${MAIN_ROUTE}/${dummyQuestion.id}`)
    .send({ text: updateText, quizId: dummyQuiz.id })
    .then(res => {
      expect(res.status).toBe(200)
    expect(res.body.text).toBe(updateText)
    })
})

test('Deve remover uma pergunta do banco', () => {
  return request(app).delete(`${MAIN_ROUTE}/${dummyQuestion2.id}`)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.alert).toBe('Pergunta removida.')
    })
})