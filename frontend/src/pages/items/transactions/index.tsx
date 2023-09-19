import { IItems } from '@redux/types/items'
import { useAppDispatch } from '@redux/hooks/useRedux';
import Item from '@redux/actions/items';
import Alert from '@redux/actions/alert';
import { OSRS_GE_LATEST } from '@redux/types/osrs';
import OSRS_GE_ITEM from '@data/osrs-ge';

import { UK } from '@utils/time';
import { getax, gp, gemargin, calc_cost_basis, calc_n_quantity, calc_cost_basis_latest, calc_n_quantity_latest, calc_profit_n_loss } from '@utils/osrs';
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
import Observer from '@components/observer/Observer';

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

  const total = (() => {
    let [quantity, tax] = [0, 0];
    let [unrealised_pnl, realised_pnl] = [0, 0];
    let [networth, spend ] = [0, 0]
    for(let item of data.items){
      if(item.side === "sell"){
        const ge = getax(item.sold, item.quantity)
        realised_pnl += (item.price * item.quantity) - ge.total_after_tax;
        networth -= ge.total_after_tax;
        quantity += item.quantity;
        tax += ge.total_after_tax;
        spend -= calc_profit_n_loss(item, item.price).pnl_with_tax;
      };
      if(item.side === "buy"){
        const highest_price = latest[item.id].high;
        spend += calc_profit_n_loss(item, item.price).pnl_with_tax;
        unrealised_pnl += calc_profit_n_loss(item, highest_price).pnl_with_tax;
        networth += (item.quantity * highest_price);
        spend += (item.quantity * item.price);
      };
    };
    return {
      spend,
      tax,
      networth,
      quantity,
      unrealised_pnl,
      realised_pnl,
    }
  })();

  const latest_analytics = {
    cost_basis: calc_cost_basis_latest(data.items),
    n_quantiy: calc_n_quantity_latest(data.items)
  };

  const onCopy = () => {
    navigator.clipboard.writeText(JSON.stringify({
      cost_basis: latest_analytics.cost_basis,
      new_quantity: latest_analytics.n_quantiy,
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
              name={`Margin`}
              value={
                <Message side="left" message={`Tax ${gp(getax(highest_cost).total_after_tax)}`}>
                  <Label2 
                    name="" 
                    value={gemargin(highest_cost, lowest_cost).toLocaleString()} 
                    color={gemargin(highest_cost, lowest_cost) >= 0 ? "green" : "red"}
                  />
                </Message>
              }
            />
            <Label2
              name="High" 
              value={<Message side="left" message={`${latest[data.id].high.toLocaleString()}`}>{gp(latest[data.id].high)}</Message>} 
            />
            <Label2
              name="Low" 
              value={<Message side="left" message={`${latest[data.id].low.toLocaleString()}`}>{gp(latest[data.id].low)}</Message>} 
            />
          </Flex>
          <Line />
          <Flex>
              <Label2
                name="Cost Basis" 
                value={<Message side="left" message={`${latest_analytics.cost_basis.toLocaleString()}`}>{gp(latest_analytics.cost_basis)}</Message>} 
              />
              <Label2
                name="N Quantity" 
                value={<Message side="left" message={`${latest_analytics.n_quantiy.toLocaleString()}`}>{gp(latest_analytics.n_quantiy)}</Message>}
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
                value={<Message side="left" message={`${total.networth.toLocaleString()}`}>{gp(total.networth)}</Message>}
              />
              <Label2
                name="Net Spend" 
                value={<Message side="left" message={`${total.spend.toLocaleString()}`}>{gp(total.spend)}</Message>}
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
              value={<Message side="left" message={`${(total.unrealised_pnl).toLocaleString()}`}>{gp(total.unrealised_pnl)}</Message>}
            />
            <Label2 color={total.realised_pnl >= 0 ? "green" : "red"} 
              name="Realised PNL"
              value={<Message side="left" message={`${total.realised_pnl.toLocaleString()}`}>{gp(total.realised_pnl)}</Message>}
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
          <Observer key={item._id}>
            <Container background="dark">

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
                  <Label3 
                    color={item.side === "buy" ? "green" : "red"} 
                    name="" 
                    value={item.side.toUpperCase()} 
                  />

                  {item.side === "sell" && 
                    <Message message={(calc_profit_n_loss(item, item.sold).pnl_with_tax).toLocaleString()}>
                      <Label3 color={calc_profit_n_loss(item, item.sold).pnl_with_tax <= 0 ? "red" : "green"} 
                        name={item.sold ? gp(calc_profit_n_loss(item, item.sold).pnl_with_tax) : "unknown"}
                      />
                    </Message>
                  }

                  {item.side === "buy" && 
                    <Message message={(calc_profit_n_loss(item, highest_cost).pnl_with_tax).toLocaleString()}>
                      <Label3 color={calc_profit_n_loss(item, highest_cost).pnl_with_tax <= 0 ? "red" : "green"} 
                        name={gp(calc_profit_n_loss(item, highest_cost).pnl_with_tax)}
                      />
                    </Message>
                  }

                </Flex>
  
                <Line />

                <Flex>
                    <Label2 
                      name="Buy Price" 
                      value={<Message side="left" message={`${item.price.toLocaleString()}`}>{gp(item.price)}</Message>}
                    />
                    <Label2 
                      name="Quantity" 
                      value={<Message side="left" message={`${item.quantity.toLocaleString()}`}>{gp(item.quantity)}</Message>}
                    />
                    <Label2 
                      name="Buy Valuation" 
                      value={<Message side="left" message={`${(item.quantity * item.price).toLocaleString()}`}>{gp(item.quantity * item.price)}</Message>}
                    />
                  </Flex>


                  { item.side === "sell" &&
                  <>

                    <Line />

                    <Flex>
                      <Label2 
                        name="Sell Price" 
                        value={<Message side="left" message={`${item.sold.toLocaleString()}`}>{gp(item.sold)}</Message>}
                      />
                      <Label2 
                        name="Tax" 
                        value={<Message side="left" message={`${getax(item.sold, item.quantity).total_tax_amount.toLocaleString()}`}>{gp(getax(item.sold, item.quantity).total_tax_amount)}</Message>}
                      />
                      <Label2 
                        name="Sell Valuation" 
                        value={<Message side="left" message={`${(item.quantity * item.sold).toLocaleString()}`}>{gp(item.quantity * item.sold)}</Message>}
                      />
                    </Flex>
                  </>
                }

                <Line />

                <Flex>
                  <Label2 
                    name="Cost Basis" 
                    value={<Message side="left" message={calc_cost_basis(index, array).toLocaleString()}>{gp(calc_cost_basis(index, array))}</Message>}
                  />
                  <Label2 
                    name="NQuantity" 
                    value={<Message side="left" message={calc_n_quantity(index, array).toLocaleString()}>{gp(calc_n_quantity(index, array))}</Message>}
                  />
                  <Label2 
                    name="" 
                    value="" 
                  />
                </Flex>
    
            </Container>
          </Observer>
          }
        </Pagination>
    </Container>
  )
}

export default TransactionsIndex