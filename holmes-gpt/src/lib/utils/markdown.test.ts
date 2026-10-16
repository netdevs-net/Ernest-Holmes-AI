import { describe, expect, it } from "vitest";
import { escapeHtml, renderMarkdown, stripMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("renders bold and italic", () => {
    expect(renderMarkdown("**Principle** is *always* present")).toBe(
      "<p><strong>Principle</strong> is <em>always</em> present</p>",
    );
  });

  it("escapes HTML so model or user text cannot inject markup", () => {
    const out = renderMarkdown('<img src=x onerror="alert(1)"> **hi**');
    expect(out).not.toContain("<img");
    expect(out).toContain("&lt;img");
    expect(out).toContain("<strong>hi</strong>");
  });

  it("groups bullet and numbered lines into lists", () => {
    expect(renderMarkdown("• one\n- two\n* three")).toBe(
      "<ul><li>one</li><li>two</li><li>three</li></ul>",
    );
    expect(renderMarkdown("1. first\n2) second")).toBe(
      "<ol><li>first</li><li>second</li></ol>",
    );
  });

  it("does not treat **bold** at line start as a bullet", () => {
    expect(renderMarkdown("**Opening** words")).toBe(
      "<p><strong>Opening</strong> words</p>",
    );
  });

  it("splits paragraphs on blank lines and single newlines", () => {
    expect(renderMarkdown("a\n\nb")).toBe("<p>a</p><p>b</p>");
    expect(renderMarkdown("a\nb")).toBe("<p>a</p><p>b</p>");
  });

  it("leaves an unfinished marker literal while streaming", () => {
    expect(renderMarkdown("**Bold so f")).toBe("<p>**Bold so f</p>");
  });

  it("renders headings", () => {
    expect(renderMarkdown("## Title")).toBe("<h3>Title</h3>");
  });

  it("does not turn a lone asterisk or snake_case into emphasis", () => {
    expect(renderMarkdown("2 * 3 * 4")).toBe("<p>2 * 3 * 4</p>");
  });
});

describe("stripMarkdown / escapeHtml", () => {
  it("removes markers for plain-text sharing", () => {
    expect(stripMarkdown("**Bold** and *soft*\n## Head")).toBe(
      "Bold and soft\nHead",
    );
  });

  it("escapes all five special characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;",
    );
  });
});
