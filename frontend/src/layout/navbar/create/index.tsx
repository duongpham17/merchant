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
import useQuery from '@hooks/useQuery';

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

  const excelData = [
    ["Buy", 321, 872, "#VALUE!", 864.00, 864.00, 872.00, 880.72, 321, -279912],
    ["Buy", 10000, 896, 312, 888.00, 888.00, 895.25, 904.21, 10321, -8960000],
    ["Sell", 6000, 930, 9729, 921.00, 921.00, 847.01, 855.48, 4321, 5580000],
    ["Buy", 4361, 908, 6145, 899.00, 899.00, 877.64, 886.42, 8682, -3959788]
  ];

  const func = async () => {
    for(let x of excelData){
      const [side, quantity, price] = x;
      await dispatch(Items.create({      
        name: "cooked karambwan",
        id: 3144,
        quantity: Number(quantity),
        side: side.toString().toLowerCase(),
        price: Number(price),
        sold: 0,
        icon: "cooked karambwan.png"
      }))
    }
  };
    
  return (
    <form onSubmit={onSubmit}>

      <button type="button" onClick={func}>send it</button>

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