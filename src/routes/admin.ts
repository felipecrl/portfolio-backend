import { Router } from "express";
import { requireAdminAuth, type AuthenticatedRequest } from "../middlewares/auth.js";

export const adminRouter = Router();

adminRouter.get("/panel", requireAdminAuth, (request: AuthenticatedRequest, response) => {
  return response.status(200).json({
    message: "Painel administrativo autenticado.",
    admin: request.admin
  });
});
