import { UserProfile } from "../../src/models/user.types";
import { RegisterRequest, LoginRequest } from "../../src/types/request.types";

export const mockUserProfile: UserProfile = {
  name: "Pedro Arthur",
  lastName: "Rodrigues",
  phone: "+1234567890",
  address: {
    street: "123",
    city: "CBA",
    zipCode: "10001",
  },
};

export const mockRegisterRequest: RegisterRequest = {
  email: "pedro.test@example.com",
  password: "password123",
  profile: mockUserProfile,
};

export const mockLoginRequest: LoginRequest = {
  email: "pedro.test@example.com",
  password: "password123",
};

export const createMockUser = (
  overrides?: Partial<RegisterRequest>
): RegisterRequest => {
  return {
    ...mockRegisterRequest,
    ...overrides,
  };
};

export const createMockLogin = (
  overrides?: Partial<LoginRequest>
): LoginRequest => {
  return {
    ...mockLoginRequest,
    ...overrides,
  };
};
