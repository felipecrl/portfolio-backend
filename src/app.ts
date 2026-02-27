import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { globalLimiter } from "./middlewares/rate-limit.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(globalLimiter);
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_request, response) => {
  return response.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.use((_request, response) => {
  return response.status(404).json({ message: "Rota não encontrada." });
});
