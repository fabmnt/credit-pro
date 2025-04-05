import { getSessionCookie } from 'better-auth/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/api/auth']

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Check if the current path is a public route or starts with a public route
	const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

	// If it's not a public route, check for authentication
	if (!isPublicRoute) {
		// Get the auth cookie that would be set by better-auth
		// The cookie name is typically 'session_token' based on the database schema
		const sessionCookie = getSessionCookie(request)
		// If no auth cookie exists, redirect to login
		if (!sessionCookie) {
			const loginUrl = new URL('/login', request.url)
			return NextResponse.redirect(loginUrl)
		}
	}

	// Allow the request to continue
	return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
	// Apply to all routes except static files and api routes that don't need protection
	matcher: [
		/*
		 * Match all request paths except:
		 * 1. _next/static (static files)
		 * 2. _next/image (image optimization files)
		 * 3. favicon.ico (favicon file)
		 */
		'/((?!_next/static|_next/image|favicon.ico).*)',
	],
}
