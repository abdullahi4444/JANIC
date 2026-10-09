import { Role } from "@prisma/client";

export type UserRole = Role | "ADMIN" | "EDITOR" | "STAFF" | "USER";

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  capabilities?: string[];
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}
