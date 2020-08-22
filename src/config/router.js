const express = require('express')

module.exports = app => {
  const Router = express.Router()

  Router.use('/questionnaires', app.routes.questionnaires)
  Router.use('/questions', app.routes.questions)
  Router.use('/answers', app.routes.answers)

  // roteador rotegido VERSÂO 1
  app.use('/', Router)
}