<script setup lang="ts">

const router = useRouter()

onMounted(async ()=>{
    const CODE = router.currentRoute.value.query.code
    if(CODE){
        const response = await aeria.github.githubAuth.POST({
            code: CODE
        })
        console.log(response)
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
