import { hash, compare } from 'bcryptjs'
import { sign, verify } from 'hono/jwt'

export const hashPassword = async (password: string) => {
    return await hash(password, 10)
}

export const verifyPassword = async (password: string, hash: string) => {
    return await compare(password, hash)
}

export const createToken = async (userId: string) => {
    const secret = process.env.JWT_SECRET || 'supersecret'
    const payload = {
        sub: userId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
    }
    return await sign(payload, secret)
}

export const verifyToken = async (token: string) => {
    const secret = process.env.JWT_SECRET || 'supersecret'
    return await verify(token, secret)
}
