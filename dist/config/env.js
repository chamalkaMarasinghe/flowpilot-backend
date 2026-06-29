import "dotenv/config";
const isVercel = Boolean(process.env.VERCEL);
function requireEnv(key, fallback) {
    const value = process.env[key] ?? fallback;
    if (!value)
        throw new Error(`Missing required env var: ${key}`);
    return value;
}
function requireProductionEnv(key, devFallback) {
    if (isVercel) {
        return requireEnv(key);
    }
    return requireEnv(key, devFallback);
}
function resolveApiBaseUrl() {
    if (process.env.API_BASE_URL) {
        return process.env.API_BASE_URL.replace(/\/$/, "");
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return `http://localhost:${process.env.PORT ?? 5000}`;
}
export const env = {
    PORT: Number(process.env.PORT ?? 5000),
    MONGODB_URI: requireProductionEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/flowpilot"),
    JWT_SECRET: requireProductionEnv("JWT_SECRET", "dev-flowpilot-secret-change-in-production"),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:8080",
    NODE_ENV: process.env.NODE_ENV ?? (isVercel ? "production" : "development"),
    API_BASE_URL: resolveApiBaseUrl(),
};
//# sourceMappingURL=env.js.map