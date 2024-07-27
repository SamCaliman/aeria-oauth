import { ACError, type RouteContext, Result, successfulAuthentication } from 'aeria'
import {OAuth} from '../../oauth.js'

export const google = async(context: RouteContext)=>{
    
    const {
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_USER_URL,
        GOOGLE_TOKEN_URL,
        GOOGLE_REDIRECT_URI,
      } = process.env
    
      if(
        !GOOGLE_CLIENT_ID 
        || 
        !GOOGLE_CLIENT_SECRET
        ||
        !GOOGLE_USER_URL
        ||
        !GOOGLE_TOKEN_URL
        ||
        !GOOGLE_REDIRECT_URI
      ){
        throw new Error('INVALID ENV FILES')
      }

    const googleTempToken = await OAuth.exchangeCodeForAccessToken(
        context.request.payload.code, 
        GOOGLE_CLIENT_ID, 
        GOOGLE_CLIENT_SECRET, 
        GOOGLE_TOKEN_URL, 
        GOOGLE_REDIRECT_URI
    ) //swap code for access token

    const googleTempUser = await OAuth.fetchUser(
        googleTempToken.access_token ,
        GOOGLE_USER_URL, 
        GOOGLE_CLIENT_ID, 
        'json'   
    ) // get google user data

    //checks if there's an user with a google account on the database.
    const { error: userError ,result: user } = await context.collections.user.functions.get({
        filters: {
        google_id: googleTempUser.sub.toString(),
        },
    })

    if(userError){
        //Check what user error return
        switch(userError.code){
        case ACError.ResourceNotFound:{
            //if there's no user on database, create one.
            const { error: userInsertError, result: userInsertResult } = await context.collections.user.functions.insert({
            what: {
                name: googleTempUser.name,
                active: true,
                google_id: googleTempUser.sub.toString(),
                roles: ['root'],
                email: `${googleTempUser.name}@user.template.com`,
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