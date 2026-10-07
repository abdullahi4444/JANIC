import React from "react";
import { getCurrentUser } from "@/lib/auth/jwt";
import { AdminShell } from "@/components/admin/AdminShell";
import prisma from "@/lib/db/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return <>{children}</>;
  }

  const [unreadMessages, pendingSubmissions, newPartnerships] = await Promise.all([
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.innovationSubmission.count({ where: { status: "PENDING" } }),
    prisma.partnershipInquiry.count({ where: { status: "NEW" } }),
  ]);
  const notifCount = unreadMessages + pendingSubmissions + newPartnerships;

  return <AdminShell user={user} notifCount={notifCount}>{children}</AdminShell>;
}
