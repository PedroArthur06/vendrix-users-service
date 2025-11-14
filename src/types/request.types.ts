import { UserProfile } from "../models/user.types";

export interface RegisterRequest {
  email: string;
  password: string;
  profile: UserProfile;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    profile: UserProfile;
  };
}

