import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

const sortOptions = [
  { value: 'deadline-asc', label: 'Deadline · Soonest first' },
  { value: 'deadline-desc', label: 'Deadline · Latest first' },
  { value: 'status', label: 'Status · Closing soon' },
  { value: 'country-asc', label: 'Country · A to Z' },
  { value: 'name-asc', label: 'Scholarship · A to Z' },
  { value: 'coverage-desc', label: 'Coverage · Most comprehensive' },
];

const statusCopy = {
  'closing-soon': 'Closing soon',
  open: 'Open now',
  closed: 'Closed',
};

const statusAccent = {
  'closing-soon': 'border-amber-400/40 bg-amber-500/15 text-amber-200',
  open: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200',
  closed: 'border-rose-400/40 bg-rose-500/15 text-rose-200',
};

function normaliseLevels(levels) {
  if (!levels || !levels.length) return [];
  return levels
    .map((level) =>
      level
        .replace(/\b(program|programmes|programme|level|degrees?)\b/gi, '')
        .replace(/[()]/g, '')
        .trim(),
    )
    .filter(Boolean);
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

function computeCountdown(deadlineISO, nowMs) {
  if (!deadlineISO) {
    return { mode: 'rolling', expired: false, parts: null };
  }
  const target = new Date(deadlineISO).getTime();
  if (Number.isNaN(target)) {
    return { mode: 'unknown', expired: false, parts: null };
  }
  const diff = target - nowMs;
  if (diff <= 0) {
    return { mode: 'expired', expired: true, parts: null };
  }
  const dayMs = 1000 * 60 * 60 * 24;
  const hourMs = 1000 * 60 * 60;
  const minuteMs = 1000 * 60;
  const secondMs = 1000;
  const days = Math.floor(diff / dayMs);
  const hours = Math.floor((diff % dayMs) / hourMs);
  const minutes = Math.floor((diff % hourMs) / minuteMs);
  const seconds = Math.floor((diff % minuteMs) / secondMs);
  return { mode: 'countdown', expired: false, parts: { days, hours, minutes, seconds } };
}

function useBodyScrollLock(active) {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const original = document.body.style.overflow;
    if (active) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

function screenshotUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return `https://image.thum.io/get/width/1200/crop/800/${encodeURIComponent(parsed.toString())}`;
  } catch (error) {
    return null;
  }
}

