import styles from './index.module.scss';
import { Card } from '@cm/pwa/components/cards/card';
import { H1 } from '@blueprintjs/core';
import useAuth from '@cm/pwa/state/useAuth';
import CardItem, { CardItemTypes } from '@cm/pwa/components/cards/card-item';
import Script from 'next/script';
import { CoinMetricsRaw } from '@cm/api-data/modules/metrics/entities/coin-metrics-raw.entity';
import { ParentSize } from '@visx/responsive';
import BrushChart from '@cm/pwa/components/charts/chart';
import TestChart from '@cm/pwa/components/charts/test-chart';

export function Index({ btc, coinMetricsRaw, priceUsd }) {
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
          id="cards"
          className="cards w-full grid gap-2 xl:gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 grid-rows-8 md:grid-rows-7 lg:grid-rows-3 md:grid-flow-col"
        >
          <div className="card row-span-2">
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
              <CardItem
                title="1D %"
                value={
                  btc.usd_24h_change.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) + ' %'
                }
              />
            </Card>
          </div>
          <div className="card">
            <Card heading="Crpyto Market">
              <div>WORKS</div>
            </Card>
          </div>
          <div className="card md:row-start-1 lg:row-start-auto row-span-2">
            <Card heading="Sentiment">
              <div>WORKS</div>
            </Card>
          </div>
          <div className="card">
            <Card heading="Activity">
              <div>WORKS</div>
            </Card>
          </div>
          <div className="card md:row-start-4 lg:row-start-auto md:col-start-1 lg:col-start-auto row-span-3">
            <Card heading="Momentum Indicators">
              <CardItem title="3D MACD" value="BUY" type={CardItemTypes.BUY_SELL} />
              <CardItem
                title="3D Supertrend"
                value="SELL"
                type={CardItemTypes.BUY_SELL}
              />
            </Card>
          </div>
          <div className="card row-span-3">
            <Card heading="MarketCycle">
              <CardItem
                title="2Y MA BTC Investor Tool"
                value={5}
                type={CardItemTypes.PERCENT}
              />
              <CardItem title="200W MA Heatmap" value={20} type={CardItemTypes.PERCENT} />
              <CardItem title="Puell Multiple" value={66} type={CardItemTypes.PERCENT} />
              <CardItem
                title="Logarithmic Growth Curve"
                value={95}
                type={CardItemTypes.PERCENT}
              />
            </Card>
          </div>
          <div className="card md:row-start-7 lg:row-start-auto md:col-start-1 lg:col-start-auto">
            <Card heading="Top Indicators">
              <div>WORKS</div>
            </Card>
          </div>
          <div className="card md:row-start-7 lg:row-start-auto row-span-2">
            <Card heading="Bottom Indicators">
              <div>WORKS</div>
            </Card>
          </div>
        </div>
        <div className="mt-8 h-[800px] mb-20">
          <H1>Chart</H1>
          <ParentSize>
            {({ width, height }) => (
              <BrushChart stock={priceUsd} width={width} height={height} />
              /*<TestChart stocks={priceUsd} width={width} height={height} />*/
            )}
          </ParentSize>
        </div>
        <div className="mt-8 h-[800px] mb-20">
          <H1>Chart</H1>
          <ParentSize>
            {({ width, height }) => (
              <TestChart stocks={priceUsd} width={width} height={height} />
            )}
          </ParentSize>
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

  const resCoinMetricsRaw = await fetch('http://localhost:8000/metrics/raw-coinmetrics');
  const coinMetricsRaw = await resCoinMetricsRaw.json();

  const resPriceUsd = await fetch('http://localhost:8000/metrics/price-usd');
  let priceUsdRaw = (await resPriceUsd.json()) as CoinMetricsRaw[];
  // console.log(priceUsdRaw);
  // const priceUsd = [];
  const priceUsd = priceUsdRaw
    .map((item) => ({
      date: item.time,
      close: Math.round(parseFloat(item.PriceUSD) * 100) / 100,
    }))
    .reverse();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      btc,
      coinMetricsRaw,
      priceUsd,
    },
  };
}

export default Index;
