import styles from './Items.module.scss';
import UseContextItems from './Context';

import Transactions from './transactions';
import Chart from './chart';
import List from './list';

const ItemsIndex = () => {

  return (
    <UseContextItems>
      <div className={styles.container}>

        <List />

        <Chart />

        <Transactions />
        
      </div>
    </UseContextItems>
  )
}

export default ItemsIndex