import { Hono } from 'hono'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth', authRoutes)
app.route('/posts', postRoutes)

export default app