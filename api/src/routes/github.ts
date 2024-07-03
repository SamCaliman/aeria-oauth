import { createRouter } from 'aeria'

export const githubRouter = createRouter()

async function exangeCodeForAccessToken(code: string) {
  const githubURL = 'https://github.com/login/oauth/access_token'
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID
  if(CLIENT_ID === undefined || CLIENT_ID === null){
    return console.log('no clientIDFound')
  }
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
  if(CLIENT_SECRET === undefined || CLIENT_SECRET === null){
    return console.log('no clientSECRETFound')
  }
  const body = {
    code: code,
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }
  const githubResponse = await fetch(githubURL,{
    method: 'POST',
    body: new URLSearchParams(body),
    headers: {
      Accept: 'application/json',
    },
  })
  const responseObject = await githubResponse.json()
  return responseObject
}

async function fetchUser(token: string) {
  const userResponse = await fetch('https://api.github.com/user',{
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const response = await userResponse.json()
  return response
}

githubRouter.POST('/githubAuth', async(context)=>{
  try {
    const gtiTempToken = await exangeCodeForAccessToken(context.request.payload.code)
    const gitTempUser = await fetchUser(gtiTempToken.access_token)

    const { error: userError ,result: userResult } = await context.collections.user.functions.get({
      filters: {
        github_id: gitTempUser.id,
      },
    })

    console.log(gitTempUser.id)

    if(userError){
      const gitUserId = gitTempUser.id
      const { error: userInsertError, result: userInsertResult } = await context.collections.user.functions.insert({
        what: {
          name: gitTempUser.login,
          active: true,
          github_id: gitUserId,
          roles: <any[]>['root'] as any,
          email: `${gitTempUser.login}@user.github.com`,
        },
      })
      if (userInsertError){
        return console.log(userInsertError)
      }
      console.log(userInsertResult)
    }
    if (userResult){
      console.log(gitTempUser)
      //console.log(userResult)
    }

    //console.log(gitTempUser.id)

  } catch (error) {
    console.log('err', error)
  }
})
