import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import LoreLayout from "../../../components/LoreLayout";
import { fetchCharactersFromApi, SAMPLE, toSlug } from "../../../lib/loremaker-data";

function hueFromString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash << 5) - hash + text.charCodeAt(i);
  return Math.abs(hash) % 360;
}

function CharacterSummary({ character }) {
  return (
    <Link
      href={`/loremaker/${character.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-white/30 transition"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white group-hover:text-amber-200 transition">{character.name}</div>
          <div className="text-xs text-white/60">{character.alias?.[0] || character.era || "Unknown"}</div>
        </div>
        <div className="text-sm font-semibold text-white/70">{character.status || "—"}</div>
      </div>
      <p className="text-sm text-white/70 line-clamp-3">{character.shortDesc || character.longDesc || "No summary yet."}</p>
      <div className="flex flex-wrap gap-2 text-xs text-white/60">
        {(character.locations || []).slice(0, 3).map((loc) => (
          <span key={loc} className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
            {loc}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default function FactionDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const filterMembers = (list) => list.filter((c) => (c.faction || []).some((f) => toSlug(f) === slug));
    fetchCharactersFromApi({ signal: controller.signal })
      .then(({ data, error: fetchError }) => {
        if (controller.signal.aborted) return;
        if (fetchError) setError(fetchError);
        const filtered = filterMembers(data);
        if (!filtered.length) {
          setError("Faction not found");
        }
        setMembers(filtered);
      })
      .catch((err) => {
        if (err?.name === "AbortError" || controller.signal.aborted) return;
        console.error("Failed to load faction detail", err);
        const fallback = filterMembers(SAMPLE);
        setMembers(fallback);
        if (!fallback.length) {
          setError(err?.message || "Failed to load characters");
        } else {
          setError(err?.message || "Showing fallback roster");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [slug]);

  const factionName = members[0]?.faction?.find((f) => toSlug(f) === slug) || (slug ? slug.replace(/-/g, " ") : "Faction");
  const hue = useMemo(() => hueFromString(factionName), [factionName]);
  const gradient = `linear-gradient(135deg, hsla(${hue},70%,55%,0.15), hsla(${(hue + 60) % 360},70%,55%,0.18))`;

  const locations = useMemo(() => {
    const set = new Set();
    members.forEach((m) => (m.locations || []).forEach((loc) => set.add(loc)));
    return Array.from(set);
  }, [members]);

  return (
    <LoreLayout>
      <Head>
        <title>{factionName} • Loremaker Faction</title>
      </Head>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: gradient }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#05070d]/70 via-[#05070d]/85 to-[#05070d]" />

        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link href="/loremaker" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold">
            <ArrowLeft className="h-4 w-4" /> Back to Lore index
          </Link>

          {loading ? (
            <div className="mt-16 text-white/70 font-semibold">Loading faction…</div>
          ) : error && !members.length ? (
            <div className="mt-16 text-white/70 font-semibold">{error}</div>
          ) : (
            <div className="mt-10 space-y-10">
              <div className="max-w-3xl space-y-4">
                <div className="text-white/60 uppercase tracking-[0.35em] text-xs">Lore Faction</div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_6px_25px_rgba(9,12,22,0.35)]">
                  {factionName}
                </h1>
                <p className="text-white/75 text-lg">
                  {members.length} member{members.length === 1 ? "" : "s"} recorded • Presence across {locations.length || "unknown"} locations.
                </p>
                {locations.length ? (
                  <div className="flex flex-wrap gap-2 text-sm text-white/70">
                    {locations.map((loc) => (
                      <span key={loc} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15">
                        {loc}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {members.map((member) => (
                  <CharacterSummary key={member.id} character={member} />
                ))}
                {!members.length && <div className="text-white/60">No characters assigned to this faction yet.</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </LoreLayout>
  );
}
