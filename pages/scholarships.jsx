import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ExternalLink,
  Filter,
  Globe2,
  GraduationCap,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

const gradientPalette = [
  'from-[#FDE1D3] via-[#E45A84] to-[#3A1C71]',
  'from-[#D6FCF7] via-[#6EE7B7] to-[#0B7A75]',
  'from-[#FDECEF] via-[#F8BBD0] to-[#8E24AA]',
  'from-[#CFFAFE] via-[#22D3EE] to-[#0EA5E9]',
  'from-[#F2ECFF] via-[#C4B5FD] to-[#6D28D9]',
  'from-[#FFF3C4] via-[#F97316] to-[#7C2D12]',
  'from-[#E2E8F0] via-[#CBD5F5] to-[#64748B]',
  'from-[#F5E0FF] via-[#C084FC] to-[#581C87]',
];

const statusCopy = {
  'closing-soon': 'Closing soon',
  open: 'Open',
  closed: 'Closed',
};

const statusAccent = {
  'closing-soon': 'text-amber-300 border-amber-400/40 bg-amber-400/10',
  open: 'text-emerald-300 border-emerald-400/40 bg-emerald-400/10',
  closed: 'text-rose-300 border-rose-400/40 bg-rose-400/10',
};

const sortOptions = [
  { value: 'deadline-asc', label: 'Deadline · Soonest first' },
  { value: 'deadline-desc', label: 'Deadline · Latest first' },
  { value: 'status', label: 'Status · Closing soon' },
  { value: 'country-asc', label: 'Country · A to Z' },
  { value: 'name-asc', label: 'Scholarship · A to Z' },
  { value: 'coverage-desc', label: 'Coverage · Most comprehensive' },
];

function gradientForId(id) {
  const code = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradientPalette[code % gradientPalette.length];
}

function normaliseLevels(levels) {
  if (!levels || !levels.length) return [];
  return levels.map((level) => level.replace(/\b(program|programmes|programme|level|degrees?)\b/gi, '').trim()).filter(Boolean);
}

function formatDeadline(item) {
  if (item.deadlineISO) return item.deadlineLabel;
  return item.rawDeadline || 'Rolling application';
}

function createSort(sortKey) {
  const statusOrder = {
    'closing-soon': 0,
    open: 1,
    closed: 2,
  };

  return (a, b) => {
    switch (sortKey) {
      case 'deadline-asc': {
        const aTime = a.deadlineISO ? new Date(a.deadlineISO).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.deadlineISO ? new Date(b.deadlineISO).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      }
      case 'deadline-desc': {
        const aTime = a.deadlineISO ? new Date(a.deadlineISO).getTime() : 0;
        const bTime = b.deadlineISO ? new Date(b.deadlineISO).getTime() : 0;
        return bTime - aTime;
      }
      case 'status': {
        const aRank = statusOrder[a.deadlineStatus] ?? statusOrder.open;
        const bRank = statusOrder[b.deadlineStatus] ?? statusOrder.open;
        return aRank - bRank;
      }
      case 'country-asc':
        return (a.rawCountry || a.countries.join(', ')).localeCompare(b.rawCountry || b.countries.join(', '));
      case 'coverage-desc':
        return (b.coverage?.length || 0) - (a.coverage?.length || 0);
      case 'name-asc':
      default:
        return a.name.localeCompare(b.name);
    }
  };
}

function uniqueSorted(items) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function ensureCoverage(coverage, fallback) {
  if (coverage && coverage.length) return coverage;
  if (fallback) return [fallback];
  return [];
}

function shimmerClass() {
  return 'animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10';
}

