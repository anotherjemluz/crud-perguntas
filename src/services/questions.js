const ValidationError = require('../ValidationError')

module.exports = app => {
  const isAlreadyExists = async (question) => {
    // obtem a lista de perguntas do quiz
    let questionsList = await findAll({ quizId: question.quizId })

    // procura uma pergunta de mesmo texto no banco
    const questionDb = await findOne({ text: question.text })

    // se houver a pergunta repetida, verifica se ela é do mesmo quiz
    if(questionDb) {
      for(let i = 0; i < questionsList.length; i++) {
        if (questionsList[i].id === questionDb.id) throw new ValidationError('Já existe uma pergunta neste quiz com mesmo conteúdo.')
      }
    }
  }

  const dataValidation = async (question) => {
    // validação de campos
    if (!question.text) throw new ValidationError('Sua pergunta precisa ser preenchida.')
    if (!question.quizId) throw new ValidationError('Id do quiz ausente.')
  }

  const findAll = (filter = {}) => {
    return app.db('questions').where(filter)
  }

  const findOne = (filter = {}) => {
    return app.db('questions').where(filter).first()
  }

  const save = async (question) => {
    await dataValidation(question)
    await isAlreadyExists(question)

    // * retorna todos os dados inseridos no banco
    return app.db('questions').insert(question, '*')
  }

  const update = async (id, question) => {
    await dataValidation(question)
    await isAlreadyExists(question)
    
    return app.db('questions')
      .where({ id })
      .update(question, '*')
  }

  const remove = async (id) => {
    return app.db('questions')
      .where({ id })
      .del()
  }

  return { 
    save, findAll, findOne, update, remove
  }
}