import type { Response } from "express";
import { env, isProduction } from "../config/env.js";

export function setAuthCookie(response: Response, token: string) {
  const maxAge = 8 * 60 * 60 * 1000;
  const cookieValue = `${env.cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge / 1000}${isProduction() ? "; Secure" : ""}`;
  response.setHeader("Set-Cookie", cookieValue);
}

export function clearAuthCookie(response: Response) {
  const cookieValue = `${env.cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isProduction() ? "; Secure" : ""}`;
  response.setHeader("Set-Cookie", cookieValue);
}
