import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" id="favicon" href="/favicon_active.png" type="image/png" />
        <meta name="description" content="Menelek Makonnen - Filmmaker, Worldbuilder, AI Innovator" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('visibilitychange', function() {
                var favicon = document.getElementById('favicon');
                if (document.hidden) {
                  favicon.href = '/favicon_idle.png';
                } else {
                  favicon.href = '/favicon_active.png';
                }
              });
            `,
          }}
        />
      </body>
    </Html>
  );
}
