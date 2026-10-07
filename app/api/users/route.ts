import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/user.repository";
import { requireAuth } from "@/lib/permissions/roles";
import { Role } from "@prisma/client";

const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Invalid username characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role).optional(),
});

export async function GET() {
  try {
    await requireAuth([Role.ADMIN], "manage_users");
    const users = await UserRepository.listAll();
    return NextResponse.json({ success: true, items: users });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth([Role.ADMIN], "manage_users");
    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const existingUsername = await UserRepository.findByUsername(parsed.data.username);
    if (existingUsername) {
      return NextResponse.json({ success: false, error: "Username is already taken" }, { status: 409 });
    }
    const existingEmail = await UserRepository.findByEmail(parsed.data.email);
    if (existingEmail) {
      return NextResponse.json({ success: false, error: "Email is already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await UserRepository.create({
      email: parsed.data.email,
      username: parsed.data.username,
      passwordHash,
      name: parsed.data.name,
      role: parsed.data.role,
    });

    return NextResponse.json({
      success: true,
      item: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
