import type { Context } from 'hono'
import prisma from '../lib/db.js'
import { hashPassword, verifyPassword, createToken } from '../lib/auth.js'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const register = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { email, password, name } = registerSchema.parse(body)

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return c.json({ error: 'User already exists' }, 400)
        }

        const hashedPassword = await hashPassword(password)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        const token = await createToken(user.id)
        return c.json({ token, user: { id: user.id, email: user.email, name: user.name } }, 201)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: error.issues }, 400)
        }
        console.error(error)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}

export const login = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { email, password } = loginSchema.parse(body)

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !(await verifyPassword(password, user.password))) {
            return c.json({ error: 'Invalid credentials' }, 401)
        }

        const token = await createToken(user.id)
        return c.json({ token, user: { id: user.id, email: user.email, name: user.name } })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: error.issues }, 400)
        }
        console.error(error)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
}
