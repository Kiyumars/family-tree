import { expect, test } from "vitest";
import { createFamilyTree } from "./actions";

test("Test functions that import server-only", () => {
  expect(createFamilyTree()).toBe('testing');
});