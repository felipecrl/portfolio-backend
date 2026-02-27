import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type AuthPayload = {
  sub: string;
  username: string;
  role: "ADMIN";
};

export function signAuthToken(payload: AuthPayload): string {
  const expiresIn = env.jwtExpiresIn as jwt.SignOptions["expiresIn"];

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn
  });
}

export function verifyAuthToken(token: string): AuthPayload {
  return jwt.verify(token, env.jwtSecret) as AuthPayload;
}
