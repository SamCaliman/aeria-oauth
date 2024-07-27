<script setup lang="ts">

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const GITHUB_URL = 'https://github.com/login/oauth/authorize'

const TWITCH_CLIENT_ID =  import.meta.env.VITE_TWITCH_CLIENT_ID
const TWITCH_URL = 'https://id.twitch.tv/oauth2/authorize'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

// Redirect User to github OAuth page, passing the client id as an paramenter
async function githubAuth() {
  const params = {
    response_type: 'code',
    scope: 'user',
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: 'http://localhost:8080/redirectGit'
  }
  if(GITHUB_CLIENT_ID){
    window.open(`${GITHUB_URL}`+'?'+`${new URLSearchParams(params).toString()}`, '_self')
  }
}

async function twitchAuth() {
  const params = {
    response_type: 'code',
    client_id: TWITCH_CLIENT_ID,
    redirect_uri: 'http://localhost:8080/redirectTwitch',
  }
  if(TWITCH_CLIENT_ID){
    window.open(`${TWITCH_URL}` + '?' + `${new URLSearchParams(params).toString()}`, '_self')
  }
}

async function googleAuth() {
  const params = {
    response_type: 'code',
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: 'http://localhost:8080/redirectGoogle',
    scope:'https://www.googleapis.com/auth/userinfo.profile'
  }
  if(GOOGLE_CLIENT_ID){
    window.open(`${GOOGLE_URL}` + '?' + `${new URLSearchParams(params).toString()}`, '_self')
  }
}
</script>

<template>
  <section class="
  tw-w-full
  tw-h-[100vh]
  tw-bg-neutral-800
  tw-flex
  "> 
    <div
      class="
        tw-bg-neutral-600
        tw-rounded
        tw-w-3/5
        tw-min-w-[30rem]
        tw-p-6
        tw-flex
        tw-flex-col
        tw-rounded-md
        tw-m-auto
        tw-text-center
        tw-text-white
        tw-gap-3
      "
    >
    Login With
    <div 
    class="
      tw-flex
      tw-flex-col
      tw-gap-3
      tw-items-center
      "
    >
      <aeria-button class="tw-w-2/5" @click="githubAuth()">
        <aeria-icon icon="github-logo"/>
        Github
      </aeria-button>
      <aeria-button class="tw-w-2/5" @click="twitchAuth()">
        <aeria-icon icon="twitch-logo"/>
        Twitch
      </aeria-button>
      <aeria-button class="tw-w-2/5" @click="googleAuth()">
        <aeria-icon icon="google-logo"/>
        Google
      </aeria-button>
    </div>
    
  </div>
  </section>
  
</template>
