/**
 * A tiny, dependency-free renderer for the subset of Markdown the model
 * produces: **bold**, *italic*, bullet / numbered lists, headings and
 * paragraphs. Input is HTML-escaped first, so the output is safe to use with
 * `{@html}` even when the text comes from a model or a user.
 */

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

function inline(escaped: string): string {
  return escaped
    .replace(/\*\*(?=\S)(.+?)(?<=\S)\*\*/g, "<strong>$1</strong>")
    .replace(
      /(?<![*\w])\*(?=[^\s*])(.+?)(?<=[^\s*])\*(?![*\w])/g,
      "<em>$1</em>",
    );
}

const BULLET = /^\s*[•\-*]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;
const HEADING = /^\s*#{1,4}\s+(.*)$/;

type ListKind = "ul" | "ol";

export function renderMarkdown(source: string): string {
  const out: string[] = [];
  let list: ListKind | null = null;

  const closeList = () => {
    if (list) {
      out.push(`</${list}>`);
      list = null;
    }
  };

  const openList = (kind: ListKind) => {
    if (list !== kind) {
      closeList();
      out.push(`<${kind}>`);
      list = kind;
    }
  };

  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      closeList();
      out.push(`<h3>${inline(escapeHtml(heading[1]))}</h3>`);
      continue;
    }

    const bullet = BULLET.exec(line);
    if (bullet) {
      openList("ul");
      out.push(`<li>${inline(escapeHtml(bullet[1]))}</li>`);
      continue;
    }

    const numbered = NUMBERED.exec(line);
    if (numbered) {
      openList("ol");
      out.push(`<li>${inline(escapeHtml(numbered[1]))}</li>`);
      continue;
    }

    closeList();
    out.push(`<p>${inline(escapeHtml(line))}</p>`);
  }

  closeList();
  return out.join("");
}

/** Plain-text version for sharing, e.g. by email. */
export function stripMarkdown(source: string): string {
  return source
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(?<![*\w])\*(.+?)\*(?![*\w])/g, "$1")
    .replace(/^\s*#{1,4}\s+/gm, "");
}
