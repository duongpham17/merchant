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
      return {
        pnl: Math.floor((current_total - at_total) * 0.99),
        tax: Math.floor((current_total) * 0.01)
      };
    } else {
      const at_total = item.price * item.quantity;
      const current_total = item.quantity * average_cost;
      return {
        pnl: Math.floor((current_total - at_total) * 0.99),
        tax: 0
      }
    }
  };

  const onDelete = (id: string) => {
    dispatch(Item.remove(id))
  };

  const calc = (item: IItems[]) => {

    let [buy, sell, quantity, tax] = [0, 0, 0, 0];

    let [unrealised_pnl, realised_pnl, liquidation] = [0, 0, 0];

    for(let x of item){

      if(x.side === "sell"){
        const at_total = x.price * x.quantity;
        const current_total = x.quantity * x.sold;
        realised_pnl+=current_total - at_total
        tax += Math.floor(current_total * 0.01);
      } else {
        const at_total = x.price * x.quantity;
        const current_total = x.quantity * average_cost;
        unrealised_pnl+=current_total - at_total;
      };

      if(x.side === "buy"){
        buy += (x.quantity*x.price);
        quantity += x.quantity;
      } else {
        sell += (x.quantity*x.sold);
      };
      
    };

    liquidation = buy + sell;

    return {
      quantity,
      buy, 
      sell, 
      pnl: buy - sell,
      liquidation,
      unrealised_pnl,
      realised_pnl,
      tax
    }
  };

  const total = calc(data.trades);

  const costBasis = (index: number, array: IItems[]) => {

    let [total_spent, accumulation] = [0, 0];
    
    for(let x of array.slice(index)){
      if(x.side === "sell") {
        accumulation -= x.quantity;
        total_spent -= x.price * x.quantity;
      }
      if(x.side === "buy") {
        accumulation += x.quantity;
        total_spent += x.price * x.quantity;
      }
    };

    return (total_spent / accumulation).toFixed(2)
  
  };

  const dca = (index: number, array: IItems[]) => {
    return array.slice(index).map(el => el.side==="buy" ? el.quantity : -el.quantity).reduce((acc,cur) => acc+cur);
  };

  return (
    <div key={data.id}>

        <Container>
          <Label1 color="light" name="Current Price" value={`H ${latest[data.id].high.toLocaleString()} . A ${((latest[data.id].low + latest[data.id].high) / 2).toLocaleString()} . L ${latest[data.id].low.toLocaleString()}`} />
          <Line />
            {data.trades.map((item, index, array) => 
              index === 0 ? 
                <div key={item._id}>
                  <Label1 color="light" name="DCA" value={costBasis(index, array)}/>
                  <Label1 color="light" name="Total Quantity" value={dca(index, array).toLocaleString()}/>
                  <Label1 color="light" name="Break Even" value={(Number(costBasis(index, array)) * 1.01).toFixed(2).toLocaleString()} />
                </div>
              : ""
            )}
          <Line /> 
          <Label3 color="light" name="Buy" value={`${total.buy.toLocaleString()}`}  valueColor="green" />
          <Label3 color="light" name="Sell" value={`${total.sell.toLocaleString()}`}  valueColor={"red"} />
          <Line />
          <Label1 color="light" name="Liquidation" value={`${(Math.floor(total.liquidation * 0.99)).toLocaleString()}`}/>
          <Label1 color="light" name="Tax" value={`${total.tax.toLocaleString()}`}/>
          <Line />
          <Label3 color="light" name="Unrealised PNL" value={`${total.unrealised_pnl.toLocaleString()}`} valueColor={total.unrealised_pnl >= 0 ? "green" : "red"} />
          <Label3 color="light" name="Realised PNL" value={`${total.realised_pnl.toLocaleString()}`} valueColor={total.realised_pnl >= 0 ? "green" : "red"} />
          <Line />
          <Label1 color="light" name="Transactions" value={`${data.trades.length}`}/>
        </Container>

        <Pagination data={data.trades} show={25}>
          {(item, index, array) => 
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
                    <Label2 name="PRICE" value={`${item.price.toLocaleString()}`} />
                    <Label2 name="QTY" value={`${item.quantity.toLocaleString()}`} />
                    <Label2 name="TOTAL" value={`${(item.quantity * item.price).toLocaleString()}`} />
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
                    <Label2 name="DCA" value={`${costBasis(index, array)}`} />
                    <Label2 name="ACCUMLATION" value={`${item.quantity.toLocaleString()}`} />
                    <Label2 name="" value={""} />
                  </Flex>
                  :
                  <Flex>
                    <Label2 name="DCA" value={costBasis(index, array)} />
                    <Label2 name="ACCUMLATION" value={`${item.quantity.toLocaleString()}`} />
                    <Label2 name="" value={``} />
                  </Flex>
                }
  
                <Line />
  
                <Flex>
                  <Label2 name={item.side === "buy" ? "UNREALISED PNL" : "REALISED PNL"} value={`${profitNLoss(item).pnl.toLocaleString()}`} color={profitNLoss(item).pnl <= 0 ? "red" : "green"} />
                  { item.side === "sell" &&
                    <>
                      <Label2 name="TAX" value={`${profitNLoss(item).tax.toLocaleString()}`} />
                      <Label2 name="SOLD" value={`${(item.sold).toLocaleString()}`} />
                    </>
                  }
                </Flex>
  
            </Container>
          }
        </Pagination>
    </div>
  )
}

export default Trades