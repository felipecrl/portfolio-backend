import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signAuthToken } from "../lib/jwt.js";
import { clearAuthCookie, setAuthCookie } from "../utils/cookie.js";
import { requireAdminAuth, type AuthenticatedRequest } from "../middlewares/auth.js";
import { loginLimiter } from "../middlewares/rate-limit.js";

const loginSchema = z.object({
  username: z.string().trim().min(3).max(50),
  password: z.string().min(8).max(72)
});

export const authRouter = Router();

authRouter.post("/login", loginLimiter, async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ message: "Credenciais inválidas." });
  }

  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() }
  });

  if (!user) {
    return response.status(401).json({ message: "Login ou senha inválidos." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return response.status(401).json({ message: "Login ou senha inválidos." });
  }

  const token = signAuthToken({
    sub: user.id,
    username: user.username,
    role: user.role
  });

  setAuthCookie(response, token);

  return response.status(200).json({
    username: user.username,
    role: user.role
  });
});

authRouter.post("/logout", (_request, response) => {
  clearAuthCookie(response);
  return response.status(204).send();
});

authRouter.get("/me", requireAdminAuth, async (request: AuthenticatedRequest, response) => {
  const admin = request.admin;

  if (!admin) {
    return response.status(401).json({ message: "Não autorizado." });
  }

  return response.status(200).json({
    username: admin.username,
    role: admin.role
  });
});
