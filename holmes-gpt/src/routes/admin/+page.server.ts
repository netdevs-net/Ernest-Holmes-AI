import type { PageServerLoad } from "./$types";
import { emailStats } from "$lib/server/db/emails";
import { listAll, questionStats } from "$lib/server/db/history";
import { getSecurityMetrics, limits } from "$lib/server/security";

export const load: PageServerLoad = ({ url }) => {
  const search = url.searchParams.get("q") ?? "";
  const category = url.searchParams.get("category") ?? "all";

  return {
    search,
    category,
    questions: listAll({ search, category }),
    stats: questionStats(),
    emails: emailStats(),
    metrics: getSecurityMetrics(),
    limits,
  };
};
