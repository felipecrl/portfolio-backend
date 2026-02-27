import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { verifyAuthToken } from "../lib/jwt.js";

export type AuthenticatedRequest = Request & {
  admin?: {
    id: string;
    username: string;
    role: "ADMIN";
  };
};

function getAuthCookie(request: Request): string | null {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((entry) => entry.trim());
  const tokenCookie = cookies.find((entry) => entry.startsWith(`${env.cookieName}=`));
  return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;
}

export function requireAdminAuth(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const token = getAuthCookie(request);

  if (!token) {
    return response.status(401).json({ message: "Não autorizado." });
  }

  try {
    const payload = verifyAuthToken(token);

    request.admin = {
      id: payload.sub,
      username: payload.username,
      role: payload.role
    };

    return next();
  } catch {
    return response.status(401).json({ message: "Sessão inválida." });
  }
}
