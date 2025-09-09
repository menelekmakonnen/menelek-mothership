import dynamic from 'next/dynamic';


// Dynamically import the heavy AppShell component without SSR to avoid canvas issues during build.
const AppShell = dynamic(() => import('../components/AppShell'), { ssr: false });

export default function Home() {
  return <AppShell />;
}
