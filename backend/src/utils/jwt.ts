import jwt, { Secret, SignOptions } from "jsonwebtoken";

export type JwtPayload = {
    id: string
    email: string
}

export const signJwt = (payload: JwtPayload, expiresIn?: string) => {
    const secrect: Secret = process.env.JWT_SECRET as unknown as Secret;

    let options: SignOptions = {};
    const expiration = expiresIn;
    if (expiresIn) {
        options = { expiresIn: expiration as unknown as NonNullable<SignOptions>['expiresIn'] };
    }

    return jwt.sign(payload, secrect, options);
}

export const verifyJwt = (token: string): JwtPayload | null => {
    const secret: Secret = process.env.JWT_SECRET as unknown as Secret;
    try {
        const payload = jwt.verify(token, secret) as JwtPayload;
        return payload;
    } catch (err) {
        console.error('JWT verification error:', err);
        return null;
    }
}