import { describe, expect, it } from "vitest";
import { eventType } from "../src/index.ts";

describe("event-type", () => {
  it("builds a versioned event type - github", () => {
    expect(eventType("github", "push", 1)).toBe(
      "dev.motherbase.github.push.v1",
    );
  });

  it("keeps two digit versions", () => {
    expect(eventType("github", "push", 10)).toBe(
      "dev.motherbase.github.push.v10",
    );
  });
});
