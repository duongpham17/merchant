import { useAppDispatch } from '@redux/hooks/useRedux';
import { IItems } from '@redux/types/items';
import Items from '@redux/actions/items';
import useForm from '@hooks/useForm';
import Button from '@components/buttons/Button';
import Input from '@components/inputs/Input';
import Choice from '@components/inputs/Choice';
import { gp } from '@utils/osrs';

const check = (key: any, values: any) => key in values;

interface Validation {
    name: string,
    quantity: number | string,
    buy: number | string,
};

const validations = (values: Validation) => {
    let errors: Partial<Validation> = {};
    if(check("name", values)){
        if(!values.name) {
            errors.name = "*";
        }
    } 
    return errors
};

const EditIndex = ({data}: {data: IItems}) => {

    const dispatch = useAppDispatch();

    const {values, onChange, onSubmit, edited, loading, onSetValue} = useForm(data, callback, validations);

    async function callback(){
        await dispatch(Items.update({
            ...values,
            sell: !values.sell ? 0 : values.sell,
            quantity: !values.quantity ? 0 : values.quantity,
            buy: !values.buy ? 0 : values.buy
        }));
    };

    return (
        <form onSubmit={onSubmit}>
            <Input 
                label1={`Item`} 
                label2={`ID ${values.id}`}
                name="name" 
                value={values.name} 
                onChange={() => ""} 
            />

            <Choice 
                value={values.side} 
                items={["buy", "sell"]} 
                label={"Side"} 
                onClick={v => onSetValue({side: v})}
            />

            <Input
                type="number"
                label1="Quantity"
                label2={gp(values.quantity) || ""}
                name="quantity"
                placeholder='...'
                value={values.quantity || ""} 
                onChange={onChange} 
            />

            {values.side === "buy" &&
                <Input 
                    type="number"
                    label1="Buy Price"
                    label2={gp(values.buy) || ""}
                    name="buy"
                    placeholder='...'
                    value={values.buy || ""} 
                    onChange={onChange} 
                />
            }

            {values.side === "sell" &&
                <Input 
                type="number"
                label1="Sell Price"
                label2={gp(values.sell)}
                name="sell"
                placeholder='...'
                value={values.sell || ""} 
                onChange={onChange} 
                />
            }

            {edited && <Button type="submit" label1={"update"} loading={loading} color="blue" />}
        </form>
    )
}

export default EditIndex