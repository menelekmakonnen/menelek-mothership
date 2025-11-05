import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  GraduationCap,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Globe,
} from "lucide-react";

/**
 * Menelek Makonnen — Scholarship Gallery
 * A luxurious, fluid interface for exploring global scholarship opportunities
 */

// Placeholder data - will be replaced with real spreadsheet data
const PLACEHOLDER_SCHOLARSHIPS = [
  {
    id: "1",
    name: "Rhodes Scholarship",
    country: "United Kingdom",
    level: "Masters, PhD",
    coverage: "Full tuition, living expenses, travel costs",
    deadline: "2024-10-01",
    link: "https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/",
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    ],
  },
  {
    id: "2",
    name: "Fulbright Scholarship",
    country: "United States",
    level: "Masters, PhD, Research",
    coverage: "Full tuition, monthly stipend, health insurance",
    deadline: "2024-09-15",
    link: "https://foreign.fulbrightonline.org/",
    images: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
    ],
  },
  {
    id: "3",
    name: "DAAD Scholarship",
    country: "Germany",
    level: "Masters, PhD, Postdoc",
    coverage: "€934/month, travel allowance, health insurance",
    deadline: "2024-11-30",
    link: "https://www.daad.de/en/",
    images: [
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800",
    ],
  },
];

// Parse level string to array (handles /, comma separation)
function parseLevels(levelStr) {
  if (!levelStr) return [];
  return levelStr
    .split(/[,/]/)
    .map((l) => l.trim())
    .filter(Boolean);
}

// Parse countries (handles multiple countries)
function parseCountries(countryStr) {
  if (!countryStr) return [];
  return countryStr
    .split(/[,/]/)
    .map((c) => c.trim())
    .filter(Boolean);
}

// Format date for display
function formatDate(dateStr) {
  if (!dateStr) return "Rolling";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Scholarship Card Component
function ScholarshipCard({ scholarship, onClick }) {
  const levels = parseLevels(scholarship.level);
  const countries = parseCountries(scholarship.country);
  const primaryImage =
    scholarship.images?.[0] ||
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-xl border border-white/10 transition-all duration-500 hover:border-white/30 hover:shadow-2xl hover:shadow-blue-500/20"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <motion.img
          src={primaryImage}
          alt={scholarship.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80" />

        {/* Deadline Badge */}
        {scholarship.deadline && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white border border-white/20">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(scholarship.deadline)}
          </div>
        )}

        {/* Level Badges */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {levels.slice(0, 3).map((level, idx) => (
            <span
              key={idx}
              className="rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/20"
            >
              {level}
            </span>
          ))}
          {levels.length > 3 && (
            <span className="rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/20">
              +{levels.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
          {scholarship.name}
        </h3>

        {/* Country */}
        <div className="flex items-start gap-2 text-sm text-gray-300">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
          <span className="line-clamp-1">{countries.join(", ")}</span>
        </div>

        {/* Coverage */}
        <div className="flex items-start gap-2 text-sm text-gray-300">
          <DollarSign className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-400" />
          <span className="line-clamp-2">{scholarship.coverage}</span>
        </div>

        {/* Hover Indicator */}
        <div className="flex items-center gap-2 text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View Details</span>
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}

// Scholarship Detail Modal
function ScholarshipModal({ scholarship, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const levels = parseLevels(scholarship.level);
  const countries = parseCountries(scholarship.country);
  const images = scholarship.images || [];

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl my-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image Slider */}
        {images.length > 0 && (
          <div className="relative aspect-[21/9] bg-gradient-to-br from-blue-900/20 to-purple-900/20 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={scholarship.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "w-8 bg-white"
                          : "w-2 bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Title */}
          <h2 className="text-3xl font-bold text-white">{scholarship.name}</h2>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Countries */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <MapPin className="h-4 w-4" />
                Countries
              </div>
              <div className="flex flex-wrap gap-2">
                {countries.map((country, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-300"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            {/* Levels */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <GraduationCap className="h-4 w-4" />
                Academic Levels
              </div>
              <div className="flex flex-wrap gap-2">
                {levels.map((level, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-sm font-medium text-purple-300"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>

            {/* Coverage */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <DollarSign className="h-4 w-4" />
                Coverage
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {scholarship.coverage}
              </p>
            </div>

            {/* Deadline */}
            {scholarship.deadline && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Calendar className="h-4 w-4" />
                  Application Deadline
                </div>
                <p className="text-white font-semibold text-lg">
                  {formatDate(scholarship.deadline)}
                </p>
              </div>
            )}
          </div>

          {/* Description (if available) */}
          {scholarship.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {scholarship.description}
              </p>
            </div>
          )}

          {/* Apply Button */}
          <a
            href={scholarship.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
          >
            <Globe className="h-5 w-5" />
            Visit Scholarship Website
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Scholarship Page Component
export default function ScholarshipPage() {
  const [scholarships] = useState(PLACEHOLDER_SCHOLARSHIPS);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterCountry, setFilterCountry] = useState("");

  // Get unique levels and countries for filters
  const { allLevels, allCountries } = useMemo(() => {
    const levels = new Set();
    const countries = new Set();

    scholarships.forEach((s) => {
      parseLevels(s.level).forEach((l) => levels.add(l));
      parseCountries(s.country).forEach((c) => countries.add(c));
    });

    return {
      allLevels: Array.from(levels).sort(),
      allCountries: Array.from(countries).sort(),
    };
  }, [scholarships]);

  // Filter and sort scholarships
  const filteredScholarships = useMemo(() => {
    let filtered = scholarships.filter((s) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.coverage.toLowerCase().includes(searchQuery.toLowerCase());

      // Level filter
      const matchesLevel =
        !filterLevel || parseLevels(s.level).includes(filterLevel);

      // Country filter
      const matchesCountry =
        !filterCountry || parseCountries(s.country).includes(filterCountry);

      return matchesSearch && matchesLevel && matchesCountry;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "country") {
        return a.country.localeCompare(b.country);
      }
      return 0;
    });

    return filtered;
  }, [scholarships, searchQuery, sortBy, filterLevel, filterCountry]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-gray-900/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              Global Scholarship
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Opportunities
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover and explore prestigious scholarships from around the
              world. Your future awaits.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-800/50 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="name">Sort by Name</option>
                <option value="country">Sort by Country</option>
              </select>

              {/* Level Filter */}
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-800/50 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="">All Levels</option>
                {allLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              {/* Country Filter */}
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-800/50 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="">All Countries</option>
                {allCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(searchQuery || filterLevel || filterCountry) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterLevel("");
                    setFilterCountry("");
                  }}
                  className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredScholarships.length} of {scholarships.length}{" "}
            scholarships
          </div>
        </div>
      </div>

      {/* Scholarship Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                onClick={() => setSelectedScholarship(scholarship)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredScholarships.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 border border-white/10 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No scholarships found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedScholarship && (
          <ScholarshipModal
            scholarship={selectedScholarship}
            onClose={() => setSelectedScholarship(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
