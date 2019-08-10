'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')



/** Route to user sign up **/
Route.post('/users', 'UserController.signUp') 

/** Route to user log in  **/
Route.post('/user', 'UserController.logIn')

/** Routes to user account **/
Route.group(() => {

  Route.get('/myaccount', 'UserController.userAccount') 

  Route.put('/myaccount', 'UserController.editAccount') 

  Route.delete('/myaccount', 'UserController.deleteAccount') 

})
  .prefix('account')
  .middleware(['auth:jwt'])


Route.group(() => {

  Route.get('/timeline', 'UserController.timeline')
  
})
  .prefix('users')
  .middleware(['auth:jwt'])

/** Route to show user profile - No token needed - OK **/
Route.get(':username', 'UserController.userProfile')

/** -------------------------------------------------- **/

/** Routes for users create, edit, view and delete theirs own publications **/

Route.post('/publications', 'PublicationController.createPublication').middleware(['auth:jwt'])

Route.put('/publication/:id', 'PublicationController.editPublication').middleware(['auth:jwt'])

Route.get('/publication/:id', 'PublicationController.viewPublication').middleware(['auth:jwt']) 

Route.delete('/publication/:id', 'PublicationController.deletePublication').middleware(['auth:jwt'])



/** Routes for users to create, edit, view and delete comments in their own publications **/

Route.post('/publications/:id/comments', 'PublicationController.createCommentPublication').middleware([
  'auth:jwt'
]) 

Route.put('/publications/:idPublication/comments/:idComment', 'PublicationController.editCommentPublication').middleware(['auth:jwt']) 

Route.get('/publications/:idPublication/comments/:idComment', 'PublicationController.viewCommentPublication').middleware(['auth:jwt'])

Route.delete('/publications/:idPublication/comments/:idComment', 'PublicationController.deleteCommentPublication').middleware(['auth:jwt'])


/** Routes for users to Create, Edit, View, and Delete Comments on Other Users Publications **/

Route.post('/users/publications/:idPublication/comments', 'PublicationController.userRegisterPublicationComment').middleware(['auth:jwt'])

Route.put('/users/publications/:idPublication/comments/:idComment', 'PublicationController.userEditPublicationComment').middleware(['auth:jwt'])

Route.get('/users/publications/:idPublication/comments/:idComment', 'PublicationController.userViewPublicationComment').middleware(['auth:jwt'])

Route.delete('/users/publications/:idPublication/comments/:idComment', 'PublicationController.userDeletePublicationComment').middleware(['auth:jwt'])


