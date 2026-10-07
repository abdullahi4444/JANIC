import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/user.repository";
import { signAuthToken } from "@/lib/auth/jwt";
import { AuthUser } from "@/types/user";

export class AuthService {
  static async login(username: string, passwordPlain: string): Promise<{ user: AuthUser; token: string }> {
    const user = await UserRepository.findByUsername(username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid username or password");
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    };

    const token = await signAuthToken(authUser);
    return { user: authUser, token };
  }
}
