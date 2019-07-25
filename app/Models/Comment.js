'use strict'

const Model = use('Model')

class Comment extends Model {

 /** Um usuário pode comentar vaŕias vezes uma publicação, enquanto um comentário pertence a um usuário em particular. Relacionamento one-to-many **/

	 user () {
	    return this.belongsTo('App/Models/User')
	 }

/** Uma publicação pode ter vários comentários, mas um comentário só pode pertencer a uma publicação. Relacionamento
entre publications e comments é one-to-many **/
	publication() {
	    return this.belongsTo('App/Models/Publication')
	}
}

module.exports = Comment
