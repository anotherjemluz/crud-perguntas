exports.up = function(knex) {
  return knex.schema.createTable('answers', (t) => {
    t.increments('id').primary()
    t.string('text').notNull()
    t.integer('score').notNull();
    t.integer('questionId').unsigned().references('id').inTable('questions').onDelete('CASCADE').notNull()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('answers')
};
