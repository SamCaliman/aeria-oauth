<script setup lang="ts">
definePage({
  meta: {
    title: 'Dashboard',
    icon: 'gauge',
  },
})

async function githubAuth() {
  const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
  console.log(CLIENT_ID)
  if(CLIENT_ID){
    window.open(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`)
  }
  
}

</script>

<template>
  <h1>Welcome</h1>
  <aeria-button @click="githubAuth()">clique</aeria-button>
</template>
