import styles from './index.module.scss';
import { Button, H1 } from '@blueprintjs/core';

export function Index({ btc }) {
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <H1 className="text-center">BTC price: {btc.usd}</H1>
            <Button>TEST</Button>
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
