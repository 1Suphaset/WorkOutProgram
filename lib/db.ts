import { Pool } from "pg"

const globalForPg = global as unknown as {
  pool?: Pool
}

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    max: 1, // 🔥 สำคัญมากใน serverless
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool
}
