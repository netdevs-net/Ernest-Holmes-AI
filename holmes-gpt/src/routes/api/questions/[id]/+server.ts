import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import sqliteStorage from "$lib/utils/sqliteStorage";

// PUT /api/questions/[id] - Update a question
export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const { id } = params;
    const updates = await request.json();

    if (!id) {
      return json({ error: "Question ID is required" }, { status: 400 });
    }

    // Update question source and response preview
    if (updates.responsePreview || updates.source) {
      sqliteStorage.updateQuestionSource(id, {
        responsePreview: updates.responsePreview,
        source: updates.source,
      });
    }

    return json({ success: true, message: "Question updated successfully" });
  } catch (error) {
    console.error("Error updating question:", error);
    return json({ error: "Failed to update question" }, { status: 500 });
  }
};

// DELETE /api/questions/[id] - Delete a question
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return json({ error: "Question ID is required" }, { status: 400 });
    }

    sqliteStorage.deleteQuestion(id);

    return json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return json({ error: "Failed to delete question" }, { status: 500 });
  }
};
