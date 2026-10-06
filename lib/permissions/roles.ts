import { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/jwt";

export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

export function canManageUsers(role: Role): boolean {
  return role === Role.ADMIN;
}

export function canPublishContent(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR;
}

export function canEditContent(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR;
}

export function canReviewSubmissions(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR || role === Role.STAFF;
}

export async function requireAuth(allowedRoles?: Role[]) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(user.role, allowedRoles)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
