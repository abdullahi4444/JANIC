import { AuthUser } from "@/types/user";
import { PermissionCapability } from "./capabilities";

/**
 * Checks if a user has a specific capability.
 * ADMIN role automatically has all capabilities.
 */
export function hasCapability(user: AuthUser | null | undefined, capability: PermissionCapability): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.capabilities?.includes(capability) ?? false;
}

/**
 * Checks if a user has ANY of the specified capabilities.
 * ADMIN role automatically returns true.
 */
export function hasAnyCapability(user: AuthUser | null | undefined, capabilities: PermissionCapability[]): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  if (!capabilities || capabilities.length === 0) return true;
  
  return capabilities.some((cap) => user.capabilities?.includes(cap));
}

/**
 * Checks if a user has ALL of the specified capabilities.
 * ADMIN role automatically returns true.
 */
export function hasAllCapabilities(user: AuthUser | null | undefined, capabilities: PermissionCapability[]): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  if (!capabilities || capabilities.length === 0) return true;
  
  return capabilities.every((cap) => user.capabilities?.includes(cap));
}
