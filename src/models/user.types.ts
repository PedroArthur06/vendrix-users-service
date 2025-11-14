export interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export interface UserProfile {
  name: string;
  lastName?: string;
  phone?: string;
  address?: Address;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}
