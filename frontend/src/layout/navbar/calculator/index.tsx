import {getax} from '@utils/osrs'; 

import useForm from '@hooks/useForm';
import Input from '@components/inputs/Input';
import Label from '@components/labels/Style1';
import Choice from '@components/inputs/Choice';
import Line from '@components/line/Style1';

const IndexCalc = () => {

    const initialState = {
        side: "buy",
        old_price: 0,
        old_quantity: 0,
        new_price: 0,
    };

    const {values, onChange, onSubmit, onSetValue} = useForm(initialState, callback);
    
    function callback(){

    };

    const calc_buy_side = () => {
        const nqty = getax(values.old_price, values.old_quantity).total_after_tax / values.new_price;
        const cost = nqty * values.new_price;
        return {
            total: cost,
            quantity: nqty
        }
    }
    return (
        <form onSubmit={onSubmit}>
            <Choice 
                value={values.side} 
                items={["buy", "sell"]} 
                label={"Side"} 
                onClick={v => onSetValue({side: v})}
            />

            {values.side === "buy" &&
                <div>
                    <Input 
                        label1="Bought Price"
                        type="number" 
                        name="old_price"
                        value={values.old_price || ""}
                        onChange={onChange}
                    />
                    <Input 
                        label1="Bought Quantity"
                        type="number" 
                        name="old_quantity"
                        value={values.old_quantity || ""}
                        onChange={onChange}
                    />
                    <Input 
                        label1="Intended Sell Price"
                        type="number" 
                        name="new_price"
                        value={values.new_price || ""}
                        onChange={onChange}
                    />
                </div>
            }

            {values.side === "sell" &&
                <div>
                    <Input 
                        label1="Sell Price"
                        type="number" 
                        name="old_price"
                        value={values.old_price || ""}
                        onChange={onChange}
                    />
                    <Input 
                        label1="Sell Quantity"
                        type="number" 
                        name="old_quantity"
                        value={values.old_quantity || ""}
                        onChange={onChange}
                    />
                    <Input 
                        label1="Intended Buy Price"
                        type="number" 
                        name="new_price"
                        value={values.new_price || ""}
                        onChange={onChange}
                    />
                </div>
            }

            <Line />
            <Label name={`Cost`} value={calc_buy_side().total.toLocaleString() || 0} />

            <Line />
            <Label name={`New Quantity`} value={calc_buy_side().quantity.toLocaleString() || 0} />
            
        </form>
    )
}

export default IndexCalc