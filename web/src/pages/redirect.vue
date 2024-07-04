<script setup lang="ts">
import {CollectionItemWithId, Result, EndpointError} from '@aeriajs/types'

const router = useRouter()
const userStore = useStore('user')

type SuccessfulAuthentication = {
  user: CollectionItemWithId<'user'>,
  token:{
    type:'string',
    content: 'string'
  }
}

onMounted(async ()=>{
    const gitTempCode = router.currentRoute.value.query.code
    if(gitTempCode){
        const {error,result}: Result.Either<EndpointError, SuccessfulAuthentication>= await aeria.github.githubAuth.POST({
            code: gitTempCode
        }) as any
        console.log(result)
        if(result){
          userStore.$actions.setCurrentUser(result)
          window.open('http://localhost:8080/dashboard', '_self')
        }
        if(error){
          window.open('http://localhost:8080/githubAuth')
        }
    }
})

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
    Aguarde enquanto verificamos seu login
  </div>
</section>
  
</template>
