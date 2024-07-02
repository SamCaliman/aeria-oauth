import { createRouter } from 'aeria'

export const userRouter = createRouter()

userRouter.POST('/createGithubUser', async (context)=>{
  return context.collections.user.functions.insert({
    what: {
      name: context.request.payload.name,
      github_id: context.request.payload.github_id,
    }as any,
  })
})
