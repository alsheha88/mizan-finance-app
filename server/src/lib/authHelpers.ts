import jwt, { type JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import "dotenv/config";


const saltRounds = Number(process.env.SALT_ROUNDS) || 12;
const secret = process.env.JWT_SECRET as jwt.Secret;



type AccessTokenPayload = {
    userId: string
}


export const hashPassword = (password:string) => {
    return bcrypt.hashSync(password, saltRounds )
}

export const checkPassword = (password:string, hash:string) => {
    return bcrypt.compare(password, hash)
}

export const generateToken = (token:AccessTokenPayload) => {
    return jwt.sign(token, secret, {
        expiresIn: '1h',

    })
}

export const verifyToken = (token:string) => {
    return jwt.verify(token, secret) as JwtPayload
}

export function generateRawToken(): string {
	return crypto.randomBytes(32).toString("hex");
}

export function hashToken(rawToken: string): string {
	return crypto.createHash("sha256").update(rawToken).digest("hex");
}