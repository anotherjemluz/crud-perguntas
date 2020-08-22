const express = require('express')

module.exports = app => {
  const questionnairesRouter = express.Router()

  questionnairesRouter.post('/', async (req, res, next) => {
    app.services.questionnaires.save({ ...req.body })
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err))
  })

  questionnairesRouter.get('/', (req, res, next) => {
    app.services.questionnaires.findAll()
      .then(result => {
        res.status(200).json(result) 
      })
      .catch(err => next(err))
  })

  questionnairesRouter.get('/:id', async (req, res, next) => {
    let questionsList = await app.services.questions.findAll({ quizId: req.params.id })

    for(let i = 0; i < questionsList.length; i++) {
      let answersList = await app.services.answers.findAll({ questionId: questionsList[i].id })

      questionsList[i].aList = answersList
    }

    app.services.questionnaires.findOne({ id: req.params.id })
      .then(result => {
        result.qList = questionsList
        res.status(200).json(result)
      })
      .catch(err => next(err))
  })

  questionnairesRouter.put('/:id', (req, res, next) => {
    app.services.questionnaires.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err))
  })

  questionnairesRouter.delete('/:id', (req, res, next) => {
    app.services.questionnaires.remove(req.params.id)
      .then(() => res.status(200).json({ msg: 'Quiz removido.' }))
      .catch(err => next(err))
  })

  return questionnairesRouter
}