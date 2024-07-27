declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<
      | 'API_URL'
      | 'APPLICATION_SECRET'
      | 'MONGODB_URL'
      | 'GODMODE_USERNAME'
      | 'GODMODE_PASSWORD'
      | 'STORAGE_PATH'
      | 'STORAGE_TEMP_PATH'
      | 'GITHUB_CLIENT_ID'
      | 'GITHUB_CLIENT_SECRET'
      | 'GITHUB_TOKEN_URL'
      | 'GITHUB_USER_URL'
      | 'GITHUB_REDIRECT_URI'
      | 'TWITCH_CLIENT_ID'
      | 'TWITCH_CLIENT_SECRET'
      | 'TWITCH_TOKEN_URL'
      | 'TWITCH_USER_URL'
      | 'TWITCH_REDIRECT_URI'
      | 'GOOGLE_CLIENT_ID'
      | 'GOOGLE_CLIENT_SECRET'
      | 'GOOGLE_TOKEN_URL'
      | 'GOOGLE_USER_URL'
      | 'GOOGLE_REDIRECT_URI',
      string
    > {}
  }
}

export {}
