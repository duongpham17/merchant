import { useAppDispatch } from '@redux/hooks/useRedux';
import Items from '@redux/actions/items';
import OSRSGrandExchange from '@data/osrs-ge';
import {gp} from '@utils/osrs';
import {FaPaste} from 'react-icons/fa';

import Button from '@components/buttons/Button';
import Search from '@components/inputs/Search';
import Input from '@components/inputs/Input';
import Choice from '@components/inputs/Choice';
import Label from '@components/labels/Style1';
import Line from '@components/line/Style1';
import Flex from '@components/flex/Between';
import Message from '@components/hover/Message';

import useQuery from '@hooks/useQuery';
import useForm from '@hooks/useForm';

import validation from './validation';

const CreateIndex = () => {

  const dispatch = useAppDispatch();

  const {getQueryValue, setQuery} = useQuery();

  const id = Number(getQueryValue("id"));

  const ge_item_autofill = id ? OSRSGrandExchange.find(el => el.id === id) : "";

  const initialState = {
    name: ge_item_autofill ? ge_item_autofill.name : "",
    icon: ge_item_autofill ? ge_item_autofill.icon : "",
    side: "buy",
    id: id,
    quantity: 0,
    price: 0,
  };

  const {values, onChange, onSubmit, onSetValue, errors, customErrors, setCustomErrors, onClear, loading} = useForm(initialState, callback, validation);

  async function callback(){
    const isExist = OSRSGrandExchange.find(el => el.name.toLowerCase() === values.name.toLowerCase());
    if(!isExist) return setCustomErrors({name: "invalid id"});
    const index = OSRSGrandExchange.findIndex(el => el.name === values.name);
    await dispatch(Items.create({
      ...values, 
      id: OSRSGrandExchange[index].id,
      icon: OSRSGrandExchange[index].icon,
      price: values.price ? values.price : 0,
      quantity: values.quantity ? values.quantity : 0
    }));
    setQuery("id", values.id);
    setCustomErrors({});
    onClear();
  };

  const onPaste = async () => {
    try {
      const value = await navigator.clipboard.readText();
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && parsed !== null) {
          onSetValue({ price: parsed.cost_basis });
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
        label2={gp(values.quantity)}
        name="quantity"
        placeholder='...'
        value={values.quantity || ""} 
        onChange={onChange} 
      />

      <Input 
        type="number"
        label1={values.side === "buy" ? `Buy Price` : "Sell Price"}
        label2={gp(values.price) || ""}
        name="price"
        placeholder='...'
        value={values.price || ""} 
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