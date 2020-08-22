exports.up = function(knex) {
  return knex.schema.createTable('questions', (t) => {
    t.increments('id').primary()
    t.string('text').notNull()
    t.integer('quizId').unsigned().references('id').inTable('questionnaires').onDelete('CASCADE').notNull()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('questions')
};
