import { Hono } from 'hono'
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/post.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const posts = new Hono()

posts.get('/', getPosts)
posts.get('/:id', getPost)

// Authenticated routes
posts.use('/*', authMiddleware)
posts.post('/', createPost)
posts.put('/:id', updatePost)
posts.delete('/:id', deletePost)

export default posts
