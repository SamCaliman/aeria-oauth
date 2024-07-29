interface ImportMeta {
    env: Record<
      | 'VITE_GITHUB_CLIENT_ID'
      | 'VITE_GITHUB_URL'
      | 'VITE_GITHUB_REDIRECT_URI'
      | 'VITE_TWITCH_CLIENT_ID'
      | 'VITE_TWITCH_URL'
      | 'VITE_TWITCH_REDIRECT_URI'
      | 'VITE_GOOGLE_CLIENT_ID'
      | 'VITE_GOOGLE_URL'
      | 'VITE_GOOGLE_REDIRECT_URI'
      | 'VITE_GOOGLE_SCOPE'
    , string>
  }