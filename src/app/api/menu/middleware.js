export function middleware(request) {
  console.log('Menu API Request:', {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    nextUrl: request.nextUrl?.toString()
  });
  
  // Continue with the request
  return NextResponse.next();
}