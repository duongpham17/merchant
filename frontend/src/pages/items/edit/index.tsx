import { useAppDispatch } from '@redux/hooks/useRedux';
import { IItems } from '@redux/types/items';
import Items from '@redux/actions/items';
import useForm from '@hooks/useForm';

import Button from '@components/buttons/Button';
import Input from '@components/inputs/Input';
import Choice from '@components/inputs/Choice';

import validations from './validation';

const EditIndex = ({data}: {data: IItems}) => {

    const dispatch = useAppDispatch();

    const {values, onChange, onSubmit, edited, loading, onSetValue} = useForm(data, callback, validations);

    async function callback(){
        await dispatch(Items.update(values));
    };

    return (
        <form onSubmit={onSubmit}>
            <Input label1={`Item name - ID: ${values.id}`} name="name" value={values.name} onChange={() => ""} />

            <Choice 
                value={values.side} 
                items={["buy", "sell"]} 
                label={"Side"} 
                onClick={v => onSetValue({side: v})}
            />

            <Input type="number" label1="Price" name="price" value={values.price} onChange={onChange} />

            <Input type="number" label1="Sold" name="sold" value={values.sold} onChange={onChange} />

            <Input type="number" label1="Quantity" name="quantity" value={values.quantity} onChange={onChange} />

            <Input type="number" label1="Cost Basis" name="cost_basis" value={values.cost_basis || ""} onChange={onChange} />

            <Input type="number" label1="New Total Quantity" name="new_total_quantity" value={values.new_total_quantity || ""} onChange={onChange} />

            {edited && <Button type="submit" label1={"update"} loading={loading} color="blue" />}
        </form>
    )
}

export default EditIndex