import { NextRequest, NextResponse } from "next/server";

// Protects the whole app with a single shared username/password, using
// HTTP Basic Auth. It only activates if both AUTH_USER and AUTH_PASS are
// set as environment variables in Vercel — otherwise the app stays open.
export function middleware(req: NextRequest) {
  const user = process.env.AUTH_USER;
  const pass = process.env.AUTH_PASS;

  if (!user || !pass) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const separatorIndex = decoded.indexOf(":");
      const suppliedUser = decoded.slice(0, separatorIndex);
      const suppliedPass = decoded.slice(separatorIndex + 1);
      if (suppliedUser === user && suppliedPass === pass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Accesso richiesto.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Riservo KPI"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
