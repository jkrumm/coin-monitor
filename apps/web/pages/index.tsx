import styles from './index.module.scss';
import { DateTest } from '@cm/types';

export function Index({ dateTest }: { dateTest: DateTest }) {
  return (
    <div className={styles.page}>
      Hello World!
      <br />
      {JSON.stringify(dateTest)}
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      dateTest: await fetch('http://localhost:3333/api').then((response) =>
        response.json()
      ),
    },
  };
}

export default Index;
