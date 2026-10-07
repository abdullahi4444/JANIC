import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuthService } from "@/services/auth/auth.service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/jwt";

const loginSchema = z.object({
  username: z.string().min(2, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const { user, token } = await AuthService.login(username, password);

    const response = NextResponse.json({
      success: true,
      user,
      message: "Authentication successful",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed";
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
