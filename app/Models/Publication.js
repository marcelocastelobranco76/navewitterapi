'use strict'

const Model = use('Model')

class Publication extends Model {

  /** Um usuário pode postar várias publicações, mas uma publicação pode pertencer apenas a um usuário **/
  /** O relacionamento entre users e publications é um relacionamento one-to-many **/
  
  user () { 
    return this.belongsTo('App/Models/User')
  }

 /** Uma publicação pode ter vários comentários, mas um comentário só pode pertencer a uma publicação. Relacionamento
entre publications e comments é one-to-many **/

  comments() {
    return this.hasMany('App/Models/Comment')
  }

}

module.exports = Publication
