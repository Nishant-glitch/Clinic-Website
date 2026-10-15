import test from "node:test";
import assert from "node:assert/strict";

test("URL serialization comparison prevents duplicate history updates", () => {
  let replaceStateCalls = 0;

  function updateQuery(currentSearch, key, value) {
    const currentParams = new URLSearchParams(currentSearch);
    const currentSerialized = currentParams.toString();

    const newParams = new URLSearchParams(currentSearch);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    if (key === "q") {
      newParams.delete("search");
      newParams.delete("ref");
    }

    if (key !== "page") {
      newParams.delete("page");
    }

    const newSerialized = newParams.toString();
    if (newSerialized === currentSerialized) {
      return null; // Skipped, no-op
    }

    replaceStateCalls++;
    return newSerialized;
  }

  // 1. Initial query is ?q=APT-261015-80SG. Calling updateQuery with same q should NOT call replaceState
  const res1 = updateQuery("?q=APT-261015-80SG", "q", "APT-261015-80SG");
  assert.equal(res1, null, "Identical query must be a no-op");
  assert.equal(replaceStateCalls, 0, "replaceState should not be called when serialized string matches");

  // 2. Calling with different query triggers update
  const res2 = updateQuery("?q=APT-261015-80SG", "q", "APT-999");
  assert.equal(res2, "q=APT-999");
  assert.equal(replaceStateCalls, 1);

  // 3. Changing status resets page and updates query
  const res3 = updateQuery("?q=APT-999&page=3", "status", "called");
  assert.equal(res3, "q=APT-999&status=called");
  assert.equal(replaceStateCalls, 2);
});

test("?ref= to ?q= conversion converts once and cleans ref", () => {
  function handleRefParam(searchString) {
    const currentParams = new URLSearchParams(searchString);
    const refParam = currentParams.get("ref");
    if (!refParam) return null;

    const newParams = new URLSearchParams(searchString);
    newParams.set("q", refParam);
    newParams.delete("ref");
    newParams.delete("search");
    newParams.delete("page");
    return newParams.toString();
  }

  const converted = handleRefParam("?ref=APT-261015-80SG&page=2");
  assert.equal(converted, "q=APT-261015-80SG");
});