function ScholarshipCard({ item, media, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const displayImage = media?.coverImage || screenshotUrl(item.link);
  const coverage = ensureCoverage(item.coverage, item.coverageText);
  const levels = normaliseLevels(item.levels).slice(0, 3);
  const statusClass = statusAccent[item.deadlineStatus] || statusAccent.open;

  useEffect(() => {
    setImageLoaded(false);
  }, [displayImage]);

  return (
    <motion.button
      type="button"
      onClick={() => onClick(item.id)}
      layout
      className="group relative flex flex-col overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-fuchsia-500/5 to-indigo-500/10 backdrop-blur-xl shadow-[0_18px_60px_rgba(5,7,19,0.55)]"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
    >
      <div className="relative aspect-square overflow-hidden">
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt={item.name}
              className={`h-full w-full object-cover transition duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-slate-800/40" />}
          </>
        ) : (
          <div className="absolute inset-0 animate-pulse bg-slate-800/40" />
        )}
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/55 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-white/80 backdrop-blur">
          {statusCopy[item.deadlineStatus] || 'Open now'}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-4">
        <div>
          <h2 className="text-base font-semibold leading-snug tracking-tight text-white line-clamp-2 min-h-[3.2rem] sm:text-lg">
            {item.name}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2 text-[0.7rem] text-white/70 sm:text-xs">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${statusClass}`}>
              <Calendar className="h-3.5 w-3.5" />
              {formatDeadline(item)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
              <Globe2 className="h-3.5 w-3.5" />
              {item.countries.length ? item.countries.join(', ') : item.rawCountry || 'Global'}
            </span>
          </div>
        </div>
        {levels.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[0.65rem] text-white/70 sm:text-xs">
            {levels.map((level) => (
              <span key={level} className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                {level}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto text-[0.75rem] leading-relaxed text-white/65 line-clamp-2 min-h-[2.5rem]">
          {coverage.length ? coverage.join(' • ') : 'Discover the full benefits on the official portal.'}
        </div>
      </div>
    </motion.button>
  );
}

function FeaturedOpportunity({ scholarship, media, onExplore }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const displayImage = scholarship ? media?.coverImage || screenshotUrl(scholarship.link) : null;

  useEffect(() => {
    setImageLoaded(false);
  }, [displayImage, scholarship?.id]);

  if (!scholarship) {
    return (
      <div className="h-[420px] w-full animate-pulse rounded-[40px] border border-white/10 bg-white/10 sm:h-[480px]" />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/15 bg-white/10 shadow-[0_40px_120px_rgba(5,7,19,0.65)]">
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt={scholarship.name}
              className={`h-full w-full object-cover transition duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-slate-800/40" />}
          </>
        ) : (
          <div className="absolute inset-0 animate-pulse bg-slate-800/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-white/70">Featured this visit</div>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
            {scholarship.name}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm text-white/75">
            {media?.shortDescription || 'A remarkable opportunity curated for ambitious scholars. Dive in to explore the full story.'}
          </p>
          <button
            type="button"
            onClick={() => onExplore(scholarship.id)}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Explore profile
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  open,
  onClose,
  sortKey,
  setSortKey,
  countryFilter,
  setCountryFilter,
  allCountries,
  allLevels,
  levelFilter,
  toggleLevel,
  clearLevels,
  includeClosed,
  setIncludeClosed,
  resetFilters,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', stiffness: 210, damping: 24 }}
            className="relative ml-auto flex h-full w-[66vw] max-w-[420px] flex-col overflow-hidden bg-[#050713]/95 backdrop-blur-xl sm:w-2/3 sm:max-w-none lg:w-[min(720px,66vw)]"
          >
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-6">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/60">Tailor your view</div>
                <h2 className="mt-3 text-2xl font-semibold text-white">Filter opportunities</h2>
                <p className="mt-2 text-sm text-white/60">
                  Refine by destination, level, or timing. Close the panel to see your curated showcase.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-8">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-white/60">Sort order</div>
                  <div className="mt-4 space-y-3">
                    {sortOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                          sortKey === option.value
                            ? 'border-white bg-white/10 text-white'
                            : 'border-white/10 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <span>{option.label}</span>
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortKey === option.value}
                          onChange={() => setSortKey(option.value)}
                          className="accent-white"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-white/60">Destination focus</div>
                  <div className="mt-4">
                    <select
                      value={countryFilter}
                      onChange={(event) => setCountryFilter(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-white/40 focus:outline-none"
                    >
                      <option value="all">All destinations</option>
                      {allCountries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-[0.3em] text-white/60">Academic level</div>
                    {levelFilter.length > 0 && (
                      <button
                        type="button"
                        onClick={clearLevels}
                        className="text-xs text-white/60 hover:text-white"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {allLevels.map((level) => {
                      const active = levelFilter.includes(level);
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => toggleLevel(level)}
                          className={`rounded-full border px-4 py-2 text-sm transition ${
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

                <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/70">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-white/60">Expired deadlines</div>
                      <p className="mt-2 text-white/60">
                        Include scholarships whose deadlines have passed for research or planning purposes.
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={includeClosed}
                        onChange={() => setIncludeClosed((prev) => !prev)}
                      />
                      <span className="h-6 w-11 rounded-full bg-white/20 transition peer-checked:bg-emerald-400/70" />
                      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#080b18]/95 px-6 py-5">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/70 hover:text-white"
              >
                Reset filters
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full border border-white bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
              >
                View results
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ScholarshipsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [sortKey, setSortKey] = useState('deadline-asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState([]);
  const [countryFilter, setCountryFilter] = useState('all');
  const [includeClosed, setIncludeClosed] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [mediaMap, setMediaMap] = useState({});
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [featuredId, setFeaturedId] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const overlayHistoryRef = useRef(false);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

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
      const batchSize = 5;
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

  useEffect(() => {
    if (!scholarships.length) return;
    const open = scholarships.filter((item) => item.deadlineStatus !== 'closed');
    const pool = open.length ? open : scholarships;
    const selection = pool[Math.floor(Math.random() * pool.length)];
    setFeaturedId(selection?.id || null);
  }, [scholarships]);

  useEffect(() => {
    setSlideIndex(0);
  }, [activeId]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handlePopState = (event) => {
      if (overlayHistoryRef.current || event.state?.scholarshipOverlay) {
        overlayHistoryRef.current = false;
        setActiveId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useBodyScrollLock(Boolean(activeId) || filtersOpen);

  useEffect(() => {
    if (!activeId) {
      overlayHistoryRef.current = false;
    }
  }, [activeId]);

  const allLevels = useMemo(
    () => uniqueSorted(scholarships.flatMap((item) => normaliseLevels(item.levels))),
    [scholarships],
  );

  const allCountries = useMemo(
    () =>
      uniqueSorted(
        scholarships.flatMap((item) => {
          if (item.countries.length) return item.countries;
          if (item.rawCountry) return [item.rawCountry];
          return [];
        }),
      ),
    [scholarships],
  );

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return scholarships
      .filter((item) => {
        if (!includeClosed && item.deadlineStatus === 'closed') return false;
        const haystack = [item.name, item.rawCountry, item.rawLevel, item.coverageText].join(' ').toLowerCase();
        if (query && !haystack.includes(query)) return false;

        if (levelFilter.length) {
          const normalised = normaliseLevels(item.levels).map((value) => value.toLowerCase());
          const match = levelFilter.some((lvl) => normalised.includes(lvl.toLowerCase()));
          if (!match) return false;
        }

        if (countryFilter !== 'all') {
          const countries = (item.countries.length ? item.countries : [item.rawCountry])
            .filter(Boolean)
            .map((value) => value.toLowerCase());
          if (!countries.some((country) => country.includes(countryFilter.toLowerCase()))) return false;
        }

        return true;
      })
      .sort(createSort(sortKey));
  }, [scholarships, searchTerm, levelFilter, countryFilter, sortKey, includeClosed]);

  const activeScholarship = useMemo(
    () => filtered.find((item) => item.id === activeId) || scholarships.find((item) => item.id === activeId),
    [activeId, filtered, scholarships],
  );

  const activeMedia = activeId ? mediaMap[activeId] : null;
  const fallbackActiveImage = activeScholarship?.link ? screenshotUrl(activeScholarship.link) : null;
  const slides = useMemo(() => {
    if (!activeScholarship) return [];
    if (activeMedia?.gallery?.length) return activeMedia.gallery;
    if (activeMedia?.coverImage) return [activeMedia.coverImage];
    if (fallbackActiveImage) return [fallbackActiveImage];
    return [];
  }, [activeScholarship, activeMedia, fallbackActiveImage]);

  const countdown = useMemo(
    () => (activeScholarship ? computeCountdown(activeScholarship.deadlineISO, now) : { mode: 'unknown', expired: false, parts: null }),
    [activeScholarship, now],
  );

  const featuredScholarship = featuredId ? scholarships.find((item) => item.id === featuredId) : null;
  const featuredMedia = featuredId ? mediaMap[featuredId] : null;

  const openCount = useMemo(
    () => scholarships.filter((item) => item.deadlineStatus !== 'closed').length,
    [scholarships],
  );

  const totalCount = scholarships.length;
  const closedCount = totalCount - openCount;

  const filterCount = (countryFilter !== 'all' ? 1 : 0) + levelFilter.length + (includeClosed ? 1 : 0);

  const toggleLevel = (level) => {
    setLevelFilter((prev) => {
      if (prev.includes(level)) return prev.filter((item) => item !== level);
      return [...prev, level];
    });
  };

  const resetFilters = () => {
    setLevelFilter([]);
    setCountryFilter('all');
    setIncludeClosed(false);
  };

  const openScholarship = useCallback(
    (id) => {
      if (!id) return;
      if (typeof window !== 'undefined') {
        const currentState = window.history.state || {};
        window.history.pushState({ ...currentState, scholarshipOverlay: id }, '', window.location.href);
        overlayHistoryRef.current = true;
      }
      setActiveId(id);
    },
    [],
  );

  const closeOverlay = useCallback(() => {
    if (typeof window !== 'undefined' && overlayHistoryRef.current) {
      window.history.back();
    } else {
      setActiveId(null);
    }
  }, []);

  const nextSlide = () => {
    if (slides.length <= 1) return;
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
      <Head>
        <title>Scholarship Atelier · Menelek Makonnen</title>
        <meta
          name="description"
          content="Browse a luxurious Instagram-inspired gallery of global scholarships with live imagery, elegant filters, and immersive programme profiles."
        />
      </Head>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(48,16,107,0.55),_rgba(3,3,11,0.95))] pb-24 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(6,8,30,0.95),rgba(10,8,40,0.8))]" />
          <div className="pointer-events-none absolute -left-24 top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.28),_transparent_65%)] blur-3xl" />
          <div className="pointer-events-none absolute right-[-10%] top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(94,234,212,0.2),_transparent_60%)] blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/70">
                  <Sparkles className="h-4 w-4" /> Scholarship Atelier
                </div>
                <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  A vibrant gallery of world-class scholarships
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
                  Explore prestigious fellowships, research grants, and graduate opportunities presented in rich colour and motion.
                  Each profile is sourced from official portals with artful imagery, intuitive filters, and timely insights for decisive applicants.
                </p>
                <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/70 sm:text-base">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-white/50">Open opportunities</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{openCount}</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-white/50">Total curated</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{totalCount}</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-white/50">Archived deadlines</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{closedCount}</div>
                  </div>
                </div>
                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-gradient-to-r from-fuchsia-500/20 via-purple-500/10 to-sky-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
                  {metadataLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Fetching live imagery
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 text-emerald-300" />
                      Gallery imagery synced
                    </>
                  )}
                </div>
              </div>
              <FeaturedOpportunity scholarship={featuredScholarship} media={featuredMedia} onExplore={openScholarship} />
            </div>
          </div>
        </section>

        <section className="relative mx-auto -mt-12 max-w-7xl px-4 sm:px-6">
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  type="search"
                  placeholder="Search scholarships, regions, or benefits"
                  className="w-full rounded-full border border-white/10 bg-black/40 py-3 pl-12 pr-5 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none sm:text-base"
                />
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 self-end rounded-full border border-white bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20 sm:self-auto"
              >
                <Filter className="h-4 w-4" /> Filters
                {filterCount > 0 && (
                  <span className="ml-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white/90 px-2 text-xs font-semibold text-slate-900">
                    {filterCount}
                  </span>
                )}
              </button>
            </div>
            <div className="mt-4 text-sm text-white/60">
              Showing <span className="text-white">{filtered.length}</span> refined opportunities
              {includeClosed ? ' · including archived deadlines' : ' · open and closing soon only'}.
            </div>
          </div>
        </section>

        <section className="relative mx-auto mt-14 max-w-7xl px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-full rounded-[32px] border border-white/10 bg-white/5 p-4">
                  <div className="aspect-square rounded-3xl bg-white/10" />
                  <div className="mt-4 h-5 rounded-full bg-white/10" />
                  <div className="mt-3 h-4 rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-400/40 bg-rose-500/10 p-8 text-lg text-rose-100">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-white/70">
              <p className="text-xl font-medium text-white">No scholarships match your current filters.</p>
              <p className="mt-3 text-sm text-white/60">Adjust your levels, destination, or include archived deadlines to widen the view.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {filtered.map((item) => (
                <ScholarshipCard key={item.id} item={item} media={mediaMap[item.id]} onClick={openScholarship} />
              ))}
            </div>
          )}
        </section>
      </div>

      <FilterPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sortKey={sortKey}
        setSortKey={setSortKey}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        allCountries={allCountries}
        allLevels={allLevels}
        levelFilter={levelFilter}
        toggleLevel={toggleLevel}
        clearLevels={() => setLevelFilter([])}
        includeClosed={includeClosed}
        setIncludeClosed={setIncludeClosed}
        resetFilters={resetFilters}
      />

      <AnimatePresence>
        {activeScholarship && (
          <motion.div className="fixed inset-0 z-50 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="fixed inset-0 bg-black/70" onClick={closeOverlay} />
            <div className="relative flex min-h-full items-center justify-center px-4 py-10 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-8 overflow-hidden rounded-[36px] border border-white/15 bg-[#050713]/95 p-6 text-white shadow-[0_40px_120px_rgba(4,6,18,0.65)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-10 lg:max-h-[92vh]"
              >
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:scale-105 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="flex flex-col gap-6 overflow-y-auto pr-1 lg:pr-0">
                  <div className="relative overflow-hidden rounded-3xl border border-white/10">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {slides.length > 0 ? (
                      <>
                        <img
                          key={slides[slideIndex]}
                          src={slides[slideIndex]}
                          alt={activeScholarship.name}
                          className="h-full w-full object-cover"
                        />
                        {slides.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={prevSlide}
                              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white transition hover:bg-black/70"
                            >
                              <ArrowLeft className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={nextSlide}
                              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white transition hover:bg-black/70"
                            >
                              <ArrowRight className="h-5 w-5" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                              {slides.map((slide, idx) => (
                                <button
                                  key={slide}
                                  type="button"
                                  onClick={() => setSlideIndex(idx)}
                                  className={`h-2.5 w-8 rounded-full transition ${idx === slideIndex ? 'bg-white' : 'bg-white/40'}`}
                                >
                                  <span className="sr-only">Slide {idx + 1}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-sm text-white/60">
                        Imagery will appear when available from the programme site.
                      </div>
                    )}
                  </div>
                  <div className="border-t border-white/10 bg-black/40 p-5 text-sm text-white/70">
                    {activeMedia?.shortDescription || 'Visit the provider site for a succinct overview of this opportunity.'}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 text-sm leading-relaxed text-white/70">
                  <div className="text-xs uppercase tracking-[0.3em] text-white/60">Programme Insight</div>
                  <p className="mt-3 whitespace-pre-line">
                    {activeMedia?.longDescription || activeMedia?.shortDescription || 'Explore the official scholarship page to capture detailed eligibility, coverage, and application notes.'}
                  </p>
                  </div>
                </div>
                <div className="flex flex-col gap-6 overflow-y-auto pr-1 lg:pr-0">
                  <div className="flex flex-col gap-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/60">
                      Curated Opportunity
                    </div>
                    <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                      {activeScholarship.name}
                    </h2>
                    <a
                      href={activeScholarship.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-fuchsia-400 via-rose-300 to-amber-200 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_20px_45px_rgba(249,168,212,0.35)] transition hover:from-fuchsia-300 hover:via-rose-200 hover:to-amber-100 sm:w-auto"
                    >
                      Visit Scholarship Site
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
                      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                        statusAccent[activeScholarship.deadlineStatus] || statusAccent.open
                    }`}>
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDeadline(activeScholarship)}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70">
                      <Globe2 className="h-3.5 w-3.5" />
                      {activeScholarship.countries.length
                        ? activeScholarship.countries.join(', ')
                        : activeScholarship.rawCountry || 'Open to multiple locations'}
                    </span>
                  </div>
                    <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 text-sm text-white/80">
                      <div className="text-xs uppercase tracking-[0.3em] text-white/60">Countdown to deadline</div>
                      {countdown.mode === 'countdown' && countdown.parts ? (
                        <div className="mt-4 grid grid-cols-4 gap-3 text-center text-white">
                        {Object.entries(countdown.parts).map(([unit, value]) => (
                          <div key={unit} className="rounded-2xl border border-white/15 bg-black/30 px-3 py-3">
                            <div className="text-2xl font-semibold">{String(value).padStart(2, '0')}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.3em] text-white/60">{unit}</div>
                          </div>
                        ))}
                      </div>
                    ) : countdown.mode === 'expired' ? (
                      <div className="mt-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        This deadline has passed. Explore archived details for planning future cycles.
                      </div>
                    ) : (
                      <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/70">
                        Rolling or unspecified deadline — confirm exact timings via the provider link.
                      </div>
                    )}
                    </div>
                  </div>
                  <div className="grid gap-3 text-sm text-white/70">
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-transparent to-sky-500/20 p-4">
                      <div className="text-xs uppercase tracking-[0.3em] text-white/60">Academic Levels</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(() => {
                        const levels = normaliseLevels(activeScholarship.levels);
                        if (!levels.length) {
                          return <span className="text-white/60">Refer to the programme site for detailed eligibility.</span>;
                        }
                        return levels.map((level) => (
                          <span key={level} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white">
                            {level}
                          </span>
                        ));
                      })()}
                    </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/20 p-4">
                      <div className="text-xs uppercase tracking-[0.3em] text-white/60">Coverage &amp; Benefits</div>
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
                    <div className="text-xs uppercase tracking-[0.3em] text-white/60">Action</div>
                    <div className="mt-3 text-sm text-white/80">
                      Review the official site to confirm eligibility criteria, deadlines, and submission requirements.
                    </div>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={closeOverlay}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-white/70 transition hover:border-white/40 hover:text-white sm:w-auto"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
