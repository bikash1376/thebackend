import { Hono } from 'hono'
import { register, login, logout } from '../controllers/auth.controller.js'

const auth = new Hono()

auth.post('/signup', register)
auth.post('/login', login)
auth.get('/logout', logout)

export default auth
