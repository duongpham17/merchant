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
  
const Header = ({prices, data}: Props) => {
  
    const dispatch = useAppDispatch();
  
    const total = useMemo(() => {
      let [quantity, tax] = [0, 0];
      let [unrealised_pnl, realised_pnl] = [0, 0];
      let [networth, spend ] = [0, 0]
      for(let item of data.items){
        if(item.side === "sell"){
          const ge = getax(item.sell, item.quantity)
          realised_pnl += (item.buy * item.quantity) - ge.total_after_tax;
          networth -= ge.total_after_tax;
          quantity += item.quantity;
          tax += ge.total_after_tax;
          spend -= calc_profit_n_loss(item, item.buy).pnl_with_tax;
        };
        if(item.side === "buy"){
          const highest_price = prices.highest;
          spend += calc_profit_n_loss(item, item.buy).pnl_with_tax;
          unrealised_pnl += calc_profit_n_loss(item, highest_price).pnl_with_tax;
          networth += (item.quantity * highest_price);
          spend += (item.quantity * item.buy);
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
    }, [data.items, prices]);
  
    const latest_analytics = {
      cost_basis: calc_cost_basis_latest(data.items),
      n_quantiy: calc_n_quantity_latest(data.items)
    };
  
    const onCopy = () => {
      navigator.clipboard.writeText(JSON.stringify({
        cost_basis: latest_analytics.cost_basis,
        new_quantity: latest_analytics.n_quantiy,
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

            <Flex>
                <Label2
                  name="Cost Basis" 
                  value={<Message side="left" message={`${latest_analytics.cost_basis.toLocaleString()}`}>{gp(latest_analytics.cost_basis)}</Message>} 
                />
                <Label2
                  name="Net Worth" 
                  value={<Message side="left" message={`${total.networth.toLocaleString()}`}>{gp(total.networth)}</Message>}
                />
                <Label2
                  name="Net Spend" 
                  value={<Message side="left" message={`${total.spend.toLocaleString()}`}>{gp(total.spend)}</Message>}
                />
            </Flex>

            <Line />

            <Flex>
                <Label2
                  name="N Quantity" 
                  value={<Message side="left" message={`${latest_analytics.n_quantiy.toLocaleString()}`}>{gp(latest_analytics.n_quantiy)}</Message>}
                />
                <Label2 
                  color={total.unrealised_pnl >= 0 ? "green" : "red"} 
                  name={"Unrealised PNL"}
                  value={<Message side="left" message={`${(total.unrealised_pnl).toLocaleString()}`}>{gp(total.unrealised_pnl)}</Message>}
                />
                <Label2 color={total.realised_pnl >= 0 ? "green" : "red"} 
                  name="Realised PNL"
                  value={<Message side="left" message={`${total.realised_pnl.toLocaleString()}`}>{gp(total.realised_pnl)}</Message>}
                />
            </Flex>

            <Line />

        </Container>
    )
}

export default Header