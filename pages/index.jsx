import Head from 'next/head';
import CameraApp from '../components/CameraApp';
import { sanitizeCameraMode, sanitizeHudLevel, sanitizeLens } from '../lib/cameraState';

export default function Home({ initialHud, initialMode, initialLens }) {
  return (
    <>
      <Head>
        <title>Photon Pro Studio</title>
        <meta
          name="description"
          content="Professional camera controls with adaptive heads-up display."
        />
      </Head>
      <main className="page">
        <CameraApp initialHud={initialHud} initialMode={initialMode} initialLens={initialLens} />
      </main>
    </>
  );
}

export function getServerSideProps({ query }) {
  const hud = sanitizeHudLevel(query.hud);
  const mode = sanitizeCameraMode(query.mode);
  const lens = sanitizeLens(query.lens);

  return {
    props: {
      initialHud: hud,
      initialMode: mode,
      initialLens: lens,
    },
  };
}
