import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the heavy AppShell component without SSR to avoid canvas issues during build.
const AppShell = dynamic(() => import('../components/AppShell'), { ssr: false });

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Menelek Makonnen',
  jobTitle: 'Director & Worldbuilder',
  url: 'https://menelekmakonnen.com',
  sameAs: [
    'https://www.instagram.com/menelek.makonnen/',
    'https://www.youtube.com/@director_menelek',
    'https://www.linkedin.com/in/menelekmakonnen/',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'MMM Media',
  },
  makesOffer: {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'CreativeWork',
      name: 'Director for Hire • Client Value Calculator',
      description: 'Interactive scope planning for film, music video, documentary, and AI-assisted productions.',
    },
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Menelek Makonnen — Director & Worldbuilder</title>
        <meta
          name="description"
          content="Director and storyteller delivering cinematic films, commercials, and AI-driven visuals. Explore featured work, pricing calculator, and contact options."
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <AppShell />
    </>
  );
}
