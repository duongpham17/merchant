import { useContext } from 'react';
import { Context } from '../Context';
import { useAppDispatch } from '@redux/hooks/useRedux';
import Item from '@redux/actions/items';

import Button from '@components/buttons/Button';
import Label1 from '@components/labels/Style1';
import Container from '@components/containers/Style1';

import Analytics from './Analytics';
import Transactions from './Transactions';

const TransactionsIndex = () => {

  const dispatch = useAppDispatch()

  const { items, latest } = useContext(Context);

  const prices = {average: 0, highest: 0, lowest: 0};

  const item = items ? items[0] : null;;

  if(!item){
    return (
      <Container>
        <Label1 
          color='red' 
          name="Invalid item, try refreshing"
        />
      </Container>
    )
  };

  try{
    prices.average = (latest[item.id].high + latest[item.id].low) / 2;
    prices.highest = latest[item.id].high;
    prices.lowest  = latest[item.id].low;
  } catch(_){
    return (
      <Container>
        <Label1 
          color='red' 
          name="Invalid item, please delete"
        />
        <Button 
          key={item._id} 
          color="red" 
          label1={`Delete ${item._id}, ${item.name}`} 
          onClick={() => dispatch(Item.remove(item._id))}
        />  
      </Container>
    )
  };

  return (
    <Container style={{padding: "0.5rem 0"}}>

      {items &&
        <>
          <Analytics 
            prices={prices}
            data={items}
          />

          <Transactions
            prices={prices}
            data={items}
          />
        </>
      }

    </Container>
  )
}

export default TransactionsIndex