import { useAppDispatch } from '@redux/hooks/useRedux';
import { IItems } from '@redux/types/items';
import Items from '@redux/actions/items';
import useForm from '@hooks/useForm';

import Button from '@components/buttons/Button';
import Input from '@components/inputs/Input';
import Choice from '@components/inputs/Choice';

import validations from './validation';
import { gp } from '@utils/osrs';

const EditIndex = ({data}: {data: IItems}) => {

    const dispatch = useAppDispatch();

    const {values, onChange, onSubmit, edited, loading, onSetValue} = useForm(data, callback, validations);

    async function callback(){
        await dispatch(Items.update(values));
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
                label2={gp(values.quantity)}
                name="quantity" 
                value={values.quantity || ""} 
                onChange={onChange} 
            />

            <Input 
                type="number" 
                label1="Buy Price" 
                label2={gp(values.price)}
                name="price" 
                value={values.price || ""} 
                onChange={onChange} 
            />

            {values.side === "sell" &&
                <Input 
                    type="number" 
                    label1="Sell Price" 
                    label2={gp(values.sold)}
                    name="sold" 
                    value={values.sold || ""} 
                    onChange={onChange} 
                />
            }

            {edited && <Button type="submit" label1={"update"} loading={loading} color="blue" />}
        </form>
    )
}

export default EditIndex