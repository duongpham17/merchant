import { IItems } from '@redux/types/items'
import { useAppDispatch } from '@redux/hooks/useRedux';
import Item from '@redux/actions/items';
import { OSRS_GE_LATEST } from '@redux/types/osrs';

import { UK } from '@utils/time';
import { firstcaps } from '@utils/functions';
import { MdKeyboardArrowRight, MdContentCopy } from 'react-icons/md';

import Button from '@components/buttons/Button';
import Message from '@components/hover/Message';
import Line from '@components/line/Style1';
import Label1 from '@components/labels/Style1';
import Label2 from '@components/labels/Style2';
import Label3 from '@components/labels/Style3';
import Container from '@components/containers/Style1';
import Flex from '@components/flex/Style1';
import SlideIn from '@components/slidein/Style1';
import Pagination from '@components/pagination/Style1';

import useQuery from '@hooks/useQuery';

import Edit from '../edit';
import useOpen from '@hooks/useOpen';

interface Props {
  items: IItems[],
  latest: OSRS_GE_LATEST[],
  itemsFiltered: {
    id: number;
    icon: string,
    name: string,
    items: IItems[];
  }[],
};

const TransactionsIndex = ({itemsFiltered, latest}: Props) => {

  const dispatch = useAppDispatch();

  const { openLocal } = useOpen({local: "ge-item"});

  const { getQueryValue }  = useQuery()

  const data = itemsFiltered.filter(item => item.id.toString() === (getQueryValue("id") || openLocal || ""))[0];

  if(!data){
    return <Container>
      <Label1 color='red' name="Invalid item, try refreshing"/>
    </Container>
  }

  let average_cost = 0;

  try{
    average_cost = (latest[data.id].high + latest[data.id].low) / 2;
  } catch(_){
    return <Container>
      <Label1 color='red' name="Invalid item"/>
      {data.items.map(el => 
        <Button key={el._id} color="red" label1={`Delete ${el._id}`} onClick={() => dispatch(Item.remove(el._id))}/>  
      )}
    </Container>
  }

  const ProfitNLoss = (item: IItems) => {
    if(item.side === "sell"){
      const at_total = item.price * item.quantity;
      const current_total = item.quantity * item.sold;
      return {
        pnl: Math.floor((current_total - at_total) * 0.99),
        tax: (item.price - Math.trunc(item.price * 0.01)) * item.quantity
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

  const TotalDataSets = (item: IItems[]) => {
    let [buy, sell, quantity, tax] = [0, 0, 0, 0];
    let [unrealised_pnl, realised_pnl, liquidation] = [0, 0, 0];
    for(let x of item){
      if(x.side === "sell"){
        const at_total = x.price * x.quantity;
        const current_total = x.quantity * x.sold;
        realised_pnl += current_total - at_total
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

  const calc_cost_basis = (index: number, array: IItems[]) => {
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
    return (total_spent / accumulation).toFixed(2);
  };

  const calc_dca = (index: number, array: IItems[]) => {
    return array
      .slice(index)
      .map(el => el.side === "buy" ? el.quantity : -el.quantity)
      .reduce((acc,cur) => acc+cur);
  };

  const Methods = () => {
    let [COST, DCA] = [0, 0];
    for(let i in data.items){
      const index = Number(i) 
      if(index === 0){
        COST = Number(calc_cost_basis(index, data.items));
        DCA = Number(calc_dca(index, data.items));
        break
      }
    }
    return {
      costBasis: COST,
      dca: DCA,
    }
  };

  const methods = Methods();

  const total = TotalDataSets(data.items);

  const onCopy = () => {
    navigator.clipboard.writeText(JSON.stringify({
      cost_basis: methods.costBasis,
      dca: methods.dca,
      average_cost: average_cost
    }));
  };

  const onDelete = (id: string) => {
    dispatch(Item.remove(id))
  };

  return (
    <Container style={{padding: "0.5rem 0"}}>

        <Label3 
          name={`[${data.items.length}] ${firstcaps(data.name)}`} 
          value={<Message message="copy"><Button label1={<MdContentCopy/>} onClick={onCopy} color="dark" margin /></Message>} 
          size="1.2rem"
        />

        <Line />

        <Container style={{padding: "0.5rem 0"}}>

          <Label1 color="light" 
            name="Price [H-A-L]" 
            value={`${latest[data.id].high.toLocaleString()} - ${((latest[data.id].low + latest[data.id].high) / 2).toLocaleString()} - ${latest[data.id].low.toLocaleString()}`} 
          />
          
          <Line />

          <Label1 color="light" 
            name="Quantity" 
            value={methods.dca.toLocaleString()} 
          />
          <Label1 color="light" 
            name="Dca" 
            value={methods.costBasis.toLocaleString()} 
          />
          <Label1 color="light" name="Break Even" 
            value={(Number(methods.costBasis) * 1.01).toLocaleString()} 
          />

          <Line /> 

          <Label1 color="light" 
            name="Buy" 
            value={`${total.buy.toLocaleString()}`} 
          />
          <Label1 color="light" 
            name="Sell" 
            value={`${total.sell.toLocaleString()}`} 
          />

          <Line />
          
          <Label1 color="light" 
            name="Liquidation" 
            value={`${(Math.floor(total.liquidation * 0.99)).toLocaleString()}`}
          />
          <Label1 color="light" 
            name="Tax" 
            value={`${total.tax.toLocaleString()}`}
          />
          <Line />
          <Label3 color="light" valueColor={total.unrealised_pnl >= 0 ? "green" : "red"} 
            name="Unrealised PNL"
            value={`${total.unrealised_pnl.toLocaleString()}`} 
          />
          <Label3 color="light" valueColor={total.realised_pnl >= 0 ? "green" : "red"} 
            name="Realised PNL"
            value={`${total.realised_pnl.toLocaleString()}`} 
          />
          <Line />
        </Container>

        <Pagination data={data.items} show={25}>
          {(item, index, array) => 
            <Container background="dark" key={item._id}>

                <Flex>
                  <Label1 
                    name={`${index+1}. ${UK(new Date(Number(item.timestamp)))}`} 
                  />
                  <SlideIn 
                    width={350} 
                    icon={<MdKeyboardArrowRight/>} 
                    iconOpen={<Button onClick={() => onDelete(item._id)} label1="Delete" color="red" style={{"width": "100%"}}/>}
                  >
                    <Edit data={item} />
                  </SlideIn>
                </Flex>

                <Line />

                <Flex>
                  <Label3 color={item.side === "buy" ? "green" : "red"} 
                    name="" 
                    value={item.side.toUpperCase()} 
                  />
                  {item.side === "sell" && 
                    <Label3 color={ProfitNLoss(item).pnl <= 0 ? "red" : "green"} 
                      name={ProfitNLoss(item).pnl.toLocaleString()}
                    />
                  }
                  {item.side === "buy"  && 
                    <Label3 color={ProfitNLoss(item).pnl <= 0 ? "red" : "green"} 
                      name={ProfitNLoss(item).pnl.toLocaleString()}
                    />
                  }
                </Flex>
  
                <Line />
  
                { item.side === "sell" &&
                  <>
                    <Flex>
                      <Label2 
                        name="Price" 
                        value={item.price.toLocaleString()} 
                      />
                      <Label2 
                        name="Quantity" 
                        value={item.quantity.toLocaleString()} 
                      />
                      <Label2 
                        name="Total" 
                        value={(item.quantity * item.price).toLocaleString()} 
                      />
                    </Flex>

                    <Line />

                    <Flex>
                      <Label2 
                        name="Sold" 
                        value={item.sold} 
                      />
                      <Label2 
                        name="Tax" 
                        value={ProfitNLoss(item).tax.toLocaleString()} 
                      />
                      <Label2 
                        name="" 
                        value="" 
                      />
                    </Flex>

                    <Line />

                    <Flex>
                      <Label2 
                        name="Dca" 
                        value={calc_cost_basis(index, array)} 
                      />
                      <Label2 
                        name="NQuantity" 
                        value={calc_dca(index, array).toLocaleString()} 
                      />
                      <Label2 
                        name="" 
                        value="" 
                      />
                    </Flex>
                  </>
                }

                { item.side === "buy" &&
                  <>
                    <Flex>
                      <Label2 
                        name="Price" 
                        value={item.price.toLocaleString()} 
                      />
                      <Label2 
                        name="Quantity" 
                        value={item.quantity.toLocaleString()} 
                      />
                      <Label2 
                        name="Total" 
                        value={(item.quantity * item.price).toLocaleString()} 
                      />
                    </Flex>

                    <Line />

                    <Flex>
                      <Label2 
                        name="Dca" 
                        value={calc_cost_basis(index, array)}
                      />
                      <Label2 
                        name="NQuantity" 
                        value={calc_dca(index, array).toLocaleString()} 
                      />
                      <Label2 
                        name="" 
                        value=""
                      />
                    </Flex>
                    
                  </>
                }

            </Container>
          }
        </Pagination>
    </Container>
  )
}

export default TransactionsIndex