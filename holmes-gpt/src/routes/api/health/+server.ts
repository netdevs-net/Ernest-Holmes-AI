import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import DatabaseManager from "$lib/db/database.ts";

export const GET: RequestHandler = async () => {
  try {
    const dbManager = DatabaseManager.getInstance();
    const health = dbManager.healthCheck();
    
    return json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: health,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        dbDir: process.env.DB_DIR || "default",
        cwd: process.cwd()
      }
    });
  } catch (error) {
    return json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        dbDir: process.env.DB_DIR || "default",
        cwd: process.cwd()
      }
    }, { status: 500 });
  }
}; 