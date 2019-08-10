	'use strict'
	const Publication = use('App/Models/Publication')
	const Comment = use('App/Models/Comment')

	class PublicationController {

			/**
			   * Create a publication
			   *
			   * @method createPublication
			   *
			   * @param  {Object} request
			   * @param  {Object} auth
			   * @param  {Object} response
			   *
			   * @return {JSON}
			   */

				async createPublication ({ request, auth, response }) { 
				    /** Get loggged in user **/
				    const user = auth.current.user

				    /** Save publication in database **/
				    const publication = await Publication.create({
					user_id: user.id,
					publication: request.input('publication')
				    })

				    /** Load all relationships schemas **/
				    await publication.loadMany(['user','comments'])

				    return response.json({
					status: 'success',
					message: 'Publication registered!',
					data: publication
				    })
				}
				/**
				   * Update a publication
				   *
				   * @method editPublication
				   *
				   * @param  {Object} request
				   * @param  {Object} auth
				   * @param  {Object} params
				   * @param  {Object} response
				   *
				   * @return {JSON}
				   */
				async editPublication ({ request, params, auth, response }) { 
				    try {
					/** Get logged in user **/
					const user = auth.current.user

					/**Fetch publication accordly with logged in user ID **/
					    const publication = await Publication.query()
					      .where('user_id', user.id)
					      .where('id', params.id)
					      .firstOrFail()

					/** Update with new information **/
					
					publication.publication = request.input('publication')
					
					await publication.save()

					return response.json({
					    status: 'success',
					    message: 'Publication updated!',
					    data: user
					})
				    } catch (error) {
					return response.status(400).json({
					    status: 'error',
					    message: 'Error trying to update publication. Try again later.'
					})
				    }
			   }

			  /**
			   * Fetch a publication
			   *
			   * @method viewPublication
			   *
			   * @param  {Object} request 
			   * @param  {Object} params
			   * @param  {Object} auth
			   * @param  {Object} response
		           *
			   * @return {JSON}
			   */
				async viewPublication ({ request, params, auth, response }) { 
					/**Get logged in user **/
					const user = auth.current.user

				    try {
					const publication = await Publication.query()
					    .where('id', params.id)
				            .where('user_id', user.id)
					    .with('user')
					    .with('comments')
					    .with('comments.user')
					    .firstOrFail()

					return response.json({
					    status: 'success',
					    data: publication
					})
				    } catch (error) {
					return response.status(404).json({
					    status: 'error',
					    message: 'Publication not found.'
					})
				    }
				}

				 /**
				   * Delete a publication
				   *
				   * @method deletePublication
				   *
				   * @param  {Object} request
				   * @param  {Object} auth
				   * @param  {Object} params
				   * @param  {Object} response
				   *
				   * @return {NULL}
				   */	

				async deletePublication ({ request, auth, params, response }) {
					    /** Get current authenticated user **/
					    const user = auth.current.user

					    /** Get publication accordly ID passed as params **/
					    const publication = await Publication.query()
					      .where('user_id', user.id)
					      .where('id', params.id)
					      .firstOrFail()

					    await publication.delete()

					    return response.json({
					      status: 'success',
					      message: 'Publication deleted!',
					      data: null
					    })
				}
				/**
				   * Authenticated user comments on his own post 
				   *
				   * @method createCommentPublication
				   *
				   * @param  {Object} request
				   * @param  {Object} auth
				   * @param  {Object} params
				   * @param  {Object} response
				   *
				   * @return {JSON}
				   */	


				async createCommentPublication ({ request, auth, params, response }) { /** Authenticated user comments on his own post **/
					    /** Get current authenticated user **/
					    const user = auth.current.user

					    /** Get publication accordly with ID passed as params  **/
					    const publication = await Publication.find(params.id)

					    /** Persist in database **/
					    const comment = await Comment.create({
						user_id: user.id,
						publication_id: publication.id,
						comment: request.input('comment')
					    })

					    /** Load authenticated user data **/
					    await comment.load('user')

					    return response.json({
						status: 'success',
						message: 'Comment registered!',
						data: comment
					    })
				}
				/**
				   * Authenticated user updates his own comment on his own publication 
				   *
				   * @method editCommentPublication
				   *
				   * @param  {Object} request
				   * @param  {Object} auth
				   * @param  {Object} params
				   * @param  {Object} response
				   *
				   * @return {JSON}
				   */	

				async editCommentPublication ({ request, auth, params, response }) { 
						try {
						/** Get logged in user**/
						const user = auth.current.user
						
						/**Fetch comment accordly with user ID, comment ID passed as params and publication ID  **/
						    const comment = await Comment.query()
						      .where('user_id', user.id)
						      .where('publication_id',params.idPublication)
						      .where('id', params.idComment)
						      .firstOrFail()

						/** Update with new information **/
						
						comment.comment = request.input('comment')
						
						await comment.save()
						await comment.load('user')
						return response.json({
						    status: 'success',
						    message: 'Comment updated!',
						    data: comment
						})
					    } catch (error) {

						return response.status(400).json({
						    status: 'error',
						    message: 'Error trying to update comment. Try again later.',
						    data: comment
						})
					    }
			      
	            }
				/**
				   * Authenticated user views his own comment on his own publication 
				   *
				   * @method viewCommentPublication
				   *
				   * @param  {Object} request
				   * @param  {Object} auth
				   * @param  {Object} params
				   * @param  {Object} response
				   *
				   * @return {JSON}
				   */

				async viewCommentPublication({ request, params, auth, response }) { 

					try {
						/** Get logged in user **/
						const user = auth.current.user
			
							
						/**Fetch comment accordly with user ID, comment ID passed as params and publication ID passed as params  **/
							    const comment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.idPublication)
							      .where('id', params.idComment)
							      .firstOrFail()
							    return response.json({
							    status: 'success',
							    data: comment
								})
				    } catch (error) {
							   return response.status(404).json({
								    status: 'error',
								    message: 'Comment not found.'
								})
				    }
				}

				/**
				   * Authenticated user deletes his own comment on his own publication 
				   *
				   * @method deleteCommentPublication
				   *
				   * @param  {Object} request
				   * @param  {Object} auth
				   * @param  {Object} params
				   * @param  {Object} response
				   *
				   * @return {NULL}
				   */
				async deleteCommentPublication ({ request, auth, params, response }) {
					    try {
							/** Get logged in user **/
							const user = auth.current.user

													
							/**Fetch comment accordly with user ID, comment ID passed as params and publication ID passed as params  **/
								    const comment = await Comment.query()
								      .where('user_id', user.id)
								      .where('publication_id',params.idPublication)
								      .where('id', params.idComment)
								      .firstOrFail()
							await comment.delete()

						   return response.json({
						      status: 'success',
						      message: 'Comment deleted!',
						      data: null
						    })
				    	} catch (error) {
								return response.status(404).json({
						    status: 'error',
						    message: 'Comment not found.'
						   })
				    	}
				}
				/**
				   * Authenticated user comments on other user publication 
				   *
				   * @method userRegisterPublicationComment
				   *
				   * @param  {Object} request
				   * @param  {Object} auth
				   * @param  {Object} params
				   * @param  {Object} response
				   *
				   * @return {JSON}
				   */

				async userRegisterPublicationComment ({ request, auth, params, response }) { /** Method for a logged in user to comment on other users' publications **/

						try {
							/** Get logged in user ID **/
							const user = auth.current.user

						/** Gets the user ID that will have your publication commented as the ID of that publication **/
							const otherUserID = await Publication.query()
										     .where('id',params.idPublication)
										     .firstOrFail()

							
						    const publication = await Publication.query()
										     .where('user_id',otherUserID.user_id)
						    				     .where('id',params.idPublication)
										     .firstOrFail()

							/** Persist in database **/
							    const comment = await Comment.create({
								user_id: user.id,
								publication_id: publication.id,
								comment: request.input('comment')
							    })
							    /** Load user that comments **/
						           await comment.load('user')
							
							return response.json({
								status: 'success',
								message: 'Comment registered!',
								data: comment
						       })

					    } catch (error) {

							return response.status(400).json({
							    status: 'error',
							    message: 'Error trying to register comment. Try again later.',
							    
							})
					    }
			      
			    }
				/**
				   * Authenticated user updates his comment on other user publication 
				   *
				   * @method userEditPublicationComment
				   *
				   * @param  {Object} request
				   * @param  {Object} auth
				   * @param  {Object} params
				   * @param  {Object} response
				   *
				   * @return {JSON}
				   */

				async userEditPublicationComment ({ request, auth, params, response }) { /** Method for a logged in user to edit comment on other users' publications **/

						try {
							/** Get the current logged user **/
							const user = auth.current.user
							
						
			/** fetch the comment id according to the logged in user id , the publication id passed as params and the const publicationComment id   **/
							    const comment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.idPublication)
							      .where('id', params.idComment)
							      .firstOrFail()
			                         /** Update comment with new information **/
							
							comment.comment = request.input('comment')
							await comment.save()
							await comment.load('user')
							return response.json({
							    status: 'success',
							    message: 'Comment updated!',
							    data: comment
							})
					    } catch (error) {

							return response.status(400).json({
							    status: 'error',
							    message: 'Error trying to update comment. Try again later.',
							    data: comment
							})
					    }
			      
			    }
				/**
				   * Authenticated user views his comment on other user publication 
				   *
				   * @method userEditPublicationComment
				   *
				   * @param  {Object} request
				   * @param  {Object} auth
				   * @param  {Object} params
				   * @param  {Object} response
				   *
				   * @return {JSON}
				   */

			    async userViewPublicationComment ({ request, params, auth, response }) { 

					    try {
							/** Get logged in user **/
							const user = auth.current.user
							
			/** Fetch the comment id according to the logged in user id and the publication id passed as params   **/
							    const publicationComment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.idPublication)
							      .firstOrFail()

			/** Fetch the comment id according to the logged in user id , the publication id passed as params and the const publicationComment id   **/
							    const comment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.idPublication)
							      .where('id', publicationComment.id)
							      .firstOrFail()

									return response.json({
								    status: 'success',
								    data: comment
								})
				    	} catch (error) {
								return response.status(404).json({
								    status: 'error',
								    message: 'Comment not found. Try again later.'
								})
				    }
				}

				/**
				   * Authenticated user deletes his comment on other user publication 
				   *
				   * @method userDeletePublicationComment
				   *
				   * @param  {Object} request
				   * @param  {Object} auth
				   * @param  {Object} params
				   * @param  {Object} response
				   *
				   * @return {NULL}
				   */
		        async userDeletePublicationComment ({ request, auth, params, response }) {
					    try {
							/** Get logged in user **/
							const user = auth.current.user
							
											
			/** Fetch the comment id according to the logged in user id and the publication id passed as params   **/
							    const publicationComment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.idPublication)
							      .firstOrFail()

			/** Fetch the comment id according to the logged in user id , the publication id passed as params and the const publicationComment id   **/
							    const comment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.idPublication)
							      .where('id', publicationComment.id)
							      .firstOrFail()
							
								await comment.delete()

							   return response.json({
							      status: 'success',
							      message: 'Comment deleted!',
							      data: null
							    })
				    	} catch (error) {
								return response.status(404).json({
						    status: 'error',
						    message: 'Comment not found. Try again.'
						   })
				    }
				}	

	}
/** Class ends here **/
	module.exports = PublicationController
