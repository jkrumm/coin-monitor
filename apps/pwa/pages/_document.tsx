import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Classes } from '@blueprintjs/core';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png" />
          <meta name="theme-color" content="#2F343C" />
        </Head>
        <body className={'dark-wrapper ' + Classes.DARK}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
