// /middleware.ts
import { getUserSession } from './session';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export async function middleware(request: NextRequest) {
  const session = await getUserSession(request);
  const { pathname } = request.nextUrl;

  // Routes protégées
  const protectedRoutes = ['/dashboard', '/profile'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}