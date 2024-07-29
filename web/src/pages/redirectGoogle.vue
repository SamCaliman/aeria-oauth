<script setup lang="ts">
import type { CollectionItemWithId, Result, EndpointError } from '@aeriajs/types'

const router = useRouter()

const userStore = useStore('user')
const metaStore = useStore('meta')

type SuccessfulAuthentication = {
  user: CollectionItemWithId<'user'>,
  token: {
    type: 'string',
    content: 'string'
  }
}

onMounted(async ()=>{
    //get twitch temporary code when returning from authorization page
    const googleTempCode = router.currentRoute.value.query.code

    //if twitch code exists call API authentication route
    if(googleTempCode){
        const { error,result } = await aeria.OAuth.google.POST<Result.Either<EndpointError, SuccessfulAuthentication>>({
            code: googleTempCode,
        })
        if(error){
          //if authentication fails, go back to login page
          router.push('/OAuth')
          return
        }
        //if authentication succeeds, login returned user and go to dashboard
        userStore.$actions.setCurrentUser(result)
        await metaStore.$actions.describe({
          roles: true,
        })
        router.push('/dashboard')
    }
})

</script>

<template>
  <section
    class="
      tw-w-full
      tw-h-[100vh]
      tw-bg-neutral-800
      tw-flex
    "
  >
    <div
      class="
        tw-rounded
        tw-bg-neutral-600
        tw-w-3/5
        tw-min-w-[30rem]
        tw-p-6
        tw-flex
        tw-flex-col
        tw-rounded-md
        tw-m-auto
        tw-text-center
        tw-text-white
      "
    >
      Wait while we verify your login
    </div>
  </section>
</template>
