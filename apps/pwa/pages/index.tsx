import styles from './index.module.scss';
import { Card } from '@cm/pwa/components/cards/card';
import { H1 } from '@blueprintjs/core';

export function Index({ btc }) {
  return (
    <div className={styles.page}>
      <div id="welcome">
        <H1>Dashboard</H1>
        <div className="w-full grid overflow-hidden gap-2 xl:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 grid-rows-8 md:grid-rows-7 lg:grid-rows-3 md:grid-flow-col">
          <div className="box row-span-2">
            <Card heading="Bitcoin">
              <div>
                Price
                {btc.usd.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{' '}
                $
              </div>
              <div>
                Price{' '}
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(btc.usd)}
              </div>
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

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      btc,
    },
  };
}

export default Index;