export default function ScholarshipsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [sortKey, setSortKey] = useState('deadline-asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState([]);
  const [countryFilter, setCountryFilter] = useState('all');
  const [activeId, setActiveId] = useState(null);
  const [mediaMap, setMediaMap] = useState({});
  const [metadataLoading, setMetadataLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch('/api/scholarships');
        if (!response.ok) throw new Error('Unable to load scholarships');
        const payload = await response.json();
        if (!cancelled) {
          setScholarships(payload.scholarships || []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load scholarships');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!scholarships.length) return;
    let cancelled = false;

    async function loadMetadata() {
      setMetadataLoading(true);
      setMediaMap({});
      const batchSize = 6;
      for (let i = 0; i < scholarships.length; i += batchSize) {
        const slice = scholarships.slice(i, i + batchSize);
        const settled = await Promise.allSettled(
          slice.map(async (item) => {
            if (!item.link) return { id: item.id, data: null };
            const response = await fetch(`/api/scholarship-metadata?url=${encodeURIComponent(item.link)}`);
            if (!response.ok) throw new Error('metadata');
            const data = await response.json();
            return { id: item.id, data };
          }),
        );
        if (cancelled) return;
        const updates = {};
        settled.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            updates[result.value.id] = result.value.data;
          } else if (result.status === 'rejected') {
            const fallbackId = slice[index]?.id;
            if (fallbackId) updates[fallbackId] = null;
          }
        });
        if (Object.keys(updates).length) {
          setMediaMap((prev) => ({ ...prev, ...updates }));
        }
      }
      if (!cancelled) setMetadataLoading(false);
    }

    loadMetadata();
    return () => {
      cancelled = true;
    };
  }, [scholarships]);

  const allLevels = useMemo(() => uniqueSorted(scholarships.flatMap((item) => normaliseLevels(item.levels))), [scholarships]);
  const allCountries = useMemo(
    () => uniqueSorted(scholarships.flatMap((item) => (item.countries.length ? item.countries : item.rawCountry ? [item.rawCountry] : []))),
    [scholarships],
  );

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return scholarships
      .filter((item) => {
        const haystack = [item.name, item.rawCountry, item.rawLevel, item.coverageText].join(' ').toLowerCase();
        if (query && !haystack.includes(query)) return false;

        if (levelFilter.length) {
          const normalised = normaliseLevels(item.levels).map((value) => value.toLowerCase());
          const match = levelFilter.some((lvl) => normalised.includes(lvl.toLowerCase()));
          if (!match) return false;
        }

        if (countryFilter !== 'all') {
          const countries = (item.countries.length ? item.countries : [item.rawCountry]).map((value) => value.toLowerCase());
          if (!countries.some((country) => country.includes(countryFilter.toLowerCase()))) return false;
        }

        return true;
      })
      .sort(createSort(sortKey));
  }, [scholarships, searchTerm, levelFilter, countryFilter, sortKey]);

  const activeScholarship = useMemo(() => filtered.find((item) => item.id === activeId) || scholarships.find((item) => item.id === activeId), [activeId, filtered, scholarships]);
  const activeMedia = activeId ? mediaMap[activeId] : null;
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [activeId]);

  const slides = useMemo(() => {
    if (!activeMedia) return [];
    if (activeMedia.gallery && activeMedia.gallery.length) return activeMedia.gallery;
    if (activeMedia.coverImage) return [activeMedia.coverImage];
    return [];
  }, [activeMedia]);

  const toggleLevel = (level) => {
    setLevelFilter((prev) => {
      if (prev.includes(level)) return prev.filter((item) => item !== level);
      return [...prev, level];
    });
  };

  const closeOverlay = () => setActiveId(null);

  return (
    <>
      <Head>
        <title>Scholarship Atlas · Menelek Makonnen</title>
        <meta
          name="description"
          content="Explore a curated atlas of global scholarships with immersive visuals, precise filters, and luxurious interactions."
        />
      </Head>
      <div className="min-h-screen pb-24">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(60,30,110,0.45),_rgba(0,0,0,0.92))]" />
          <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.3em] text-white/70">
                  <Sparkles className="h-4 w-4" /> Scholarship Atlas
                </div>
                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
                  A luxury catalogue of world-class scholarships
                </h1>
                <p className="mt-6 text-lg text-white/70 leading-relaxed">
                  Discover postgraduate, research, and professional opportunities curated from around the globe. Dive into bespoke profiles, opulent imagery harvested directly from programme sites, and filters engineered for decisive action.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4 text-white/70 text-sm">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                    <Calendar className="h-4 w-4" /> Precision deadline sorting
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                    <Globe2 className="h-4 w-4" /> Country &amp; focus navigation
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                    <GraduationCap className="h-4 w-4" /> Level-specific views
                  </div>
                </div>
              </div>
              <div className="lg:text-right space-y-6 text-white/70">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-white/50">Total Opportunities</div>
                  <div className="mt-2 text-5xl font-semibold text-white">{filtered.length}</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-left lg:text-right backdrop-blur">
                  <div className="text-sm uppercase tracking-[0.2em] text-white/50">Metadata harvesting</div>
                  <div className="mt-2 flex items-center gap-3 text-white">
                    {metadataLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin text-white/70" />
                        <span className="text-white/70">Enriching scholarship imagery…</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5 text-emerald-300" />
                        <span className="text-white/70">Visual narratives ready</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="relative z-10 max-w-7xl mx-auto px-6 -mt-12">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 shadow-[0_24px_80px_rgba(6,8,20,0.45)]">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between">
              <div className="flex-1">
                <label className="text-xs uppercase tracking-[0.2em] text-white/50">Search</label>
                <div className="relative mt-2">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                    placeholder="Search for programme names, fields, or benefits"
                    type="search"
                  />
                </div>
              </div>
              <div className="min-w-[220px]">
                <label className="text-xs uppercase tracking-[0.2em] text-white/50">Sort by</label>
                <div className="mt-2 relative">
                  <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <select
                    value={sortKey}
                    onChange={(event) => setSortKey(event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-black/30 py-3 pl-12 pr-10 text-white focus:border-white/40 focus:outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">▾</span>
                </div>
              </div>
              <div className="min-w-[220px]">
                <label className="text-xs uppercase tracking-[0.2em] text-white/50">Country focus</label>
                <div className="mt-2 relative">
                  <Globe2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <select
                    value={countryFilter}
                    onChange={(event) => setCountryFilter(event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-black/30 py-3 pl-12 pr-10 text-white focus:border-white/40 focus:outline-none"
                  >
                    <option value="all" className="bg-slate-900 text-white">
                      All destinations
                    </option>
                    {allCountries.map((country) => (
                      <option key={country} value={country} className="bg-slate-900 text-white">
                        {country}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">▾</span>
                </div>
              </div>
            </div>

            {allLevels.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] text-white/50">Level focus</label>
                  {levelFilter.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setLevelFilter([])}
                      className="text-xs text-white/60 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {allLevels.map((level) => {
                    const active = levelFilter.includes(level);
                    return (
                      <button
                        type="button"
                        key={level}
                        onClick={() => toggleLevel(level)}
                        className={`rounded-2xl border px-4 py-2 text-sm transition ${
                          active
                            ? 'border-white bg-white/20 text-white shadow-[0_8px_24px_rgba(148,163,255,0.35)]'
                            : 'border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="relative z-10 max-w-7xl mx-auto px-6 mt-12">
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className={`aspect-[4/3] rounded-2xl ${shimmerClass()}`} />
                  <div className="mt-4 h-6 rounded-full bg-white/10" />
                  <div className="mt-3 h-4 rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-400/40 bg-rose-500/10 p-8 text-rose-100 text-lg">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-white/70">
              <p className="text-xl font-medium text-white">No scholarships match your current filters.</p>
              <p className="mt-2 text-sm text-white/60">Try adjusting your level or destination selections to reveal more opportunities.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => {
                const media = mediaMap[item.id];
                const coverage = ensureCoverage(item.coverage, item.coverageText);
                const status = statusCopy[item.deadlineStatus] || 'Open';
                const statusClass = statusAccent[item.deadlineStatus] || statusAccent.open;
                const gradient = gradientForId(item.id);
                return (
                  <motion.button
                    key={item.id}
                    layout
                    onClick={() => setActiveId(item.id)}
                    className="group text-left"
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur shadow-[0_20px_60px_rgba(8,12,32,0.45)]">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {media?.coverImage ? (
                          <img
                            src={media.coverImage}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-4 left-4 text-sm text-white/70">Awaiting artwork</div>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                          {status}
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h2 className="text-xl font-semibold text-white tracking-tight leading-tight line-clamp-2 min-h-[56px]">
                            {item.name}
                          </h2>
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
                            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusClass}`}>
                              <Calendar className="h-3.5 w-3.5" /> {formatDeadline(item)}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70">
                              <Globe2 className="h-3.5 w-3.5" />
                              {item.countries.length ? item.countries.join(', ') : item.rawCountry || 'Global'}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(normaliseLevels(item.levels).slice(0, 3) || []).map((level) => (
                            <span key={level} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70">
                              {level}
                            </span>
                          ))}
                        </div>
                        <div className="border-t border-white/10 pt-4 text-sm text-white/60 line-clamp-2 min-h-[44px]">
                          {coverage.length ? coverage.join(' • ') : 'Explore the link for a full benefits overview.'}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {activeScholarship && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeOverlay} />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              className="relative z-10 grid w-full max-w-6xl gap-10 overflow-hidden rounded-[32px] border border-white/15 bg-[#080B19]/95 p-10 backdrop-blur-xl shadow-[0_40px_120px_rgba(4,6,18,0.65)] lg:grid-cols-[1.2fr_1fr]"
            >
              <button
                type="button"
                onClick={closeOverlay}
                className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="space-y-6">
                <div className="aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-black/40 relative">
                  {slides.length > 0 ? (
                    <>
                      <motion.img
                        key={slides[slideIndex] || 'fallback'}
                        src={slides[slideIndex]}
                        alt={activeScholarship.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                      />
                      {slides.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/80 hover:text-white"
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/80 hover:text-white"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {slides.map((slide, idx) => (
                              <button
                                type="button"
                                key={slide}
                                onClick={() => setSlideIndex(idx)}
                                className={`h-2 w-8 rounded-full ${idx === slideIndex ? 'bg-white' : 'bg-white/30'}`}
                              >
                                <span className="sr-only">Slide {idx + 1}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradientForId(activeScholarship.id)}`}>
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white/70">
                        <Sparkles className="mb-4 h-10 w-10" />
                        Imagery will appear once available from the programme site.
                      </div>
                    </div>
                  )}
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 leading-relaxed">
                  <div className="text-xs uppercase tracking-[0.3em] text-white/50">Programme Insight</div>
                  <p className="mt-3 whitespace-pre-line">
                    {activeMedia?.description || 'Visit the scholarship site for an in-depth overview of this opportunity.'}
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/60">
                    Curated Opportunity
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold text-white leading-tight">{activeScholarship.name}</h2>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusAccent[activeScholarship.deadlineStatus] || statusAccent.open}`}>
                      <Calendar className="h-3.5 w-3.5" /> {formatDeadline(activeScholarship)}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70">
                      <Globe2 className="h-3.5 w-3.5" />
                      {activeScholarship.countries.length
                        ? activeScholarship.countries.join(', ')
                        : activeScholarship.rawCountry || 'Open to multiple locations'}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 text-sm text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">Academic Levels</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(() => {
                        const levels = normaliseLevels(activeScholarship.levels);
                        if (!levels.length) {
                          return <span className="text-white/60">Refer to programme site for detailed eligibility.</span>;
                        }
                        return levels.map((level) => (
                          <span key={level} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white">
                            {level}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">Coverage &amp; Benefits</div>
                    <ul className="mt-3 space-y-2">
                      {(() => {
                        const coverageItems = ensureCoverage(activeScholarship.coverage, activeScholarship.coverageText);
                        if (!coverageItems.length) {
                          return <li className="text-white/60">Coverage details are available via the provider link.</li>;
                        }
                        return coverageItems.map((entry) => (
                          <li key={entry} className="flex items-start gap-3">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                            <span>{entry}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-white">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/50">Action</div>
                  <div className="mt-3 text-sm text-white/80">
                    Review the official site to confirm eligibility criteria, deadlines, and application assets.
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={activeScholarship.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
                    >
                      Visit Scholarship Site
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      onClick={closeOverlay}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-white/70 hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
