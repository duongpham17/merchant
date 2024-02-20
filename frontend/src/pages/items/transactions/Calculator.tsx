import { useMemo } from 'react';
import { getax, gp } from '@utils/osrs'; 
import { useAppSelector } from '@redux/hooks/useRedux';
import { IItems } from '@redux/types/items';
import useForm from '@hooks/useForm';

import Input from '@components/inputs/Input';
import Label from '@components/labels/Style1';
import Label2 from '@components/labels/Style2';
import Choice from '@components/inputs/Choice';
import Line from '@components/line/Style1';
import Container from '@components/containers/Style1';
import Flex from '@components/flex/Between';

interface Props {
    data: IItems,
    history: IItems[],
    setHistory: React.Dispatch<React.SetStateAction<IItems[]>>
}

const IndexCalc = ({data, history, setHistory}: Props) => {

    const {latest} = useAppSelector(state => state.osrs);

    const initialState = {
        side: data.side,
        old_price: data.price,
        old_quantity: data.quantity,
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

    const calc_history = useMemo(() => {
        let data = [];
        let [total, quantity] = [0, 0]

        for(let x of history){
            if(x.side === values.side){
                data.push(x);
                total+=x.price*x.quantity;
                quantity+=x.quantity;
            };
        };

        return {
            data,
            total,
            quantity,
        };
    }, [history, values.side]);

    const onDeleteHistory = (id: string) => {
        setHistory(history => history.filter(el => el._id !== id));
    };  

    return (
        <div>
            <form onSubmit={onSubmit}>

                <Line />

                <Label name={data.name} value={gp(latest[data.id].high)} />

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

            <Line />
            <br/>
            <Line />
            
            <div>
                <Label 
                    name={`History`} 
                    value={calc_history.data.length} 
                />
                <Container background='light'>
                    <Flex>
                        <Label2
                            color="light" 
                            name={`Avg Price`} 
                            value={gp(Math.round(calc_history.total / calc_history.quantity))} 
                        />
                        <Label2
                            color="light" 
                            name={`Quantity`} 
                            value={gp(calc_history.quantity)} 
                        />
                        <Label2
                            color="light" 
                            name={`Total`} 
                            value={(gp(calc_history.total))} 
                        />
                    </Flex>
                </Container>
                {calc_history.data.map((el) => 
                    <Container key={el._id} background="dark" onClick={() => onDeleteHistory(el._id)}>
                        <Flex>
                            <Label2
                                color="light" 
                                name={`Price`} 
                                value={gp(el.price) || 0} 
                            />
                            <Label2
                                color="light" 
                                name={`Quantity`} 
                                value={gp(el.quantity) || 0} 
                            />
                            <Label2
                                color="light" 
                                name={`Total`} 
                                value={gp(el.quantity * el.price) || 0} 
                            />
                        </Flex>
                    </Container>    
                )}
            </div>

        </div>
    )
}

export default IndexCalc