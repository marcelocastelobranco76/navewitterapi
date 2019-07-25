'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
  /** Um usuário pode postar várias publicações, mas uma publicação pode pertencer apenas a um usuário **/
  /** O relacionamento entre users e publications é um relacionamento one-to-many **/
  
  publications () { 
    return this.hasMany('App/Models/Publication')
  }

 /** Um usuário pode comentar vaŕias vezes uma publicação, enquanto um comentário pertence a um usuário em particular. Relacionamento one-to-many **/

 comments () {
    return this.hasMany('App/Models/Comment')
 }
}

module.exports = User
