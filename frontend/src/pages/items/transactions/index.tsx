import { useContext } from 'react';
import { Context } from '../Context';
import { useAppDispatch } from '@redux/hooks/useRedux';
import Item from '@redux/actions/items';
import Button from '@components/buttons/Button';
import Label1 from '@components/labels/Style1';
import Container from '@components/containers/Style1';
import useOpen from '@hooks/useOpen';
import useQuery from '@hooks/useQuery';

import Header from './Header';
import Transactions from './Transactions';

const TransactionsIndex = () => {

  const dispatch = useAppDispatch()

  const { filtered, latest } = useContext(Context);

  const { openLocal } = useOpen({local: "ge-item"});

  const { getQueryValue }  = useQuery()

  const data = filtered.filter(item => item.id.toString() === (getQueryValue("id") || openLocal || ""))[0];

  const prices = {average: 0, highest: 0, lowest: 0};

  if(!data){
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
    prices.average = (latest[data.id].high + latest[data.id].low) / 2;
    prices.highest = latest[data.id].high;
    prices.lowest  = latest[data.id].low;
  } catch(_){
    return (
      <Container>
        <Label1 
          color='red' 
          name="Invalid item, please delete"
        />
        {data.items.map(el => 
          <Button 
            key={el._id} 
            color="red" 
            label1={`Delete ${el._id}`} 
            onClick={() => dispatch(Item.remove(el._id))}
          />  
        )}
      </Container>
    )
  };

  return (
    <Container style={{padding: "0.5rem 0"}}>

      <Header 
        prices={prices}
        data={data}
      />

      <Transactions
        prices={prices}
        data={data}
      />

    </Container>
  )
}

export default TransactionsIndex