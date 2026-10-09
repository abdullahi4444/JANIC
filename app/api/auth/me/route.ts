import { NextResponse, NextRequest } from "next/server";
import { getCurrentUser, signAuthToken, SESSION_COOKIE_NAME } from "@/lib/auth/jwt";
import prisma from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const { name, username, email, avatar, password } = body;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (username) dataToUpdate.username = username;
    if (email) dataToUpdate.email = email;
    if (avatar !== undefined) dataToUpdate.avatar = avatar;

    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
      select: { id: true, name: true, username: true, email: true, avatar: true, role: true }
    });

    const token = await signAuthToken(updatedUser as any);
    const response = NextResponse.json({ success: true, user: updatedUser });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "Username or email already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
