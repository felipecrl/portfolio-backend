import "dotenv/config";

type EnvironmentConfig = {
  port: number;
  frontendUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  cookieName: string;
  nodeEnv: string;
};

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const nodeEnv = process.env.NODE_ENV ?? "development";

export const env: EnvironmentConfig = {
  port: Number(process.env.PORT ?? 3333),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  jwtSecret: requireEnv("JWT_SECRET", process.env.JWT_SECRET),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  cookieName: process.env.COOKIE_NAME ?? "portfolio_admin_token",
  nodeEnv
};

export function isProduction() {
  return env.nodeEnv === "production";
}
