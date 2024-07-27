import { ACError, type RouteContext, Result, successfulAuthentication } from 'aeria'
import {OAuth} from '../../oauth.js'


export const twitch = async(context:RouteContext)=>{
  if(
    !process.env.TWITCH_CLIENT_ID 
    || 
    !process.env.TWITCH_CLIENT_SECRET
    ||
    !process.env.TWITCH_USER_URL
    ||
    !process.env.TWITCH_TOKEN_URL
    ||
    !process.env.TWITCH_REDIRECT_URI
  ){
    throw new Error('INVALID ENV FILES')
  }

  const CLIENT_ID = process.env.TWITCH_CLIENT_ID
  const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET
  const USER_URL = process.env.TWITCH_USER_URL
  const TOKEN_URL = process.env.TWITCH_TOKEN_URL
  const REDIRECT_URI = process.env.TWITCH_REDIRECT_URI

  const twitchTempToken = await OAuth.exchangeCodeForAccessToken(
    context.request.payload.code, 
    CLIENT_ID, 
    CLIENT_SECRET, 
    TOKEN_URL, 
    REDIRECT_URI
  ) //swap code for access token

  const twitchTempUser = await OAuth.fetchUser(
    twitchTempToken.access_token ,
    USER_URL, 
    CLIENT_ID, 
    'application/vnd.twitchtv.v5+json'
  ) // get twitch user data

  //checks if there's an user with a twitch account on the database.
  const { error: userError ,result: user } = await context.collections.user.functions.get({
    filters: {
      twitch_id: twitchTempUser.id.toString(),
    },
  })

  if(userError){
    //Check what user error returns
    switch(userError.code){
      case ACError.ResourceNotFound:{
        //if there's no user on database, create one.
        const { error: userInsertError, result: userInsertResult } = await context.collections.user.functions.insert({
          what: {
            name: twitchTempUser.login,
            active: true,
            twitch_id: twitchTempUser.id.toString(),
            roles: ['root'],
            email: `${twitchTempUser.login}@user.template.com`,
          },
        })
        if (userInsertError){
          return Result.error(userInsertError)
        }
        //Authenticate if successful, and return result to web
        return Result.result(await successfulAuthentication(userInsertResult, context))
      }
      default:
        return Result.error(userError)
    }
  }
  //if user already exists in database just authenticate and return result to web
  return Result.result(await successfulAuthentication(user, context))
}