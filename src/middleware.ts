import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "./app/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

const middleware = async (request: NextRequest) => {
    const {pathname} = request.nextUrl;
    const session = await auth();
    const isAuthenticated = !!session?.user;
    console.log(isAuthenticated, pathname);

    // add routes here if they are meant to be public (would probably include contact later once implemented)
    const publicPaths = ["/", "/login", "/signup", "/about", "/contact", "/public"];

    if (!isAuthenticated && !publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
};

// add routes to this array to restrict its route to unauthenticated users (adding about for now temporarily, change later). 
// the reports route would probably go here too
export const config = {
    matcher: [
        "/reports", "/dashboard"
    ]
};

export default middleware;