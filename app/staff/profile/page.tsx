import React from "react";
import { getCurrentUser } from "@/lib/auth/jwt";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { UserProfileForm } from "@/components/admin/UserProfileForm";

export const dynamic = "force-dynamic";

export default async function StaffProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, username: true, email: true, avatar: true, role: true }
  });

  if (!fullUser) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and personal information.
        </p>
      </div>

      <UserProfileForm user={fullUser} />
    </div>
  );
}
