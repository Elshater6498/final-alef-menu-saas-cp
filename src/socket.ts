import { io } from 'socket.io-client'
import appConfig from './configs/app.config'

const URL = `ws://saas.alefmenu.com/orders`

export const socket = () => io(URL)
