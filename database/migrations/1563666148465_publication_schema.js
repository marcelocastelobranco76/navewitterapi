'use strict'

const Schema = use('Schema')
/** Classe da model publications com os campos id, user_id, date, publication  **/
class PublicationSchema extends Schema {
  up () {
    this.create('publications', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable()
      table.text('publication').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('publications')
  }
}

module.exports = PublicationSchema
