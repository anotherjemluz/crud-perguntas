exports.up = function(knex) {
  return knex.schema.createTable('questionnaires', (t) => {
    t.increments('id').primary()
    t.string('title').notNull()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('questionnaires')
};
