import { useAppDispatch } from '@redux/hooks/useRedux';
import Items from '@redux/actions/items';
import useForm from '@hooks/useForm';
import OSRSGrandExchange from '@data/osrs-ge';

import Button from '@components/buttons/Button';
import Search from '@components/inputs/Search';
import Input from '@components/inputs/Input';
import Choice from '@components/inputs/Choice';
import Label from '@components/labels/Style1';
import Line from '@components/line/Style1';

import validation from './validation';

const CreateIndex = () => {

  const dispatch = useAppDispatch();

  const initialState = {
    name: "",
    side: "buy",
    id: 0,
    quantity: 0,
    price: 0,
    sold: 0,
    cost_basis: 0,
    new_total_quantity: 0,
  };

  const {values, onChange, onSubmit, onSetValue, errors, customErrors, setCustomErrors, onClear, loading} = useForm(initialState, callback, validation);

  async function callback(){
    const isExist = OSRSGrandExchange.find(el => el.name.toLowerCase() === values.name.toLowerCase());
    if(!isExist) return setCustomErrors({name: "invalid id"});
    const id = OSRSGrandExchange.find(el => el.name === values.name)?.id || 1;
    await dispatch(Items.create({...values, id}));
    setCustomErrors({});
    onClear();
  };
    
  return (
    <form onSubmit={onSubmit}>

      <Label name="Create a new transaction" size={20} />

      <Line />

      <Search 
        label1="Name of Item"
        label2={customErrors.name}
        error={errors.name}
        placeholder="name"
        name="name"
        value={values.name} 
        onChange={onChange} 
        data={OSRSGrandExchange.map(el => el.name)} 
        onSelectValue={(v) => onSetValue({name: v})}
        autoComplete="off"
      />

      <Choice 
        value={values.side} 
        items={["buy", "sell"]} 
        label={"Side"} 
        onClick={v => onSetValue({side: v})}
      />

      <Input 
        label1="Price"
        label2={errors.price}
        error={errors.price}
        name="price"
        placeholder='...'
        value={values.price || ""} 
        onChange={onChange} 
      />

      <Input
        label1="Quantity"
        label2={errors.quantity}
        error={errors.quantity}
        name="quantity"
        placeholder='...'
        value={values.quantity || ""} 
        onChange={onChange} 
      />

      <Input 
        label1="Sold Price"
        label2={errors.sold}
        error={errors.sold}
        name="sold"
        placeholder='...'
        value={values.sold || ""} 
        onChange={onChange} 
      />

      <Input
        label1="Cost Basis"
        name="cost_basis"
        value={values.cost_basis || ""} 
        placeholder="..."
        onChange={onChange} 
      />

      <Input
        label1="New Total Quantity"
        name="new_total_quantity"
        placeholder="..."
        value={values.new_total_quantity || ""} 
        onChange={onChange} 
      />

      <Button
        type="submit"
        label1="create"
        color="blue"
        loading={loading}
      />

    </form>
  )
}

export default CreateIndex