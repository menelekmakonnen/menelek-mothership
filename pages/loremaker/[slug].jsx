import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { Atom, ArrowLeft, Crown, MapPin, Tag, Users } from "lucide-react";
import LoreLayout from "../../components/LoreLayout";
import { loadCharacters, toSlug } from "../../lib/loremaker-data";

function SafeImage({ src, alt, fallback }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className="h-full w-full flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/70">
        <span className="font-semibold tracking-wide">{fallback || alt}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setError(true)} className="h-full w-full object-cover rounded-2xl" />;
}

function StatPill({ label, value }) {
  if (!value) return null;
  return (
    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
      <div className="text-base font-semibold text-white mt-1">{value}</div>
    </div>
  );
}

function ChipLink({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-sm font-semibold transition"
    >
      {children}
    </Link>
  );
}

function PowerMeter({ level }) {
  const pct = Math.max(0, Math.min(10, level || 0)) * 10;
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden border border-white/15">
      <div className="h-full bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function CharacterDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [character, setCharacter] = useState(null);
  const [allCharacters, setAllCharacters] = useState([]);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    const run = async () => {
      setLoading(true);
      const { data, error: fetchError } = await loadCharacters();
      if (!mounted) return;
      setAllCharacters(data);
      if (fetchError) setError(fetchError);
      const match = data.find((c) => c.slug === slug || toSlug(c.name) === slug || toSlug(c.id) === slug);
      if (match) {
        setCharacter(match);
      } else {
        setError("Character not found");
      }
      setLoading(false);
    };
    run();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const allies = useMemo(() => {
    if (!character) return [];
    return allCharacters
      .filter((c) => c.id !== character.id && (c.faction || []).some((f) => (character.faction || []).includes(f)))
      .slice(0, 8);
  }, [allCharacters, character]);

  const pageTitle = character ? `${character.name} • Loremaker` : "Loremaker Character";

  return (
    <LoreLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="relative overflow-hidden">
        {character?.cover ? (
          <div className="absolute inset-0 -z-10">
            <img src={character.cover} alt="" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#05070d]/60 via-[#05070d]/85 to-[#05070d]" />
          </div>
        ) : (
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#141b2a] via-[#05070d] to-[#05070d]" />
        )}

        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link href="/loremaker" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold">
            <ArrowLeft className="h-4 w-4" /> Back to Lore index
          </Link>

          {loading ? (
            <div className="mt-16 text-white/70 font-semibold">Loading character…</div>
          ) : error && !character ? (
            <div className="mt-16 text-white/70 font-semibold">{error}</div>
          ) : character ? (
            <div className="mt-10 space-y-10">
              <div className="grid gap-8 lg:grid-cols-[2fr_3fr] items-start">
                <div className="relative">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-lg">
                    <SafeImage src={character.cover} alt={character.name} fallback={character.name} />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[character.cover, ...(character.gallery || [])].filter(Boolean).slice(1, 4).map((img, idx) => (
                      <div key={idx} className="h-24 border border-white/10 rounded-xl overflow-hidden">
                        <SafeImage src={img} alt={`${character.name} gallery ${idx + 1}`} fallback={character.name} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-white/60 uppercase tracking-[0.35em] text-xs">Loremaker Character Profile</div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-3 text-white drop-shadow-[0_6px_25px_rgba(9,12,22,0.35)]">
                      {character.name}
                    </h1>
                    {(character.alias || []).length > 0 && (
                      <div className="text-white/70 font-medium mt-2">Also known as {(character.alias || []).join(", ")}</div>
                    )}
                  </div>

                  <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                    {character.longDesc || character.shortDesc || "No biography available yet."}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <StatPill label="Gender" value={character.gender} />
                    <StatPill label="Alignment" value={character.alignment} />
                    <StatPill label="Status" value={character.status} />
                    <StatPill label="Era" value={character.era} />
                    <StatPill label="First Appearance" value={character.firstAppearance} />
                  </div>

                  {character.locations?.length ? (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/80 uppercase tracking-wide">
                        <MapPin className="h-4 w-4" /> Locations
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {character.locations.map((loc) => (
                          <span key={loc} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-semibold">
                            {loc}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {character.faction?.length ? (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/80 uppercase tracking-wide">
                        <Crown className="h-4 w-4" /> Factions
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {character.faction.map((f) => (
                          <ChipLink key={f} href={`/loremaker/factions/${toSlug(f)}`}>
                            {f}
                          </ChipLink>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {character.tags?.length ? (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white/80 uppercase tracking-wide">
                        <Tag className="h-4 w-4" /> Tags
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {character.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/80 uppercase tracking-wide mb-4">
                    <Atom className="h-4 w-4" /> Powers & Levels
                  </div>
                  <div className="space-y-4">
                    {(character.powers || []).map((power) => (
                      <div key={power.name}>
                        <div className="flex items-center justify-between text-sm font-semibold text-white">
                          <Link href={`/loremaker/powers/${toSlug(power.name)}`} className="hover:text-amber-200 transition">
                            {power.name}
                          </Link>
                          <span>{power.level}/10</span>
                        </div>
                        <PowerMeter level={power.level} />
                      </div>
                    ))}
                    {!character.powers?.length && <div className="text-white/60 text-sm">No documented powers yet.</div>}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/80 uppercase tracking-wide mb-4">
                    <Users className="h-4 w-4" /> Alliances
                  </div>
                  {allies.length ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {allies.map((ally) => (
                        <Link key={ally.id} href={`/loremaker/${ally.slug}`} className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/30 transition">
                          <div className="font-semibold text-white group-hover:text-amber-200 transition">{ally.name}</div>
                          <div className="text-xs text-white/60">{ally.faction?.[0] || "—"}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white/60 text-sm">No recorded allies.</div>
                  )}
                </div>
              </div>

              {character.stories?.length ? (
                <div>
                  <div className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">Stories & Appearances</div>
                  <div className="flex flex-wrap gap-2">
                    {character.stories.map((story) => (
                      <span key={story} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-semibold">
                        {story}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </LoreLayout>
  );
}
