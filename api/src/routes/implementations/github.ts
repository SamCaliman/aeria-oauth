import { ACError, type RouteContext, Result, successfulAuthentication } from 'aeria'
import {OAuth} from '../../oauth.js'

export const github = async(context: RouteContext)=>{
  if(
    !process.env.GITHUB_CLIENT_ID 
    || 
    !process.env.GITHUB_CLIENT_SECRET
    ||
    !process.env.GITHUB_USER_URL
    ||
    !process.env.GITHUB_TOKEN_URL
    ||
    !process.env.GITHUB_REDIRECT_URI
  ){
    throw new Error('INVALID ENV FILES')
  }

  const CLIENT_ID = process.env.GITHUB_CLIENT_ID
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
  const USER_URL = process.env.GITHUB_USER_URL
  const TOKEN_URL = process.env.GITHUB_TOKEN_URL
  const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI

  const gitTempToken = await OAuth.exchangeCodeForAccessToken(
    context.request.payload.code, 
    CLIENT_ID, 
    CLIENT_SECRET, 
    TOKEN_URL,
    REDIRECT_URI
  ) //swap code for access token

  const gitTempUser = await OAuth.fetchUser(
    gitTempToken.access_token, 
    USER_URL, 
    CLIENT_ID,
    "Accept: application/vnd.github+json"
  ) // get github user data

  //checks if there's an user with a github account on the database.
  const { error: userError ,result: user } = await context.collections.user.functions.get({
    filters: {
      github_id: gitTempUser.id.toString(),
    },
  })
  
  if(userError){
    //Check what user error returns
    switch(userError.code){
      case ACError.ResourceNotFound:{
        //if there's no user on database, create one.
        const { error: userInsertError, result: userInsertResult } = await context.collections.user.functions.insert({
          what: {
            name: gitTempUser.login,
            active: true,
            github_id: gitTempUser.id.toString(),
            roles: ['root'],
            email: `${gitTempUser.login}@user.template.com`,
          },
        })
        if (userInsertError){
          return Result.error(userInsertError)
        }
        //Authenticate if successful, and return result to web
        return Result.result(await successfulAuthentication(userInsertResult._id, context))
      }
      default: 
        return Result.error(userError)
    }
  }
  //if user already exists in database just authenticate and return result to web
  return Result.result(await successfulAuthentication(user._id, context))
}



