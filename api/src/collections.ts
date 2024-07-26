export * from '../.aeria/out/collections/index.mjs'
export {
  file, tempFile,
} from 'aeria'
import { extendCollection, user as originalUser } from 'aeria'

export const user = extendCollection(originalUser,{
  description: {
    form: [
      'github_id',
      'twitch_id',
      'google_id'
    ],
    properties: {
      github_id: {
        type: 'string',
      },
      twitch_id: {
        type: 'string',
      },
      google_id:{
        type:'string'
      }
    },
  },
})
