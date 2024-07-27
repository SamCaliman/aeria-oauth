import { createRouter} from 'aeria'

import { google } from './implementations/google.js'
import { twitch } from './implementations/twitch.js'
import { github } from './implementations/github.js'

export const AuthRouter = createRouter()

AuthRouter.POST('/github', github)
AuthRouter.POST('/twitch', twitch)
AuthRouter.POST('/google', google)