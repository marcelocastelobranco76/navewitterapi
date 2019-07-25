	'use strict'
	const Publication = use('App/Models/Publication')
	const Comment = use('App/Models/Comment')

	class PublicationController {
				async cadastraPublicacao ({ request, auth, response }) { /** Método para cadastrar uma publicação **/
				    /** Pega o usuário logado **/
				    const user = auth.current.user

				    /** Salva a publicação na base de dados **/
				    const publication = await Publication.create({
					user_id: user.id,
					publication: request.input('publication')
				    })

				    /** Carrega os relacionamentos da publicação **/
				    await publication.loadMany(['user','comments'])

				    return response.json({
					status: 'success',
					message: 'Publicação cadastrada com sucesso!',
					data: publication
				    })
				}
				
				async atualizaPublicacao ({ request, params, auth, response }) { /** Método atualiza conta - para testar deve-se informar o token gerado quando o usuário se loga **/
				    try {
					/** Pega o usuário que está logado **/
					const user = auth.current.user

					/**Busca a publicação de acordo com o ID do usuário logado **/
					    const publication = await Publication.query()
					      .where('user_id', user.id)
					      .where('id', params.id)
					      .firstOrFail()

					/** Atualiza com as novas informações **/
					
					publication.publication = request.input('publication')
					
					await publication.save()

					return response.json({
					    status: 'success',
					    message: 'Publicação atualizada com sucesso!',
					    data: user
					})
				    } catch (error) {
					return response.status(400).json({
					    status: 'error',
					    message: 'Erro ao atualizar a publicação. Tente novamente.'
					})
				    }
			   }

				async mostraPublicacao ({ request, params, auth, response }) { /** Método para mostrar publicação **/
					/** Pega o usuário que está logado **/
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
					    message: 'Publicação não encontrada.'
					})
				    }
				}

				async deletaPublicacao ({ request, auth, params, response }) {
					    /** Obtém usuário atualmente autenticado **/
					    const user = auth.current.user

					    /** Obtem a publicação de acordo com o ID especificado **/
					    const publication = await Publication.query()
					      .where('user_id', user.id)
					      .where('id', params.id)
					      .firstOrFail()

					    await publication.delete()

					    return response.json({
					      status: 'success',
					      message: 'Publicação deletada!',
					      data: null
					    })
				}

				async criaComentarioPublicacao ({ request, auth, params, response }) { /** Método para o próprio usuário logado criar comentário em suas publicações **/
					    /** Obtém usuário atualmente autenticado **/
					    const user = auth.current.user

					    /** Obtém a publicação com o ID especificado  **/
					    const publication = await Publication.find(params.id)

					    /** Persiste na base de dados **/
					    const comment = await Comment.create({
						user_id: user.id,
						publication_id: publication.id,
						comment: request.input('comment')
					    })

					    /** Carrega o usuário que fez o comentário **/
					    await comment.load('user')

					    return response.json({
						status: 'success',
						message: 'Comentário cadastrado com sucesso!',
						data: comment
					    })
				}

				async editaComentarioPublicacao ({ request, auth, params, response }) { /** Método para o próprio usuário logado criar comentário em suas publicações **/

						try {
						/** Obtém o usuário que está logado **/
						const user = auth.current.user
						
						/** Busca o ID da publicação conforme o ID do comentário e o ID do usuário logado **/			
						const publication = await Publication.query()
						      .where('user_id', user.id)
						      .where('id', params.id)
						      .firstOrFail()
						
						/**Busca o comentário de acordo com o ID do usuário logado e o ID da publicação  **/
						    const comment = await Comment.query()
						      .where('user_id', user.id)
						      .where('publication_id',publication.id)
						      .where('id', params.id)
						      .firstOrFail()

						/** Atualiza com as novas informações **/
						
						comment.comment = request.input('comment')
						
						await comment.save()
						await comment.load('user')
						return response.json({
						    status: 'success',
						    message: 'Comentário atualizado com sucesso!',
						    data: comment
						})
					    } catch (error) {

						return response.status(400).json({
						    status: 'error',
						    message: 'Erro ao atualizar o comentário. Tente novamente.',
						    data: comment
						})
					    }
			      
	            }

				async visualizaComentarioPublicacao ({ request, params, auth, response }) { /** Método para mostrar publicação **/

					try {
						/** Obtém o usuário que está logado **/
						const user = auth.current.user
						/** Busca o ID da publicação conforme o ID do comentário e o ID do usuário logado **/			
							const publication = await Publication.query()
							      .where('user_id', user.id)
							      .where('id', params.id)
							      .firstOrFail()
							
						/**Busca o comentário de acordo com o ID do usuário logado e o ID da publicação  **/
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
						    message: 'Comentário não encontrado.'
						})
				    }
				}

				async deletaComentarioPublicacao ({ request, auth, params, response }) {
					    try {
							/** Obtém o usuário que está logado **/
							const user = auth.current.user
							/** Busca o ID da publicação conforme o ID do comentário e o ID do usuário logado **/			
								const publication = await Publication.query()
								      .where('user_id', user.id)
								      .where('id', params.id)
								      .firstOrFail()
								
							/**Busca o comentário de acordo com o ID do usuário logado e o ID da publicação  **/
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
						    message: 'Comentário não encontrado.'
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
