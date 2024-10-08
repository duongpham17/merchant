import { useMemo } from 'react';
import { getax, gp } from '@utils/osrs'; 
import { useAppSelector } from '@redux/hooks/useRedux';
import useForm from '@hooks/useForm';

import Input from '@components/inputs/Input';
import Label from '@components/labels/Style1';
import Choice from '@components/inputs/Choice';
import Line from '@components/line/Style1';

const IndexCalc = () => {

    const {latest} = useAppSelector(state => state.osrs);

    const {items} = useAppSelector(state => state.items);

    const initialState = {
        side: "buy",
        old_price: 0,
        old_quantity: 0,
        new_price: 0,
    };

    const {values, onChange, onSubmit, onSetValue} = useForm(initialState, callback);
    
    function callback(){

    };

    const calc_buy_side = useMemo(() => {
        const ge = getax(values.old_price, values.old_quantity)
        const nqty = ge.total_after_tax / values.new_price;
        const cost = nqty * values.new_price;
        const total = values.old_price * values.old_quantity;
        const need = Math.floor(total / getax(values.new_price, 0).tax_per_item_value);
        const quantity_gains = Math.floor(values.old_quantity - need);
        return {
            total,
            quantity_gains,
            cost: cost,
            tax: ge.total_tax_amount,
            need
        }
    }, [values]);

    const calc_sell_side = useMemo(() => {
        const ge = getax(values.old_price, values.old_quantity)
        const nqty = ge.total_no_tax / values.new_price;
        const cost = nqty * values.new_price;
        const total = values.old_price * values.old_quantity;
        const need = Math.floor(total / getax(values.new_price, 0).tax_per_item_value);
        const quantity_gains = Math.floor(values.old_quantity - need);
        return {
            total,
            quantity_gains,
            cost: cost,
            tax: ge.total_tax_amount,
            need
        }
    }, [values]);

    return (
        <form onSubmit={onSubmit}>

            <Line />

            {!items ? "" : items.length ? <Label name={items[0].name} value={gp(latest[items[0].id].high)} /> : "" }

            <Line />

            <Choice 
                value={values.side} 
                items={["buy", "sell"]} 
                label={"Side"} 
                onClick={v => onSetValue({side: v})}
            />

            {values.side === "buy" &&
                <div>
                    <Input 
                        label1="Bought Quantity"
                        label2={gp(values.old_quantity)}
                        type="number" 
                        name="old_quantity"
                        value={values.old_quantity || ""}
                        onChange={onChange}
                    />
                    <Input 
                        label1="Bought Price"
                        label2={gp(values.old_price)}
                        type="number" 
                        name="old_price"
                        value={values.old_price || ""}
                        onChange={onChange}
                    />
                    <Input 
                        label1="Intended Sell Price"
                        label2={gp(values.new_price)}
                        type="number" 
                        name="new_price"
                        value={values.new_price || ""}
                        onChange={onChange}
                    />
                    <Line />
                    <Label 
                        color="light" 
                        name={`Total Cost`} 
                        value={gp(calc_buy_side.total) || 0} 
                    />
                    <Line />
                    <Label 
                        color="light" 
                        name={`Quantity To Break Even`} 
                        value={gp(calc_buy_side.need) || 0} 
                    />
                    <Line />
                    <Label 
                        color="light" 
                        name={`Quantity Gain`} 
                        value={gp(calc_buy_side.quantity_gains) || 0} 
                    />
                </div>
            }

            {values.side === "sell" &&
                <div>
                    <Input 
                        label1="Sell Quantity"
                        label2={gp(values.old_quantity)}
                        type="number" 
                        name="old_quantity"
                        value={values.old_quantity || ""}
                        onChange={onChange}
                    />
                    <Input 
                        label1="Sell Price"
                        label2={gp(values.old_price)}
                        type="number" 
                        name="old_price"
                        value={values.old_price || ""}
                        onChange={onChange}
                    />
                    <Input 
                        label1="Intended Buy Price"
                        label2={gp(values.new_price)}
                        type="number" 
                        name="new_price"
                        value={values.new_price || ""}
                        onChange={onChange}
                    />
                    <Line />
                    <Label 
                        color="light" 
                        name={`Total Sell`} 
                        value={gp(calc_sell_side.total) || 0} 
                    />
                    <Line />
                    <Label 
                        color="light" 
                        name={`Quantity To Reinvest`} 
                        value={gp(calc_sell_side.need) || 0} 
                    />
                    <Line />
                    <Label 
                        color="light" 
                        name={`Quantity Gain`} 
                        value={gp(calc_sell_side.quantity_gains) || 0} 
                    />
                </div>
            }

            
        </form>
    )
}

export default IndexCalc