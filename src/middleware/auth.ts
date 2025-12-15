import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { verifyToken } from '../lib/auth.js'

export const authMiddleware = async (c: Context, next: Next) => {
    const token = getCookie(c, 'auth_token')

    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    try {
        const payload = await verifyToken(token)
        c.set('userId', payload.sub)
        await next()
    } catch (error) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
}
