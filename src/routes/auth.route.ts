import { Hono } from 'hono'
import { register, login } from '../controllers/auth.controller.js'

const auth = new Hono()

auth.post('/signup', register)
auth.post('/login', login)

export default auth
