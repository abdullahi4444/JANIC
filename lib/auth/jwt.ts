import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AuthUser } from "@/types/user";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "janic_super_secret_session_jwt_key_2026_xYz987!@"
);

export const SESSION_COOKIE_NAME = "janic_auth_token";
const TOKEN_EXPIRY = "7d";

export async function signAuthToken(user: AuthUser): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET_KEY);
}

export async function verifyAuthToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      id: payload.id as string,
      email: payload.email as string,
      username: (payload.username as string) || undefined,
      name: payload.name as string,
      role: payload.role as AuthUser["role"],
      avatar: (payload.avatar as string) || null,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}
