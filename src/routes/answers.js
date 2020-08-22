const express = require('express')

module.exports = app => {
  const answersRouter = express.Router()

  answersRouter.post('/', async (req, res, next) => {
    app.services.answers.save({ ...req.body })
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err))
  })

  answersRouter.get('/', (req, res, next) => {
    app.services.answers.findAll()
      .then(result => { res.status(200).json(result) })
      .catch(err => next(err))
  })

  answersRouter.get('/:id', (req, res, next) => {
    app.services.answers.findOne({ id: req.params.id })
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  })

  answersRouter.put('/:id', (req, res, next) => {
    app.services.answers.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err))
  })

  answersRouter.delete('/:id', (req, res, next) => {
    app.services.answers.remove(req.params.id)
      .then(() => res.status(200).json({ alert: 'Resposta removida.' }))
      .catch(err => next(err))
  })

  return answersRouter
}