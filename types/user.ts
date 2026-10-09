import { Role } from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  name: string;
  role: Role;
  avatar?: string | null;
  capabilities?: string[];
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}
