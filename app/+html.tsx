import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6C63FF" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                overflow: auto !important;
                height: 100%;
              }
              #root {
                display: flex;
                flex-direction: column;
                min-height: 100%;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
