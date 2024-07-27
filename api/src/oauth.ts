const exchangeCodeForAccessToken = async(code: string, clientId: string, clientSecret: string, tokenUrl:string, redirectUri:string) => {
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
  
  const fetchUser = async(token: string, userUrl: string, clientId:string, accept:string) => {
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

  export const OAuth = {
    exchangeCodeForAccessToken,
    fetchUser
  }