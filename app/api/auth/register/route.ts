import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/user.repository";
import { Role } from "@prisma/client";
import { isEnabled } from "@/lib/settings";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username may only contain letters, numbers, dots, dashes and underscores"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!(await isEnabled("allow_registrations", true))) {
      return NextResponse.json({ success: false, error: "Registration is currently disabled" }, { status: 403 });
    }
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, username, email, password } = parsed.data;

    const existingUsername = await UserRepository.findByUsername(username);
    if (existingUsername) {
      return NextResponse.json({ success: false, error: "Username is already taken" }, { status: 409 });
    }

    const existingEmail = await UserRepository.findByEmail(email);
    if (existingEmail) {
      return NextResponse.json({ success: false, error: "Email is already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserRepository.create({
      email,
      username,
      passwordHash,
      name,
      role: Role.USER,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully. You can now sign in.",
      user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
