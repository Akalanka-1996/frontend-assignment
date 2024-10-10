import type { NextRequest } from "next/server";
import { updateSession } from "./lib/authenticaton";


export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|login|register).*)",
  ],
};
