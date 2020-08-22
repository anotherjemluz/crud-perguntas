const express = require('express')

module.exports = app => {
  const questionsRouter = express.Router()

  questionsRouter.post('/', async (req, res, next) => {
    app.services.questions.save({ ...req.body })
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err))
  })

  questionsRouter.get('/', (req, res, next) => {
    app.services.questions.findAll()
      .then(result => { res.status(200).json(result) })
      .catch(err => next(err))
  })

  questionsRouter.get('/:id', async (req, res, next) => {
    let answersList = await app.services.answers.findAll({ questionId: req.params.id })

    app.services.questions.findOne({ id: req.params.id })
      .then(result => {
        result.aList = answersList
        res.status(200).json(result)
      })
      .catch(err => next(err))
  })

  questionsRouter.put('/:id', (req, res, next) => {
    app.services.questions.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err))
  })

  questionsRouter.delete('/:id', (req, res, next) => {
    app.services.questions.remove(req.params.id)
      .then(() => res.status(200).json({ alert: 'Pergunta removida.' }))
      .catch(err => next(err))
  })

  return questionsRouter
}