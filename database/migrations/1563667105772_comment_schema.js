'use strict'

const Schema = use('Schema')
/** Classe da model comments com os campos id, user_id, publication_id, date, comment  **/
class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
        table.integer('user_id').unsigned().notNullable()
        table.integer('publication_id').unsigned().notNullable()
        table.text('comment').notNullable()
        table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
