import { createRouter } from 'aeria'
import { AuthRouter } from './oauth.js'

export const router = createRouter()
router.group('/oauth', AuthRouter)

