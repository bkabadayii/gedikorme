import { describe, expect, it } from "vitest";
import { addId, parseIds, removeId } from "./storage";

describe("inquiry storage helpers", () => {
  it("parses defensively", () => {
    expect(parseIds(null)).toEqual([]);
    expect(parseIds("not json")).toEqual([]);
    expect(parseIds('{"a":1}')).toEqual([]);
    expect(parseIds('["a",2,"a","b",null]')).toEqual(["a", "b"]);
  });

  it("adds without duplicates and removes", () => {
    expect(addId(["a"], "a")).toEqual(["a"]);
    expect(addId(["a"], "b")).toEqual(["a", "b"]);
    expect(removeId(["a", "b"], "a")).toEqual(["b"]);
  });

  it("caps the list", () => {
    const many = Array.from({ length: 60 }, (_, i) => `f${i}`);
    expect(parseIds(JSON.stringify(many))).toHaveLength(50);
    expect(addId(many.slice(0, 50), "new")).toHaveLength(50);
  });
});
