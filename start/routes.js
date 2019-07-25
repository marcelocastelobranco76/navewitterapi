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
Route.post('/signup', 'UserController.signUp') 

/** Route to user log in  **/
Route.post('/login', 'UserController.logIn')

/** Routes to user account **/
Route.group(() => {

  Route.get('/myaccount', 'UserController.userAccount') 

  Route.put('/editaccount', 'UserController.editAccount') 

  Route.put('/changepasswd', 'UserController.changePasswd')

  Route.delete('/delete', 'UserController.deleteAccount') 

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

Route.post('/publication/create', 'PublicationController.createPublication').middleware(['auth:jwt'])

Route.put('/publication/edit/:id', 'PublicationController.editPublication').middleware(['auth:jwt'])

Route.get('/publication/view/:id', 'PublicationController.viewPublication').middleware(['auth:jwt']) 

Route.delete('/publication/delete/:id', 'PublicationController.deletePublication').middleware(['auth:jwt'])



/** Routes for users to create, edit, view and delete comments in their own publications **/

Route.post('/publication/createcomment/:id', 'PublicationController.createCommentPublication').middleware([
  'auth:jwt'
]) 

Route.put('/publication/editcomment/:id', 'PublicationController.editCommentPublication').middleware(['auth:jwt']) 

Route.get('/publication/viewcomment/:id', 'PublicationController.viewCommentPublication').middleware(['auth:jwt'])

Route.delete('/publication/deletecomment/:id', 'PublicationController.deletaComentarioPublicacao').middleware(['auth:jwt'])


/** Routes for users to Create, Edit, View, and Delete Comments on Other Users Publications **/

Route.post('/user/register/publicationcomment/:id', 'PublicationController.userRegisterPublicationComment').middleware(['auth:jwt'])

Route.put('/user/edit/publicationcomment/:id', 'PublicationController.userEditPublicationComment').middleware(['auth:jwt'])

Route.get('/user/view/publicationcomment/:id', 'PublicationController.userViewPublicationComment').middleware(['auth:jwt'])

Route.delete('/user/delete/publicationcomment/:id', 'PublicationController.userDeletePublicationComment').middleware(['auth:jwt'])


