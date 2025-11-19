import { NextRequest, NextResponse } from "next/server";
import { authService, AuthUser } from "../auth";

export function withAuth(
  handler: (request: NextRequest, user: AuthUser, ...args: any[]) => Promise<NextResponse>,
  options: { requireAdmin?: boolean } = {}
) {
  return async function (request: NextRequest, ...args: any[]): Promise<NextResponse> {
    const user = await authService.getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please provide valid authentication" },
        { status: 401 }
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: "Account not verified" },
        { status: 403 }
      );
    }

    if (options.requireAdmin && user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return await handler(request, user, ...args);
  };
}

