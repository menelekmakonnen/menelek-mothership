import { ensureUniqueCharacters, SAMPLE } from "./characters.js";

async function fetchCharactersFromApi({ signal } = {}) {
  try {
    const res = await fetch("/api/loremaker", { signal });
    if (!res.ok) {
      throw new Error(`Lore data request failed (${res.status})`);
    }
    const payload = await res.json();
    const safe = Array.isArray(payload?.data) ? ensureUniqueCharacters(payload.data) : ensureUniqueCharacters(SAMPLE);
    const error = payload?.error ? String(payload.error) : null;
    return { data: safe, error };
  } catch (err) {
    if (err?.name === "AbortError") {
      throw err;
    }
    const message = err?.message || "Failed to load characters";
    return { data: ensureUniqueCharacters(SAMPLE), error: message };
  }
}

export { fetchCharactersFromApi };
