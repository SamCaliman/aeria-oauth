import { ACError, createRouter, Result, successfulAuthentication } from 'aeria'

export const AuthRouter = createRouter()

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_USER_URL = 'https://api.github.com/user'
const GITHUB_REDIRECT_URI = 'http://localhost:8080/redirectGit'

const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token'
const TWITCH_USER_URL = 'https://api.twitch.tv/helix/users'
const TWITCH_REDIRECT_URI = 'http://localhost:8080/redirectTwitch'

const GOOGLE_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token'
const GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'
const GOOGLE_REDIRECT_URI = 'http://localhost:8080/redirectGoogle'

//exchange temporary code for an Access Token so we can access user data
async function exchangeCodeForAccessToken(code: string, clientId: string, clientSecret: string, tokenUrl:string, redirectUri:string) {

  const body = {
    code: code,
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri
  }
  const tokenResponse = await fetch(tokenUrl,{
    method: 'POST',
    body: new URLSearchParams(body),
    headers: {
      Accept: 'application/json',
    },
  })
  const responseObject = await tokenResponse.json()
  return responseObject
}
//get user data with Access Token
async function fetchUser(token: string, userUrl: string, clientId:string, accept:string) {
  const userResponse = await fetch(userUrl,{
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept": accept,
      "Client-ID": clientId
    },
  })
  const response = await userResponse.json()
  if(response.data){
    return response.data[0]
  }
  return response
}

AuthRouter.POST('/github', async(context)=>{
  if(!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET){
    throw new Error('INVALID ENV FILES')
  }

  const CLIENT_ID = process.env.GITHUB_CLIENT_ID
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

  const gitTempToken = await exchangeCodeForAccessToken(context.request.payload.code, CLIENT_ID, CLIENT_SECRET, GITHUB_TOKEN_URL,GITHUB_REDIRECT_URI) //swap code for access token
  const gitTempUser = await fetchUser(gitTempToken.access_token, GITHUB_USER_URL, CLIENT_ID,"Accept: application/vnd.github+json") // get github user data
  
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
})

AuthRouter.POST('/twitch', async(context)=>{
  if(!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET){
    throw new Error('INVALID ENV FILES')
  }

  const CLIENT_ID = process.env.TWITCH_CLIENT_ID
  const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET

  const twitchTempToken = await exchangeCodeForAccessToken(context.request.payload.code, CLIENT_ID, CLIENT_SECRET, TWITCH_TOKEN_URL, TWITCH_REDIRECT_URI) //swap code for access token
  const twitchTempUser = await fetchUser(twitchTempToken.access_token ,TWITCH_USER_URL, CLIENT_ID, 'application/vnd.twitchtv.v5+json') // get twitch user data

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
        return Result.result(await successfulAuthentication(userInsertResult._id, context))
      }
      default:
        return Result.error(userError)
    }
  }
  //if user already exists in database just authenticate and return result to web
  return Result.result(await successfulAuthentication(user._id, context))
})

AuthRouter.POST('/google', async(context)=>{
  if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET){
    throw new Error('INVALID ENV FILES')
  }

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

  const googleTempToken = await exchangeCodeForAccessToken(context.request.payload.code, CLIENT_ID, CLIENT_SECRET, GOOGLE_TOKEN_URL, GOOGLE_REDIRECT_URI) //swap code for access token
  const googleTempUser = await fetchUser(googleTempToken.access_token ,GOOGLE_USER_URL, CLIENT_ID, 'json') // get google user data
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
})