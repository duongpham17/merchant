import { useAppDispatch } from '@redux/hooks/useRedux';
import Items from '@redux/actions/items';
import OSRSGrandExchange from '@data/osrs-ge';
import {FaPaste} from 'react-icons/fa';

import Button from '@components/buttons/Button';
import Search from '@components/inputs/Search';
import Input from '@components/inputs/Input';
import Choice from '@components/inputs/Choice';
import Label from '@components/labels/Style1';
import Line from '@components/line/Style1';
import Flex from '@components/flex/Style1';
import Message from '@components/hover/Message';

import useQuery from '@hooks/useQuery';
import useForm from '@hooks/useForm';

import validation from './validation';

const CreateIndex = () => {

  const dispatch = useAppDispatch();

  const {getQueryValue} = useQuery();

  const id = Number(getQueryValue("id"));

  const ge_item_autofill = id ? OSRSGrandExchange.find(el => el.id === id) : "";

  const initialState = {
    name: ge_item_autofill ? ge_item_autofill.name : "",
    icon: ge_item_autofill ? ge_item_autofill.icon : "",
    side: "buy",
    id: id,
    quantity: 0,
    price: 0,
    sold: 0,
  };

  const {values, onChange, onSubmit, onSetValue, errors, customErrors, setCustomErrors, onClear, loading} = useForm(initialState, callback, validation);

  async function callback(){
    const isExist = OSRSGrandExchange.find(el => el.name.toLowerCase() === values.name.toLowerCase());
    if(!isExist) return setCustomErrors({name: "invalid id"});
    const index = OSRSGrandExchange.findIndex(el => el.name === values.name);
    const id = OSRSGrandExchange[index].id;
    const icon = OSRSGrandExchange[index].icon
    await dispatch(Items.create({...values, id, icon}));
    setCustomErrors({});
    onClear();
  };

  const onPaste = async () => {
    try {
      const value = await navigator.clipboard.readText();
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && parsed !== null) {
          onSetValue({ price: parsed.cost_basis, sold: parsed.average_cost });
      } else {
        console.error('Invalid clipboard data: Not a valid JSON object.');
      }
    } catch (error) {
      console.error('Error parsing clipboard data:', error);
    }
  };
    
  return (
    <form onSubmit={onSubmit} onContextMenu={onPaste}>

      <Flex>
        <Label name="Create a new transaction" size={20} />
        <Message message="paste"><Button label1={<FaPaste/>} onClick={onPaste} color="dark" /></Message>
      </Flex>

      <Line />

      <Search 
        label1="Item"
        label2={customErrors.name}
        error={errors.name}
        onClear={() => onSetValue({name: ""})} 
        placeholder="..."
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
        type="number"
        label1="Quantity"
        label2={errors.quantity}
        error={errors.quantity}
        name="quantity"
        placeholder='...'
        value={values.quantity || ""} 
        onChange={onChange} 
      />

      <Input 
        type="number"
        label1="Buy Price"
        label2={errors.price}
        error={errors.price}
        name="price"
        placeholder='...'
        value={values.price || ""} 
        onChange={onChange} 
      />

      {values.side === "sell" &&
        <Input 
          type="number"
          label1="Sell Price"
          label2={errors.sold}
          error={errors.sold}
          name="sold"
          placeholder='...'
          value={values.sold || ""} 
          onChange={onChange} 
        />
      }

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