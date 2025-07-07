import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('JWT_TOKEN')?.value;
  const path = request.nextUrl.pathname;

  // Allow public routes
  if (path.startsWith('/auth') || path === '/unauthorized') {
    return NextResponse.next();
  }

  // Check for token presence
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string; exp: number };
    const role = decoded.role.replace('ROLE_', '').toLowerCase();

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      const response = NextResponse.redirect(new URL('/auth/signin', request.url));
      response.cookies.delete('JWT_TOKEN');
      return response;
    }

    // Role-based access control
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (path.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Middleware error:', err);
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    response.cookies.delete('JWT_TOKEN');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/student/:path*', '/logout'],
};