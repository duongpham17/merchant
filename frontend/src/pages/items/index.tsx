import styles from './Items.module.scss';
import UseContextItems from './Context';

import Transactions from './transactions';
import Chart from './chart';
import List from './list';

const ItemsIndex = () => {

  return (
    <UseContextItems>
      <div className={styles.container}>

        <div className={styles.list}>
          <List />
        </div>

        <div className={styles.chart}>
          <Chart />
        </div>

        <div className={styles.transactions}>
          <Transactions />
        </div>
        
      </div>
    </UseContextItems>
  )
}

export default ItemsIndex