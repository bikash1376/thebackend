import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config"
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth', authRoutes)
app.route('/posts', postRoutes)

const port = Number(process.env.PORT) || 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

export default app