import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {process.env.noIndex && <meta name="robots" content="noindex" />}

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.trackingCode}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.trackingCode}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />

          {/* OGP */}
          <meta property="og:title" content={process.env.title} />
          <meta property="og:site_name" content={process.env.ogpSiteName} />
          <meta property="og:description" content={process.env.description} />
          <meta property="og:url" content={process.env.ogpUrl} />
          <meta property="og:image" content={process.env.ogpImage} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
