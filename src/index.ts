import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/api/hello', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  })
})

app.get('/posts/:id', (c) => {
  const page = c.req.query('page')
  const id = c.req.param('id')
  c.header('X-Message', 'Hi!')
  return c.text(`You want to see ${page} of ${id}`)
})



app.get('/page', (c) => {
  return c.html(`
    <html><body>
    <h1>Hello Hono!</h1>
    <h2>hi there</h2>
    </body></html>
    `)
})

app.get('/', () => {
  return new Response('Good morning!')
})


serve(app)
//  console.log(c.req.method, c.req.url) 