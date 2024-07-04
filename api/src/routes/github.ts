import { ACError, createRouter, Result, successfulAuthentication } from 'aeria'

export const githubRouter = createRouter()

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'

const GITHUB_USER_URL = 'https://api.github.com/user'

//exchange github temporary code for an Access Token so we can access user data
async function exchangeCodeForAccessToken(code: string) {
  if(!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET){
    throw new Error('INVALID ENV FILES')
  }

  const CLIENT_ID = process.env.GITHUB_CLIENT_ID
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

  const body = {
    code: code,
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }
  const githubResponse = await fetch(GITHUB_TOKEN_URL,{
    method: 'POST',
    body: new URLSearchParams(body),
    headers: {
      Accept: 'application/json',
    },
  })
  const responseObject = await githubResponse.json()
  return responseObject
}
//get github user data with Access Token
async function fetchUser(token: string) {
  const userResponse = await fetch(GITHUB_USER_URL,{
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const response = await userResponse.json()
  return response
}

githubRouter.POST('/githubAuth', async(context)=>{
  const gitTempToken = await exchangeCodeForAccessToken(context.request.payload.code) //swap code for access token
  const gitTempUser = await fetchUser(gitTempToken.access_token) // get github user data

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
            email: `${gitTempUser.login}@user.github.com`,
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
