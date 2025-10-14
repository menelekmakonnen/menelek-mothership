import { loadCharacters, SAMPLE } from "../../lib/loremaker-data";

export default async function handler(req, res) {
  try {
    const result = await loadCharacters();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(result);
  } catch (err) {
    res.status(200).json({
      data: SAMPLE,
      error: err?.message || "Failed to load characters",
    });
  }
}
