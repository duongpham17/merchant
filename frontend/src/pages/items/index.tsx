import styles from './Items.module.scss';
import { useAppSelector } from '@redux/hooks/useRedux';
import { IItems } from '@redux/types/items';

import Button from '@components/buttons/Button';
import Line from '@components/line/Style1';
import Label1 from '@components/labels/Style1';

import useOpen from '@hooks/useOpen';
import useQuery from '@hooks/useQuery';

import Trades from './trades';
import { firstcaps } from '@utils/functions';

const ItemsIndex = () => {

  const {items} = useAppSelector(state => state.items);

  const {latest} = useAppSelector(state => state.osrs);

  const {onOpenLocal, openLocal} = useOpen({local: "ge-item"});

  const {setQuery} = useQuery()

  if(!items || latest.length === 0 ){
    return (
      <Label1 name="No item created" />
    )
  };

  const filteredItemData = () => {
    const data: {
      id: number;
      icon: string,
      name: string,
      trades: IItems[];
    }[] = [];

    for(let x of items){
      const itemIndex = data.findIndex(el => el.id === x.id);
      if(itemIndex === -1){
        data.push({id: x.id, name: x.name, icon: x.icon, trades: [x]});
      } else {
        data[itemIndex].trades.push(x);
      };
    }

    return data;
  };

  const totalCost = (items: IItems[]) => {
    let [buy, sell] = [0, 0]

    for(let x of items){
      if(x.side === "buy"){
        buy += (x.quantity*x.price)
      } else {
        sell += (x.quantity*x.price)
      }
    };

    return {
      buy,
      sell
    }
  };

  const filtered = filteredItemData();

  const onChangeItem = (id: string ) => {
    onOpenLocal(id.toString());
    setQuery("id", id.toString());
  }

  return (
    <div className={styles.container}>

      <Label1 
        size={20} 
        name={`Total Transaction ${items.length}`} 
        value={`BUY ${totalCost(items).buy.toLocaleString()} | SELL ${totalCost(items).sell.toLocaleString()}`}
      />

      <Line />

      <div className={styles.itemsContainer}>

        <div className={styles.ids}>
          <Label1 name="Items" value={`${filtered.length}`} size={18} style={{marginBottom: "0.5rem"}}/>

          {filtered.map((el) => 
            <Button 
              key={el.id} 
              label1={<img src={`https://oldschool.runescape.wiki/images/${firstcaps(el.icon.replaceAll(" ", "_"))}`} alt="osrs"/>}
              label2={el.name}
              onClick={() => onChangeItem(el.id.toString())}  
              color="dark" 
              margin 
              selected={openLocal===el.id.toString()}
            />
          )}
        </div>

        <div className={styles.items}>
          {filtered.filter(el => el.id.toString() === openLocal).map((el) => 
            <Trades key={el.id} data={el} latest={latest} />
          )}
        </div>

      </div>

    </div>
  )
}

export default ItemsIndex