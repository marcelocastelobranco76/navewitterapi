	'use strict'
	const Publication = use('App/Models/Publication')
	const Comment = use('App/Models/Comment')

	class PublicationController {

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

				async createCommentPublication ({ request, auth, params, response }) { /** Method for authenticated user to comment on their own publication **/
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

				async editCommentPublication ({ request, auth, params, response }) { /** Method for authenticated user to edit their own comment on their own publication **/

						try {
						/** Get logged in user**/
						const user = auth.current.user
						
					/** Fetch publication ID accordly with user ID and comment ID passed as params **/			
						const publication = await Publication.query()
						      .where('user_id', user.id)
						      .where('id', params.id)
						      .firstOrFail()
						
						/**Fetch comment accordly with user ID, comment ID passed as params and publication ID  **/
						    const comment = await Comment.query()
						      .where('user_id', user.id)
						      .where('publication_id',publication.id)
						      .where('id', params.id)
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

				async viewCommentPublication({ request, params, auth, response }) { /** Method for user see their own comment **/

					try {
						/** Get logged in user **/
						const user = auth.current.user
				/** Fetch publication ID accordly user ID and ID passed as params **/			
							const publication = await Publication.query()
							      .where('user_id', user.id)
							      .where('id', params.id)
							      .firstOrFail()
							
						/**Fetch comment accordly with user ID, comment ID passed as params and publication ID  **/
							    const comment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',publication.id)
							      .where('id', params.id)
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

				async deleteCommentPublication ({ request, auth, params, response }) {
					    try {
							/** Get logge in user **/
							const user = auth.current.user

					/** Fetch publication ID accordly user ID and ID passed as params **/			
								const publication = await Publication.query()
								      .where('user_id', user.id)
								      .where('id', params.id)
								      .firstOrFail()
								
							/**Fetch comment accordly with user ID, comment ID passed as params and publication ID  **/
								    const comment = await Comment.query()
								      .where('user_id', user.id)
								      .where('publication_id',publication.id)
								      .where('id', params.id)
								      .firstOrFail()
							await comment.delete()

						   return response.json({
						      status: 'success',
						      message: 'Comentário deletado!',
						      data: null
						    })
				    	} catch (error) {
								return response.status(404).json({
						    status: 'error',
						    message: 'Comment not found.'
						   })
				    	}
				}

				async userRegisterPublicationComment ({ request, auth, params, response }) { /** Method for a logged in user to comment on other users' publications **/

						try {
							/** Get logged in user ID **/
							const user = auth.current.user

						/** Gets the user ID that will have your publication commented as the ID of that publication **/
							const otherUserID = await Publication.query()
										     .where('id',params.id)
										     .firstOrFail()

							
						    const publication = await Publication.query()
										     .where('user_id',otherUserID.user_id)
						    				     .where('id',params.id)
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

				async userEditPublicationComment ({ request, auth, params, response }) { /** Method for a logged in user to edit comment on other users' publications **/

						try {
							/** Get the current logged user **/
							const user = auth.current.user
							
							/** fetch the comment id according to the logged in user id and the publication id passed as params   **/
							    const publicationComment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.id)
							      .firstOrFail()

			/** fetch the comment id according to the logged in user id , the publication id passed as params and the const publicationComment id   **/
							    const comment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.id)
							      .where('id', publicationComment.id)
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

			    async userViewPublicationComment ({ request, params, auth, response }) { /** Method for logged in user to view their comments on publications from other users **/

					    try {
							/** Get logged in user **/
							const user = auth.current.user
							
			/** Fetch the comment id according to the logged in user id and the publication id passed as params   **/
							    const publicationComment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.id)
							      .firstOrFail()

			/** Fetch the comment id according to the logged in user id , the publication id passed as params and the const publicationComment id   **/
							    const comment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.id)
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
		        async userDeletePublicationComment ({ request, auth, params, response }) {
					    try {
							/** Get logged in user **/
							const user = auth.current.user
							
											
			/** Fetch the comment id according to the logged in user id and the publication id passed as params   **/
							    const publicationComment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.id)
							      .firstOrFail()

			/** Fetch the comment id according to the logged in user id , the publication id passed as params and the const publicationComment id   **/
							    const comment = await Comment.query()
							      .where('user_id', user.id)
							      .where('publication_id',params.id)
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
