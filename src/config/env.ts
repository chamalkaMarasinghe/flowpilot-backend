import "dotenv/config";

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export const env = {
  PORT: Number(process.env.PORT ?? 5000),
  MONGODB_URI: requireEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/flowpilot"),
  JWT_SECRET: requireEnv("JWT_SECRET", "dev-flowpilot-secret-change-in-production"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:8080",
  NODE_ENV: process.env.NODE_ENV ?? "development",
};
