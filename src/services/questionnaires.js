const ValidationError = require('../ValidationError')

module.exports = app => {
  const findAll = () => {
    return app.db('questionnaires')
  }

  const findOne = (filter = {}) => {
    return app.db('questionnaires').where(filter).first()
  }

  const save = async (q) => {
    // validação de compos
    if (!q.title) throw new ValidationError('Seu questionário precisa de um titulo.')

    // verificação de dados no banco
    const qDb = await findOne({ title: q.title })
    if (qDb) throw new ValidationError('Já existe um questionário com esse título.')
    
    // * retorna todos os dados inseridos no banco
    return app.db('questionnaires').insert(q, '*')
  }

  const update = async (id, q) => {
    // validação de compos
    if (!q.title) throw new ValidationError('Seu questionário precisa de um titulo.')
    
    // verificação de registros no banco
    const qDb = await findOne({ title: q.title })
    if (qDb) throw new ValidationError('Já existe um questionário com esse título.')
    
    return app.db('questionnaires')
      .where({ id })
      .update(q, '*')
  }

  const remove = async (id) => {
    return app.db('questionnaires')
      .where({ id })
      .del()
  }

  return { 
    save, findAll, findOne, update, remove
  }
}