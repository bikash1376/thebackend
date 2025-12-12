import type { Context, Next } from 'hono'
import { verifyToken } from '../lib/auth.js'

export const authMiddleware = async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.split(' ')[1]
    try {
        const payload = await verifyToken(token)
        c.set('userId', payload.sub)
        await next()
    } catch (error) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
}
