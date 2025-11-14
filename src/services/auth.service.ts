import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { User } from "../models/user.types";
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from "../types/request.types";

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly SALT_ROUNDS = 10;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await UserModel.findOne({
      email: data.email.toLowerCase(),
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const user = new UserModel({
      email: data.email.toLowerCase(),
      passwordHash,
      profile: data.profile,
    });

    await user.save();

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    };
  }

  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  verifyToken(token: string): { id: string; email: string } {
    try {
      return jwt.verify(token, this.JWT_SECRET) as {
        id: string;
        email: string;
      };
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
