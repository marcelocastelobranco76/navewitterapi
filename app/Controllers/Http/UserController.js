	'use strict'
	
	const User = use('App/Models/User')

	const Database = use('Database') /** Using Query Builder **/

	const Hash = use('Hash') /** Using Hash helper **/

	const Publication = use('App/Models/Publication')

	class UserController {
		
		   /**
	   * Method for user sign up
	   *
	   * @method signUp
	   *
	   * @param  {Object} request
	   * @param  {Object} auth
	   * @param  {Object} response
	   *
	   * @return {JSON}
	   */
	    async signUp ({ request, auth, response }) { 
	    
		    const userData = request.only(['name', 'username', 'email', 'password', 'location', 'aboutme'])

		    try {
			/** Register user in database **/
			const user = await User.create(userData)

			return response.json({
			    status: 'success',
			    message: 'You are registered!'
			})
		    } catch (error) {
			return response.status(400).json({
			    status: 'error',
			    message: 'Error trying register user. Try again later.'
			})
		    }
	   }
	/**
	   * User authentication
	   *
	   * @method logIn
	   *
	   * @param  {Object} request
	   * @param  {Object} auth
	   * @param  {Object} response
	   *
	   * @return {String|JSON}
	   */
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

	
	/**
	   * Get details of current authenticated user's account
	   *
	   * @method userAccount
	   *
	   * @param  {Object} auth
	   * @param  {Object} response
	   *
	   * @return {JSON}
	   */
	   async userAccount ({ auth, response }) { 

		    const userID = auth.current.user.id
		    const user = await User.query()
			.where('id', userID)
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
	/**
	   * Update current authenticated user's account
	   *
	   * @method editAccount
	   *
	   * @param  {Object} request
	   * @param  {Object} auth
	   * @param  {Object} response
	   *
	   * @return {JSON}
	   */
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
/**
	   * Delete current authenticated user's account
	   *
	   * @method deleteAccount
	   *
	   * @param  {Object} request
	   * @param  {Object} auth
	   * @param  {Object} response
	   *
	   * @return {JSON}
	   */
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
	 
	/**
	   * Show user profile passing only the username
	   *
	   * @method userProfile
	   *
	   * @param  {Object} request
	   * @param  {Object} params
	   * @param  {Object} response
	   *
	   * @return {JSON}
	   */
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
		/**
   * Fetch user and other users publications
   *
   * @method index
   * @param  {Object} auth
   * @param  {Object} response
   *
   * @return {JSON}
   */
	  async timeline ({ auth, response }) {
		   
		const userID = auth.current.user.id 		 
		const publications = await Database.raw('select publication,created_at from publications where user_id in (select id from users where id <> "userID" or id = "userID") order by created_at desc')

		
		    return response.json({
			status: 'success',
			data: publications[0]
		    })
	}


	  

}

	module.exports = UserController
