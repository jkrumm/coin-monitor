import styles from './index.module.scss';
import { Card } from '@cm/pwa/components/cards/card';
import { H1 } from '@blueprintjs/core';
import useAuth from '@cm/pwa/state/useAuth';
import CardItem from '@cm/pwa/components/cards/card-item';
import Script from 'next/script';

export function Index({ btc, coinMetricsRaw }) {
  const { auth, loading, error } = useAuth();
  console.log(coinMetricsRaw);
  return (
    <div className={styles.page}>
      <div id="welcome">
        <H1>Dashboard</H1>
        {auth && <H1>USER: {auth.authId}</H1>}
        {loading && <H1>LOADING: {loading.toString()}</H1>}
        {error && <H1>ERROR: {error.toString()}</H1>}
        <div
          id="boxes"
          className="boxes w-full grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 grid-rows-8 md:grid-rows-7 lg:grid-rows-3 md:grid-flow-col"
        >
          <div className="box row-span-2">
            <Card heading="Bitcoin">
              <CardItem
                title="Price"
                value={
                  btc.usd.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }) + ' $'
                }
              />
            </Card>
          </div>
          <div className="box">
            <Card heading="Crpyto Market">
              <div>WORKS</div>
            </Card>
          </div>
          <div className="box md:row-start-1 lg:row-start-auto row-span-2">
            <Card heading="Sentiment">
              <div>WORKS</div>
            </Card>
          </div>
          <div className="box">
            <Card heading="Activity">
              <div>WORKS</div>
            </Card>
          </div>
          <div className="box md:row-start-4 lg:row-start-auto md:col-start-1 lg:col-start-auto row-span-3">
            <Card heading="Momentum Indicators">
              <div>WORKS</div>
            </Card>
          </div>
          <div className="box row-span-3">
            <Card heading="MarketCycle">
              <div>WORKS</div>
            </Card>
          </div>
          <div className="box md:row-start-7 lg:row-start-auto md:col-start-1 lg:col-start-auto">
            <Card heading="Top Indicators">
              <div>WORKS</div>
            </Card>
          </div>
          <div className="box md:row-start-7 lg:row-start-auto row-span-2">
            <Card heading="Bottom Indicators">
              <div>WORKS</div>
            </Card>
          </div>
        </div>
      </div>
      <Script src="/script.js" />
    </div>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true',
  );
  const btc = (await res.json()).bitcoin;

  const resCoinMetricsRaw = await fetch(
    'http://localhost:8000/api/metrics/raw-coinmetrics',
  );
  const coinMetricsRaw = await resCoinMetricsRaw.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      btc,
      coinMetricsRaw,
    },
  };
}

export default Index;
