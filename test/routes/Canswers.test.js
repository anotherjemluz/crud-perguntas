const request = require('supertest')
const app = require('../../src/app')

const MAIN_ROUTE = '/answers'

const text = `${Date.now()} Answer Here`
const score = 10

// inserção de dados antes dos testes
beforeAll(async () => {
  // registra 3 quizes
  const reqQuiz = await app.services.questionnaires.save({ title: `${Date.now()} Title (Answer Test)` })
  dummyQuiz = { ...reqQuiz[0] }

  // registra 1 questão no primeiro quiz
  const reqQuestion = await app.services.questions.save({ text: `${Date.now()} Question 1 (Answer Test)`, quizId: dummyQuiz.id })
  dummyQuestion = { ...reqQuestion[0] }

  // registra 1 questão no primeiro quiz
  const reqQuestion2 = await app.services.questions.save({ text: `${Date.now()} Question 2`, quizId: dummyQuiz.id })
  dummyQuestion2 = { ...reqQuestion2[0] }

  // registra 3 respostas na questão anterior
  const reqAnswer = await app.services.answers.save({ text: `${Date.now()} Answer 1 (Answer Test)`, score: 10, questionId: dummyQuestion.id })
  dummyAnswer = { ...reqAnswer[0] }

  const reqAnswer2 = await app.services.answers.save({ text: `${Date.now()} Answer 2 (Answer Test)`, score: 10, questionId: dummyQuestion.id })
  dummyAnswer2 = { ...reqAnswer2[0] }

  const reqAnswer3 = await app.services.answers.save({ text: `${Date.now()} Answer 3 (Answer Test)`, score: 10, questionId: dummyQuestion.id })
  dummyAnswer3 = { ...reqAnswer3[0] }
})

test('Deve inserir uma resposta no banco', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ text, score, questionId: dummyQuestion2.id })
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.text).toBe(text)
      expect(res.body.score).toBe(score)
    })
})

describe('Não deve inserir uma resposta quando:', () => {
  const testTemplate = (newData, errorMessage) => { 
    return request(app).post(MAIN_ROUTE)
      .send({ 
        text,
        score,
        questionId: dummyQuestion.id, 
        ...newData
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe(errorMessage)
      })
  }

  test('não houver conteúdo', () => testTemplate({ text: null }, 'Sua resposta está vazia.'))
  test('os pontos não forem informados', () => testTemplate({ score: null }, 'Defina quantos pontos vale a resposta.'))
  test('não referenciar a questão', () => testTemplate({ questionId: null }, 'Id da pergunta ausente.'))
  
  test('houver conteúdo repetido', () => testTemplate({ text: dummyAnswer.text, questionId: dummyQuestion.id }, 'Já existe uma resposta igual para esta pergunta.'))
})

test('Não deve inserir mais de 3 respostas para uma pergunta', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ text, score, questionId: dummyQuestion.id })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Esta pergunta já tem a quantidade máxima de respostas.')
    })
})

test('Deve listar todas as respostas', () => {
  return request(app).get(MAIN_ROUTE)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
    })
})

test('Deve atualizar uma resposta no banco', async () => {
  let updatedText = `${Date.now()} New Answer`
  const res = await request(app).put(`${MAIN_ROUTE}/${dummyAnswer.id}`)
    .send({ text: updatedText, score, questionId: dummyQuestion.id })
      expect(res.status).toBe(200)
    expect(res.body.text).toBe(updatedText)
})

test('Não deve atualizar uma resposta já existente para a pergunta', () => {
  return request(app).put(`${MAIN_ROUTE}/${dummyAnswer2.id}`)
    .send({ text: dummyAnswer2.text, score, questionId: dummyQuestion.id })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Já existe uma resposta igual para esta pergunta.')
    })
})

test('Deve remover uma resposta do banco', () => {
  return request(app).delete(`${MAIN_ROUTE}/${dummyAnswer.id}`)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.alert).toBe('Resposta removida.')
    })
})