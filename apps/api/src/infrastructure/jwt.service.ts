import { Injectable } from '@nestjs/common';
import { sign, verify, decode } from 'jsonwebtoken';

export interface JwtPayload {
    userId: number;
    email: string;
    name: string;
}

@Injectable()
export class JwtService {
    private readonly secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    private readonly expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    generateToken(payload: JwtPayload): string {
        return sign(payload, this.secret, { expiresIn: this.expiresIn } as any);
    }

    verifyToken(token: string): JwtPayload {
        try {
            return verify(token, this.secret) as JwtPayload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    decodeToken(token: string): JwtPayload | null {
        try {
            return decode(token) as JwtPayload;
        } catch (error) {
            return null;
        }
    }
}

