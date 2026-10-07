import { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/jwt";
import { SettingService } from "@/services/settings/setting.service";

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

export const PERMISSION_CAPABILITIES = [
  "manage_users",
  "manage_settings",
  "edit_content",
  "publish_content",
  "delete_content",
  "review_submissions",
  "manage_media",
  "manage_team",
] as const;

export type PermissionCapability = (typeof PERMISSION_CAPABILITIES)[number];

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, PermissionCapability[]> = {
  ADMIN: [...PERMISSION_CAPABILITIES],
  EDITOR: ["edit_content", "publish_content", "review_submissions", "manage_media"],
  STAFF: ["review_submissions"],
};

export async function getRolePermissions(): Promise<Record<Role, string[]>> {
  try {
    const raw = await SettingService.getByKey("role_permissions");
    if (raw?.value) {
      const parsed = JSON.parse(raw.value);
      for (const role of Object.values(Role)) {
        if (!Array.isArray(parsed[role])) return DEFAULT_ROLE_PERMISSIONS;
      }
      return parsed;
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_ROLE_PERMISSIONS;
}

export async function hasPermission(role: Role, capability: PermissionCapability): Promise<boolean> {
  const permissions = await getRolePermissions();
  return (permissions[role] || []).includes(capability);
}

export async function requireAuth(allowedRoles?: Role[], capability?: PermissionCapability) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(user.role, allowedRoles)) {
    throw new Error("FORBIDDEN");
  }

  if (capability) {
    const allowed = await hasPermission(user.role, capability);
    if (!allowed) {
      throw new Error("FORBIDDEN");
    }
  }

  return user;
}
