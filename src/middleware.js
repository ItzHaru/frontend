import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

export default authMiddleware({
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (
      !auth.userId &&
      !auth.isPublicRoute &&
      ((req.url != process.env.NODE_ENV) === "development"
        ? "http://localhost:3000/"
        : "https://harudolore.vercel.app")
    ) {
      return NextResponse.redirect(
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/"
          : "https://harudolore.vercel.app"
      );
    }
  },
});
