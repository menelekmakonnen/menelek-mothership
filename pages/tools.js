import Link from 'next/link';
import '../styles/globals.css';

/**
 * Tools page for Menelek Makonnen.
 * This page provides a placeholder for upcoming tools and a simple link back to the home page.
 */
export default function Tools() {
  return (
    <main className="min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Tools</h1>
      <p className="text-white/70 max-w-2xl mb-6">
        A suite of utilities and experiments for filmmaking, worldbuilding and AI will live here soon.
      </p>
      <div className="flex gap-3">
        <Link href="/" legacyBehavior>
          <a className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors">Home</a>
        </Link>
        <button
          onClick={() => alert('Coming soon: calculators, NDA generator, and more.')}
          className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
        >
          Coming Soon
        </button>
      </div>
    </main>
  );
}
