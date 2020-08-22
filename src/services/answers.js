const ValidationError = require('../ValidationError')

module.exports = app => {
  const isAlreadyExists = async (answer) => {
    // obtem a lista de perguntas do quiz
    let answersList = await findAll({ questionId: answer.questionId })

    // procura uma resposta de mesmo texto no banco
    const answerDb = await findOne({ text: answer.text })

    // se houver a resposta repetida, verifica se ela é do mesmo quiz
    if(answerDb) {
      for(let i = 0; i < answersList.length; i++) {
        if (answersList[i].id === answerDb.id) throw new ValidationError('Já existe uma resposta igual para esta pergunta.')
      }
    }
  }

  const dataValidation = async (answer) => {
    // validação de compos
    if (!answer.text) throw new ValidationError('Sua resposta está vazia.')
    if (!answer.score) throw new ValidationError('Defina quantos pontos vale a resposta.')
    if (!answer.questionId) throw new ValidationError('Id da pergunta ausente.')
  }

  const findAll = (filter = {}) => {
    return app.db('answers').where(filter)
  }

  const findOne = (filter = {}) => {
    return app.db('answers').where(filter).first()
  }

  const save = async (answer) => {
    await dataValidation(answer)
    await isAlreadyExists(answer)

    // limite maximo é de 3 respostas por pergunta
    let isMaximumSize = await findAll({ questionId: answer.questionId })
    if(isMaximumSize.length === 3) throw new ValidationError('Esta pergunta já tem a quantidade máxima de respostas.')
    
    // * retorna todos os dados inseridos no banco
    return app.db('answers').insert(answer, '*')
  }

  const update = async (id, answer) => {
    await dataValidation(answer)
    await isAlreadyExists(answer)

    return app.db('answers')
      .where({ id })
      .update(answer, '*')
  }

  const remove = async (id) => {
    return app.db('answers')
      .where({ id })
      .del()
  }

  return { 
    save, findAll, findOne, update, remove
  }
}