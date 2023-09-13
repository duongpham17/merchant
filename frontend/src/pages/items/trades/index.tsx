import { IItems } from '@redux/types/items'
import { useAppDispatch } from '@redux/hooks/useRedux';
import Item from '@redux/actions/items';
import { OSRS_GE } from '@redux/types/osrs';
import Edit from '../edit';

import Button from '@components/buttons/Button';
import Line from '@components/line/Style1';
import Label1 from '@components/labels/Style1';
import Label2 from '@components/labels/Style2';
import Label3 from '@components/labels/Style3';
import Container from '@components/containers/Style1';
import Flex from '@components/flex/Style1';
import SlideIn from '@components/slidein/Style1';
import Pagination from '@components/pagination/Style1';

import { UK } from '@utils/time';
import { firstcaps } from '@utils/functions';
import { MdKeyboardArrowRight } from 'react-icons/md';

interface Props {
  data: {
    id: number;
    name: string;
    trades: IItems[];
  },
  latest: OSRS_GE[]
}

const Trades = ({data, latest}: Props) => {

  const average_cost = (latest[data.id].high + latest[data.id].low) / 2;

  const dispatch = useAppDispatch();

  const profitNLoss = (item: IItems) => {
    if(item.side === "sell"){
      const at_total = item.price * item.quantity;
      const current_total = item.quantity * item.sold;
      return current_total - at_total
    } else {
      const at_total = item.price * item.quantity;
      const current_total = item.quantity * average_cost;
      return current_total - at_total;
    }
  };

  // const costBasis = (item: IItems) => {
  //   const cost = (item.quantity * item.price)
  // };

  const onDelete = (id: string) => {
    dispatch(Item.remove(id))
  };

  const calc = (item: IItems[]) => {

    let [buy, sell, quantity, bquantity, squantity] = [0, 0, 0, 0, 0];

    let [unrealised_pnl, realised_pnl, liquidation] = [0, 0, 0];

    for(let x of item){

      if(x.side === "sell"){
        const at_total = x.price * x.quantity;
        const current_total = x.quantity * x.sold;
        realised_pnl+=current_total - at_total
      } else {
        const at_total = x.price * x.quantity;
        const current_total = x.quantity * average_cost;
        unrealised_pnl+=current_total - at_total;
      };

      if(x.side === "buy"){
        buy += (x.quantity*x.price);
        bquantity += x.quantity;
        quantity += x.quantity;
      } else {
        sell += (x.quantity*x.sold);
        squantity += x.quantity;
      };
    };

    liquidation = buy + sell;

    return {
      quantity,
      buy, 
      sell, 
      pnl: buy - sell,
      liquidation,
      squantity,
      bquantity,
      unrealised_pnl,
      realised_pnl
    }
  };

  const total = calc(data.trades);

  return (
    <div key={data.id}>

        <Container>
          <Label1 color="light" name="Current Price" value={`H ${latest[data.id].high.toLocaleString()} . A ${((latest[data.id].low + latest[data.id].high) / 2).toLocaleString()} . L ${latest[data.id].low.toLocaleString()}`} />
          <Label1 color="light" name="Holdings" value={`C ${total.quantity.toLocaleString()} . B ${total.bquantity.toLocaleString()} . S ${total.squantity.toLocaleString()}`}/>
          <Line /> 
          <Label1 color="light" name="Buy" value={`${total.buy.toLocaleString()}`}/>
          <Label1 color="light" name="Sell" value={`${total.sell.toLocaleString()}`}/>
          <Label1 color="light" name="Liquidation" value={`${total.liquidation.toLocaleString()}`}/>
          <Line />
          <Label3 color="light" name="Unrealised PNL" value={`${total.unrealised_pnl.toLocaleString()}`} valueColor={total.unrealised_pnl >= 0 ? "green" : "red"} />
          <Label3 color="light" name="Realised PNL" value={`${total.realised_pnl.toLocaleString()}`} valueColor={total.realised_pnl >= 0 ? "green" : "red"} />
          <Line />
          <Label1 color="light" name="Transactions" value={`${data.trades.length}`}/>
        </Container>

        <Pagination data={data.trades} show={25}>
          {(item, index) => 
            <Container background="dark" key={item._id}>
                <Flex>
                <Label1 name={`${index+1}. ${firstcaps(item.name)}`} />
                <SlideIn width={350} icon={<MdKeyboardArrowRight/>} iconOpen={<Button onClick={() => onDelete(item._id)} label1="Delete" color="red" style={{"width": "100%"}}/>}>
                    <Edit data={item} />
                </SlideIn>
                </Flex>
  
                <Flex>
                <Label3 name={`${UK(new Date(Number(item.timestamp)))}, ${item._id.slice(-5).toUpperCase()}`} size={"0.8rem"} color="light"/>
                <Label3 name="" value={item.side.toUpperCase()} color={item.side === "buy" ? "green" : "red"} />
                </Flex>
  
                <Line />
  
                { item.side === "sell" ?
                  <Flex>
                    <Label2 name="SOLD" value={`${item.sold.toLocaleString()}`} />
                    <Label2 name="QTY" value={`${item.quantity.toLocaleString()}`} />
                    <Label2 name="TOTAL" value={`${(item.quantity * item.sold).toLocaleString()}`} />
                  </Flex>
                :
                  <Flex>
                    <Label2 name="PRICE" value={`${item.price.toLocaleString()}`} />
                    <Label2 name="QTY" value={`${item.quantity.toLocaleString()}`} />
                    <Label2 name="TOTAL" value={`${(item.quantity * (item.side === "buy" ? item.price : item.sold)).toLocaleString()}`} />
                  </Flex>
                }
  
                <Line />
  
                { item.side === "sell" ?      
                  <Flex>
                    <Label2 name="PRICE" value={`${item.price.toLocaleString()}`} />
                    <Label2 name="CHANGE" value={`${(item.sold - item.price).toLocaleString()}`} />
                    <Label2 name="NTQTY" value={`${item.quantity.toLocaleString()}`} />
                  </Flex>
                  :
                  <Flex>
                    <Label2 name="CBASIS" value={`${item.new_total_quantity / item.price}`} />
                    <Label2 name="NTQTY" value={`${item.quantity.toLocaleString()}`} />
                    <Label2 name="BEVEN" value={`${item.sold.toLocaleString()}`} />
                  </Flex>
                }
  
                <Line />
  
                <Flex>
                <Label2 name={item.side === "buy" ? "UNREALISED PNL" : "PROFIT/LOSS"} value={`${profitNLoss(item).toLocaleString()}`} color={profitNLoss(item) <= 0 ? "red" : "green"} />
                </Flex>
  
            </Container>
          }
        </Pagination>
    </div>
  )
}

export default Trades