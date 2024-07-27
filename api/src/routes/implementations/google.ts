import { ACError, type RouteContext, Result, successfulAuthentication } from 'aeria'
import {OAuth} from '../../oauth.js'

export const google = async(context: RouteContext)=>{
    if(
        !process.env.GOOGLE_CLIENT_ID 
        || 
        !process.env.GOOGLE_CLIENT_SECRET
        ||
        !process.env.GOOGLE_USER_URL
        ||
        !process.env.GOOGLE_TOKEN_URL
        ||
        !process.env.GOOGLE_REDIRECT_URI
        ){
        throw new Error('INVALID ENV FILES')
        }

    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
    const USER_URL = process.env.GOOGLE_USER_URL
    const TOKEN_URL = process.env.GOOGLE_TOKEN_URL
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI

    const googleTempToken = await OAuth.exchangeCodeForAccessToken(
        context.request.payload.code, 
        CLIENT_ID, 
        CLIENT_SECRET, 
        TOKEN_URL, 
        REDIRECT_URI
    ) //swap code for access token

    const googleTempUser = await OAuth.fetchUser(
        googleTempToken.access_token ,
        USER_URL, 
        CLIENT_ID, 
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
            return Result.result(await successfulAuthentication(userInsertResult._id, context))
        }
        default:
            return Result.error(userError)
        }
    }
    //if user already exists in database just authenticate and return result to web
    return Result.result(await successfulAuthentication(user._id, context))
    }