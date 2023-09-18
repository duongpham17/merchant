import { IItems } from '@redux/types/items'
import { useAppDispatch } from '@redux/hooks/useRedux';
import Item from '@redux/actions/items';
import Alert from '@redux/actions/alert';
import { OSRS_GE_LATEST } from '@redux/types/osrs';
import OSRS_GE_ITEM from '@data/osrs-ge';

import { UK } from '@utils/time';
import { getax, gp, gemargin } from '@utils/osrs';
import { firstcaps } from '@utils/functions';
import { MdKeyboardArrowRight } from 'react-icons/md';

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

  let [average_cost, highest_cost, lowest_cost] = [0, 0, 0];

  try{
    average_cost = (latest[data.id].high + latest[data.id].low) / 2;
    highest_cost = latest[data.id].high;
    lowest_cost  = latest[data.id].low;
  } catch(_){
    return <Container>
      <Label1 color='red' name="Invalid item"/>
      {data.items.map(el => 
        <Button key={el._id} color="red" label1={`Delete ${el._id}`} onClick={() => dispatch(Item.remove(el._id))}/>  
      )}
    </Container>
  };

  const ProfitNLoss = (item: IItems) => {
    if(item.side === "sell"){
      const buy_total = item.price * item.quantity;
      const sell_total = item.quantity * item.sold;
      const taxes = getax(item.sold);
      return {
        total: sell_total,
        pnl: (sell_total - buy_total) -  (taxes.tax * item.quantity),
        tax: taxes.tax * item.quantity
      };
    } else {
      const buy_total = item.price * item.quantity;
      const current_total = item.quantity * average_cost;
      return {
        total: current_total,
        pnl: Math.floor(current_total - buy_total),
        tax: 0
      }
    }
  };

  const TotalDataSets = (item: IItems[]) => {
    let [buy, sell, quantity, tax] = [0, 0, 0, 0];
    let [unrealised_pnl, realised_pnl] = [0, 0];
    let [net, spend ] = [0, 0]
    for(let x of item){
      if(x.side === "sell"){
        const taxes = getax(x.sold, x.quantity)
        const at_total = x.price * x.quantity;
        const current_total = x.quantity * x.sold;
        realised_pnl += (current_total - at_total) - taxes.total_tax;
        net -= taxes.total_tax;
        buy += (x.quantity*x.price);
        quantity += x.quantity;
        tax += taxes.total_tax;
        spend -= (ProfitNLoss(x).total + taxes.total_tax);
      };
      if(x.side === "buy"){
        const at_total = x.price * x.quantity;
        const current_total = x.quantity * average_cost;
        unrealised_pnl += current_total - at_total;
        net += (x.quantity * latest[x.id].high);
        sell += (x.quantity*x.sold);
        spend += (x.quantity * x.price);
      };
    };
    return {
      spend,
      tax,
      net,
      quantity,
      buy, 
      sell, 
      pnl: buy - sell,
      unrealised_pnl,
      realised_pnl,
    }
  };

  const calc_cost_basis = (index: number, array: IItems[]) => {
    let [pnl, nqty] = [0, 0];
    for(let x of array.slice(index)){
      if(x.side === "sell") {
        nqty -= x.quantity;
        pnl -= x.sold * x.quantity;
      };
      if(x.side === "buy") {
        nqty += x.quantity;
        pnl += x.price * x.quantity;
      };
    };
    return Number((pnl / nqty).toFixed(2));
  };

  const calc_new_quantity = (index: number, array: IItems[]) => {
    return array
      .slice(index)
      .map(el => el.side === "buy" ? el.quantity : -el.quantity)
      .reduce((acc,cur) => acc+cur);
  };

  const Methods = () => {
    let [COST, NEW] = [0, 0];
    for(let i in data.items){
      const index = Number(i) 
      if(index === 0){
        COST =  Math.floor(calc_cost_basis(index, data.items));
        NEW = Number(calc_new_quantity(index, data.items));
        break
      }
    }
    return {
      costBasis: COST,
      newQuatntiy: NEW,
    }
  };

  const methods = Methods();

  const total = TotalDataSets(data.items);

  const onCopy = () => {
    navigator.clipboard.writeText(JSON.stringify({
      cost_basis: methods.costBasis,
      new_quantity: methods.newQuatntiy,
      average_cost: average_cost
    }));
    dispatch(Alert.set("Copied data"))
  };

  const onDelete = (id: string) => {
    dispatch(Item.remove(id))
  };

  return (
    <Container style={{padding: "0.5rem 0"}}>

        <Label3 
          name={`${firstcaps(data.name)}`} 
          value={`[${OSRS_GE_ITEM.find(el => el.id === data.id)?.limit || "?"}]`} 
          size="1.2rem"
        />

        <Line />

        <Container style={{padding: "0.5rem 0"}} onClick={onCopy}>
          <Flex>
            <Label2 
              color={gemargin(highest_cost, lowest_cost) >= 0 ? "green" : "red"}
              name={`Margin [ Tax ${gp(getax(highest_cost).tax)} ]`}
              value={`${gemargin(highest_cost, lowest_cost).toLocaleString()}`}
            />
            <Label2
              name="High" 
              value={latest[data.id].high.toLocaleString()} 
            />
            <Label2
              name="Low" 
              value={(latest[data.id].low).toLocaleString()} 
            />
          </Flex>
          <Line />
          <Flex>
              <Label2
                name="Cost Basis" 
                value={methods.costBasis.toLocaleString()} 
              />
              <Label2
                name="N Quantity" 
                value={methods.newQuatntiy.toLocaleString()} 
              />
              <Label2
                name="" 
                value="" 
              />
            </Flex>
          <Line />
            <Flex>
              <Label2
                name="Net Worth" 
                value={total.net.toLocaleString()} 
              />
              <Label2
                name="Net Spend" 
                value={total.spend.toLocaleString()} 
              />
              <Label2 
                name=""
                value={""} 
              />
            </Flex>
          <Line />
          <Flex>
            <Label2 color={total.unrealised_pnl >= 0 ? "green" : "red"} 
              name={"Unrealised PNL"}
              value={(total.unrealised_pnl - total.tax).toLocaleString()}
            />
            <Label2 color={total.realised_pnl >= 0 ? "green" : "red"} 
              name="Realised PNL"
              value={total.realised_pnl.toLocaleString()} 
            />
            <Label2 
              name=""
              value={""} 
            />
          </Flex>
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
                    <Message message={(ProfitNLoss(item).pnl).toLocaleString()}>
                      <Label3 color={ProfitNLoss(item).pnl <= 0 ? "red" : "green"} 
                        name={item.sold ? gp(ProfitNLoss(item).pnl) : "unknown"}
                      />
                    </Message>
                  }

                  {item.side === "buy" && 
                    <Message message={(ProfitNLoss(item).pnl).toLocaleString()}>
                      <Label3 color={ProfitNLoss(item).pnl <= 0 ? "red" : "green"} 
                        name={gp(ProfitNLoss(item).pnl)}
                      />
                    </Message>
                  }

                </Flex>
  
                <Line />
  
                { item.side === "sell" &&
                  <>
                    <Flex>
                      <Label2 
                        name="Buy Price" 
                        value={item.price.toLocaleString()} 
                      />
                      <Label2 
                        name="Quantity" 
                        value={item.quantity.toLocaleString()} 
                      />
                      <Label2 
                        name="Buy Valuation" 
                        value={gp(item.quantity * item.price)} 
                      />
                    </Flex>

                    <Line />

                    <Flex>
                      <Label2 
                        name="Sell Price" 
                        value={item.sold || 0} 
                      />
                      <Label2 
                        name="Tax" 
                        value={ProfitNLoss(item).tax} 
                      />
                      <Label2 
                        name="Sell Valuation" 
                        value={gp(ProfitNLoss(item).total)} 
                      />
                    </Flex>

                    <Line />

                    <Flex>
                      <Label2 
                        name="Dca" 
                        value={calc_cost_basis(index, array).toLocaleString()} 
                      />
                      <Label2 
                        name="NQuantity" 
                        value={calc_new_quantity(index, array).toLocaleString()} 
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
                        name="Buy Price" 
                        value={item.price.toLocaleString()} 
                      />
                      <Label2 
                        name="Quantity" 
                        value={item.quantity.toLocaleString()} 
                      />
                      <Label2 
                        name="Buy Valuation" 
                        value={gp(item.quantity * item.price)} 
                      />
                    </Flex>

                    <Line />

                    <Flex>
                      <Label2 
                        name="Dca" 
                        value={calc_cost_basis(index, array).toLocaleString()}
                      />
                      <Label2 
                        name="NQuantity" 
                        value={calc_new_quantity(index, array).toLocaleString()} 
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