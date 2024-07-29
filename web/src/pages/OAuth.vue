<script setup lang="ts">
const {
  VITE_GITHUB_CLIENT_ID,
  VITE_GITHUB_URL,
  VITE_GITHUB_REDIRECT_URI,
  VITE_TWITCH_CLIENT_ID,
  VITE_TWITCH_URL,
  VITE_TWITCH_REDIRECT_URI,
  VITE_GOOGLE_CLIENT_ID,
  VITE_GOOGLE_URL,
  VITE_GOOGLE_REDIRECT_URI,
  VITE_GOOGLE_SCOPE,
} = import.meta.env

// Redirect User to github OAuth page, passing the client id as an paramenter
async function githubAuth() {
  const params = {
    response_type: 'code',
    scope: 'user',
    client_id: VITE_GITHUB_CLIENT_ID,
    redirect_uri: VITE_GITHUB_REDIRECT_URI
  }
  window.open(`${VITE_GITHUB_URL}`+'?'+`${new URLSearchParams(params).toString()}`, '_self')
}

async function twitchAuth() {
  const params = {
    response_type: 'code',
    client_id: VITE_TWITCH_CLIENT_ID,
    redirect_uri: VITE_TWITCH_REDIRECT_URI,
  }
  window.open(`${VITE_TWITCH_URL}` + '?' + `${new URLSearchParams(params).toString()}`, '_self')
}

async function googleAuth() {
  const params = {
    response_type: 'code',
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URI,
    scope: VITE_GOOGLE_SCOPE
  }
  window.open(`${VITE_GOOGLE_URL}` + '?' + `${new URLSearchParams(params).toString()}`, '_self')
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
