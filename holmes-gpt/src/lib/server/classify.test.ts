import { describe, expect, it } from "vitest";
import { categorize, extractTags } from "./classify";

describe("classify", () => {
  it("extracts tags", () => {
    expect(extractTags("How can prayer help my fear?")).toEqual([
      "prayer",
      "fear",
    ]);
    expect(extractTags("hello")).toEqual([]);
  });

  it("categorizes", () => {
    expect(categorize("What is the Infinite Mind?")).toBe("metaphysical");
    expect(categorize("How do I pray?")).toBe("spiritual");
    expect(categorize("zzz")).toBe("general");
  });
});
