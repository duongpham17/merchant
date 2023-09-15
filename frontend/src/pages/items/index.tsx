import styles from './Items.module.scss';
import { useAppSelector } from '@redux/hooks/useRedux';
import { IItems } from '@redux/types/items';

import Label1 from '@components/labels/Style1';

import Transactions from './transactions';
import Chart from './chart';
import List from './list';

const ItemsIndex = () => {

  const {items} = useAppSelector(state => state.items);

  const {latest} = useAppSelector(state => state.osrs);

  if(!items || latest.length === 0){
    return (
      <Label1 name="No item created" />
    )
  };

  const filterItems = () => {
    const data: {
      id: number;
      icon: string,
      name: string,
      items: IItems[];
    }[] = [];
    for(let x of items){
      const itemIndex = data.findIndex(el => el.id === x.id);
      if(itemIndex === -1){
        data.push({id: x.id, name: x.name, icon: x.icon, items: [x]});
      } else {
        data[itemIndex].items.push(x);
      };
    }
    return data;
  };

  const itemsFiltered = filterItems();

  return (
    <div className={styles.container}>

      <List 
        items={items} 
        itemsFiltered={itemsFiltered}
      />

      <Chart />

      <Transactions 
        items={items} 
        itemsFiltered={itemsFiltered}
        latest={latest}
      />

    </div>
  )
}

export default ItemsIndex