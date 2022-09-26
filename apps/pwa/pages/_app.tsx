import { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '@cm/pwa/components/header/header';
import Footer from '@cm/pwa/components/footer/footer';
import './styles.css';
import './global.scss';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CoinMonitor</title>
      </Head>
      <Header />
      <main className="px-2 sm:px-4 xl:px-8 py-2 sm:py-3 xl:py-6">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default CustomApp;
