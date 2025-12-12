import type { Context } from 'hono'
import prisma from '../lib/db.js'
import { z } from 'zod'

const createPostSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    published: z.boolean().optional(),
})

const updatePostSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    published: z.boolean().optional(),
})

export const getPosts = async (c: Context) => {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: { author: { select: { name: true, email: true } } },
        })
        return c.json(posts)
    } catch (error) {
        console.error(error)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const getPost = async (c: Context) => {
    try {
        const id = c.req.param('id')
        const post = await prisma.post.findUnique({
            where: { id },
            include: { author: { select: { name: true } } },
        })
        if (!post) return c.json({ error: 'Post not found' }, 404)
        return c.json(post)
    } catch (error) {
        console.error(error)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const createPost = async (c: Context) => {
    const userId = c.get('userId') as string
    try {
        const body = await c.req.json()
        const { title, content, published } = createPostSchema.parse(body)

        const post = await prisma.post.create({
            data: {
                title,
                content,
                published,
                authorId: userId,
            },
        })
        return c.json(post, 201)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: error.issues }, 400)
        }
        console.error(error)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const updatePost = async (c: Context) => {
    const id = c.req.param('id')
    const userId = c.get('userId') as string

    try {
        const post = await prisma.post.findUnique({ where: { id } })
        if (!post) return c.json({ error: 'Post not found' }, 404)
        if (post.authorId !== userId) return c.json({ error: 'Forbidden' }, 403)

        const body = await c.req.json()
        const data = updatePostSchema.parse(body)

        const updatedPost = await prisma.post.update({
            where: { id },
            data,
        })
        return c.json(updatedPost)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: error.issues }, 400)
        }
        console.error(error)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const deletePost = async (c: Context) => {
    const id = c.req.param('id')
    const userId = c.get('userId') as string

    try {
        const post = await prisma.post.findUnique({ where: { id } })
        if (!post) return c.json({ error: 'Post not found' }, 404)
        if (post.authorId !== userId) return c.json({ error: 'Forbidden' }, 403)

        await prisma.post.delete({ where: { id } })
        return c.json({ message: 'Post deleted' })
    } catch (error) {
        console.error(error)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}
