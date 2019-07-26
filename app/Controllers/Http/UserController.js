	'use strict'
	/** Const User utilizando a model User **/
	const User = use('App/Models/User')

	const Hash = use('Hash') /** Utilizando o helper Hash **/

	const Publication = use('App/Models/Publication')

	class UserController {

	    async signUp ({ request, auth, response }) { 
	    
		    const userData = request.only(['name', 'username', 'email', 'password', 'location', 'aboutme'])

		    try {
			/** Register user in database **/
			const user = await User.create(userData)

			/** Generate a token to the user **/
			const token = await auth.generate(user)

			return response.json({
			    status: 'success',
			    data: token,
			    message: 'You are registered!'
			})
		    } catch (error) {
			return response.status(400).json({
			    status: 'error',
			    message: 'Error trying register user. Try again later.'
			})
		    }
	   }
	   async logIn ({ request, auth, response }) { 
		    try {
			/** Check email and password and create a JWT token - this token will be used in all the methods that involves publications and comments **/
			const token = await auth.attempt(
			    request.input('email'),
			    request.input('password')
			)

			return response.json({
			    status: 'success',
			    data: token
			})
		    } catch (error) {
			response.status(400).json({
			    status: 'error',
			    message: 'Email or password not valid.'
			})
		    }
	   }

	   async userAccount ({ auth, response }) { 
		    const user = await User.query()
			.where('id', auth.current.user.id)
			.with('publications', builder => {
			    builder.with('user')
			    builder.with('comments')
			})
			
			.firstOrFail()

		    return response.json({
			status: 'success',
			data: user
		    })
	   }
	   async editAccount ({ request, auth, response }) { 
		    try {
				/** Get logged in user **/
				const user = auth.current.user

				/** Update with new informations **/
				user.name = request.input('name')
				user.username = request.input('username')
				user.email = request.input('email')
				user.location = request.input('location')
				user.aboutme = request.input('aboutme')
				
				await user.save()

				return response.json({
				    status: 'success',
				    message: 'Account updated!',
				    data: user
				})
		    } catch (error) {
				return response.status(400).json({
				    status: 'error',
				    message: 'Error trying update account. Try again later.'
				})
		    }
	   }


	 

	  async userProfile ({ request, params, response }) { 
		    try {
			const user = await User.query()
			    .where('username', params.username)
			    .with('publications', builder => {
			        builder.with('user')
			        builder.with('comments')
			    })
			    .firstOrFail()

			return response.json({
			    status: 'success',
			    data: user
			})
		    } catch (error) {
			return response.status(404).json({
			    status: 'error',
			    message: 'User not found.'
			})
		    }
	   
	  }
	  async timeline ({ request, auth, response }) { 
	      

		try {

		    const user = await User.find(auth.current.user.id)

		    /** Get an array with ID of all users **/
		    const usersIds = await User.query().whereNot('id',user.id)
		

		    /** Add logged in user ID in the array with all others IDs **/
		    usersIds.push(user.id)

		    const publications = await Publication.query()
			.whereIn('user_id', usersIds)
			.with('user')
			.with('comments')
			.orderBy('created_at','desc')
			.fetch()

		    return response.json({
			status: 'success',
			data: publications
		    })

		} catch (error) {
			return response.status(400).json({
			    status: 'error',
			    message: 'Erro trying to show timeline.Try again later.'
				
			})
		    }
	  }


	   async deleteAccount ({ request, auth, response }) { 
		    try {
			/** Get logged in user **/
			const user = auth.current.user
	 		await user.delete()
			return response.json({
			    status: 'success',
			    message: 'Account deleted',
			    data: user
			})
		    } catch (error) {
			return response.status(400).json({
			    status: 'error',
			    message: 'Erro trying to delete account.Try again later.'
			})
		    }
	   }

	}

	module.exports = UserController
