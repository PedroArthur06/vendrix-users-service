import { Response } from "express";
import { UserModel } from "../../src/models/user.model";
import { User } from "../../src/models/user.types";
import * as bcrypt from "bcrypt";
import { mockUserProfile } from "../fixtures/user.fixtures";

export const createTestUser = async (
  email: string = "pedro.test@example.com",
  password: string = "password123"
): Promise<User> => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new UserModel({
    email,
    passwordHash,
    profile: mockUserProfile,
  });

  await user.save();
  return user;
};

export const mockResponse = (): Partial<Response> => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const mockRequest = (body: any = {}, headers: any = {}): any => {
  return {
    body,
    headers,
    ip: "127.0.0.1",
    socket: {
      remoteAddress: "127.0.0.1",
    },
  };
};
