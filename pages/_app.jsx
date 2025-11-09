import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export function reportWebVitals(metric) {
  if (typeof window === 'undefined') {
    return;
  }

  const body = JSON.stringify({
    id: metric.id,
    name: metric.name,
    value: metric.value,
    label: metric.label,
  });

  const url = '/api/vitals';
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, {
      body,
      method: 'POST',
      keepalive: true,
      headers: {
        'content-type': 'application/json',
      },
    }).catch(() => {
      // Swallow network errors so analytics do not break the experience.
    });
  }
}
