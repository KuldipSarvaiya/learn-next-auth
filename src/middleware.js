  import { withAuth } from "next-auth/middleware";
  import { NextResponse } from "next/server";

  export const config = {
    matcher: ["/CreateUser", "/ClientMember"],
  };

  export default withAuth(
    function middleware(req) {
      console.log("middleware");
      console.log(req.nextUrl.pathname);
      console.log(req.nextauth.token);

      // role base auth on that route
      if (req?.nextauth?.token?.role != "admin") {
        return NextResponse.rewrite(new URL("/Denied", req.url));
      }
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token,
      },
    }
  );
