import { useMemo } from 'react';
import { Filtered } from '../Context';
import { useAppDispatch } from '@redux/hooks/useRedux';
import Alert from '@redux/actions/alert';
import OSRS_GE_ITEM from '@data/osrs-ge';
import { getax, gp, calc_cost_basis_latest, calc_n_quantity_latest, calc_profit_n_loss } from '@utils/osrs';
import { firstcaps } from '@utils/functions';
import Message from '@components/hover/Message';
import Line from '@components/line/Style1';
import Label2 from '@components/labels/Style2';
import Label3 from '@components/labels/Style3';
import Container from '@components/containers/Style1';
import Flex from '@components/flex/Between';

interface Props {
    prices: {
      highest: number,
      average: number,
      lowest: number
    },
    data: Filtered
}
  
const Analytics = ({prices, data}: Props) => {
  
    const dispatch = useAppDispatch();

    const latest_analytics = useMemo(() => ({
      cost_basis: calc_cost_basis_latest(data.items),
      n_quantity: calc_n_quantity_latest(data.items)
    }), [data.items]);
  
    const total = useMemo(() => {
      let [liquidation, profit_n_loss] = [0, 0];
      let [buy, sell] = [0, 0];
      let [qty_bought, qty_sold] = [0, 0];

      for(let item of data.items){
        if(item.side === "sell"){
          sell += item.quantity * item.sell;
          qty_sold += item.quantity;
        };
        if(item.side === "buy"){
          buy += item.quantity * item.buy;
          qty_bought += item.quantity;
        };
      };

      liquidation = getax(prices.highest, latest_analytics.n_quantity).total_after_tax;

      profit_n_loss = (sell + liquidation) - buy;

      return {
        sell,
        buy,
        qty_bought,
        qty_sold, 
        liquidation,
        profit_n_loss
      }
    }, [data.items, prices, latest_analytics]);
  
    const onCopy = () => {
      navigator.clipboard.writeText(JSON.stringify({
        cost_basis: latest_analytics.cost_basis,
        new_quantity: latest_analytics.n_quantity,
        average_cost: prices.average
      }));
      dispatch(Alert.set("Copied data"))
    };
  
    return (
        <Container style={{padding: "0.5rem 0"}} onClick={onCopy}>

            <Label3 
              name={`${firstcaps(data.name)}`} 
              value={<Message side="right" message="Limit">[{OSRS_GE_ITEM.find(el => el.id === data.id)?.limit || "?"}]</Message>} 
              size="1.2rem"
            />

            <Line />
            <Line />

            <Flex>
                <Label2
                  name="Cost Basis" 
                  value={<Message side="left" message={`${latest_analytics.cost_basis.toLocaleString()}`}>{gp(latest_analytics.cost_basis)}</Message>} 
                />
                <Label2
                  name="Buy Total" 
                  value={<Message side="left" message={`${total.buy.toLocaleString()}`}>{gp(total.buy)}</Message>}
                />
                <Label2
                  name="Sell Total" 
                  value={<Message side="left" message={`${(total.sell).toLocaleString()}`}>{gp(total.sell)}</Message>}
                />
            </Flex>

            <Line />

            <Flex>
                <Label2
                  name="N Qty" 
                  value={<Message side="left" message={`${latest_analytics.n_quantity.toLocaleString()}`}>{gp(latest_analytics.n_quantity)}</Message>}
                />
                <Label2
                  name="Buy Qty" 
                  value={<Message side="left" message={`${total.qty_bought.toLocaleString()}`}>{gp(total.qty_bought)}</Message>}
                />
                <Label2 
                  name={"Sell Qty"}
                  value={<Message side="left" message={`${total.qty_sold.toLocaleString()}`}>{gp(total.qty_sold)}</Message>}
                />
            </Flex>

            <Line />

            <Flex>
                <Label2
                  name="Transactions" 
                  value={data.items.length}
                />
                <Label2
                  name="Liquidation" 
                  value={<Message side="left" message={`${total.liquidation.toLocaleString()}`}>{gp(total.liquidation)}</Message>}
                />
                <Label2 
                  color={total.profit_n_loss >= 0 ? "green" : "red"}
                  name={"PNL"}
                  value={<Message side="left" message={`Profit/Loss`}>{gp(total.profit_n_loss)}</Message>}
                />
            </Flex>

            <Line />
            <Line />

        </Container>
    )
}

export default Analytics