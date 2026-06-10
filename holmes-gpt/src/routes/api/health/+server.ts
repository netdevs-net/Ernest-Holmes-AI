import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import DatabaseManager from "$lib/db/database";

export const GET: RequestHandler = async () => {
  try {
    const dbManager = DatabaseManager.getInstance();
    const health = dbManager.healthCheck();

    return json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: health,
    });
  } catch (error) {
    return json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
