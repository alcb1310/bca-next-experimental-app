// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { JWTVerifyResult, jwtVerify } from 'jose';
import validateRole from './pages/helpers/authorization/validateRole';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const jwt = request.cookies.get('bca-token');
    const path = request.nextUrl.pathname;

    if (jwt === undefined)
        return NextResponse.redirect(new URL(`/login?from=${path}`, request.url));

    if (process.env.SECRET === undefined) throw new Error('Unable to load SECRET environment variable');

    try {
        const payload: JWTVerifyResult = await jwtVerify(jwt.value, new TextEncoder().encode(process.env.SECRET));
        const email = payload.payload.user as string;

        if (await validateRole(email, path.split('/')) === false)
            return NextResponse.redirect(new URL('/unauthorized', request.url));
    } catch (error) {
        return NextResponse.redirect(new URL(`/login?from=${path}`, request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/bca/:path*',
    ],
};