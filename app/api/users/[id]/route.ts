import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/user.repository";
import { requireAuth } from "@/lib/permissions/roles";
import { Role } from "@prisma/client";

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.nativeEnum(Role).optional(),
  password: z.string().min(6).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth([Role.ADMIN], "manage_users");
    const { id } = await params;
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data: { name?: string; role?: Role; passwordHash?: string } = {};
    if (parsed.data.name) data.name = parsed.data.name;
    if (parsed.data.role) data.role = parsed.data.role;
    if (parsed.data.password) data.passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await UserRepository.update(id, data);
    return NextResponse.json({ success: true, item: { id: user.id, name: user.name, role: user.role } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const current = await requireAuth([Role.ADMIN], "manage_users");
    const { id } = await params;
    if (current.id === id) {
      return NextResponse.json({ success: false, error: "You cannot delete your own account" }, { status: 400 });
    }
    await UserRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
