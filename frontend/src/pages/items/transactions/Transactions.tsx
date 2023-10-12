import { useMemo } from 'react';
import { useAppDispatch } from '@redux/hooks/useRedux';
import Item from '@redux/actions/items';
import { Filtered } from '../Context';
import { gp, calc_cost_basis, calc_n_quantity } from '@utils/osrs';
import { UK } from '@utils/time';
import Button from '@components/buttons/Button';
import Message from '@components/hover/Message';
import Line from '@components/line/Style1';
import Label1 from '@components/labels/Style1';
import Label2 from '@components/labels/Style2';
import Label3 from '@components/labels/Style3';
import Container from '@components/containers/Style1';
import Flex from '@components/flex/Between';
import SlideIn from '@components/slidein/Style1';
import Pagination from '@components/pagination/Style1';
import Observer from '@components/observer/Observer';
import { MdKeyboardArrowRight } from 'react-icons/md';

import Edit from './Edit';

interface Props {
    prices: {
      highest: number,
      average: number,
      lowest: number
    },
    data: Filtered
}

const Transactions = ({data, prices}: Props) => {

    const dispatch = useAppDispatch();

    const onDelete = (id: string) => {
        dispatch(Item.remove(id))
    };

    const FitleredByDate = useMemo(() => {
        const dates = [];
        for(let x of data.items){
            const itemDate = new Date(Number(x.timestamp)).toDateString();
            const dateIndex = dates.findIndex(el => el.date === itemDate);
            if(dateIndex === -1){
                dates.push({
                    date: itemDate,
                    items: [ x ]
                })
            } else {
                dates[dateIndex].items = [...dates[dateIndex].items, x]
            };
        };
        return dates;
    }, [data]);

    const ItemsList = data.items.map(el => el).flat();

    const findIndex = (id: string) => ItemsList.findIndex((item) => item._id ===  id); 

    return (
        <Pagination data={FitleredByDate} show={25}>
            {(dated) => 
                <Observer key={dated.date}>

                    
                    <Label1 
                        name={dated.date === new Date().toDateString() ? `Today` : dated.date} 
                        value={`[ ${dated.items.length} ]`} 
                        color='light'
                        valueColor='light'
                        style={{padding: "0.5rem 0"}}
                    /> 

                    <Line color="main" />        

                    { dated.items.map((item) => 
                     <Container background="dark" key={item._id}>
                        
                        <Flex>
                            <Label1
                                name={
                                    <Flex>
                                        <Label3 
                                            color={item.side === "buy" ? "green" : "red"} 
                                            name="" 
                                            value={item.side.toUpperCase()} 
                                        />
                                        <Message message={`Cost_Basis ${calc_cost_basis(findIndex(item._id), ItemsList).toLocaleString()}`}>
                                            <Label1 
                                                color='light' 
                                                name={`[ ${gp(calc_cost_basis(findIndex(item._id), ItemsList))} ]`} 
                                                size="0.8rem"
                                            />
                                        </Message>
                                        <Message message={`N_Quantity ${calc_n_quantity(findIndex(item._id), ItemsList).toLocaleString()}`}>
                                            <Label1 
                                                color='light' 
                                                name={`[ ${gp(calc_n_quantity(findIndex(item._id), ItemsList))} ]`} 
                                                size="0.8rem"
                                            />
                                        </Message>
                                    </Flex>
                                }
                            />
                            <SlideIn 
                                width={350} 
                                icon={
                                    <Flex>
                                        <Label1 
                                            color="light"
                                            size="0.8rem" 
                                            name={`${UK(new Date(Number(item.timestamp))).split(",")[1]}`} 
                                            style={{"width": "80px"}} 
                                        />
                                        <MdKeyboardArrowRight/>
                                    </Flex>
                                } 
                                iconOpen={<Button onClick={() => onDelete(item._id)} label1="Delete" color="red" style={{"width": "100%"}}/>}
                            >
                            <Edit 
                                data={item} 
                            />
                            </SlideIn>
                        </Flex>

                        <Line />

                        {item.side === "buy" && 
                            <Flex>
                                <Label2 
                                    name="Price" 
                                    value={<Message side="left" message={`${item.buy.toLocaleString()}`}>{gp(item.buy)}</Message>}
                                />
                                <Label2 
                                    name="Quantity" 
                                    value={<Message side="left" message={`${item.quantity.toLocaleString()}`}>{gp(item.quantity)}</Message>}
                                />
                                <Label2 
                                    name="Total" 
                                    value={<Message side="left" message={`${(item.quantity * item.buy).toLocaleString()}`}>{gp(item.quantity * item.buy)}</Message>}
                                />
                            </Flex>
                        }

                        { item.side === "sell" &&
                            <Flex>
                                <Label2 
                                    name="Price" 
                                    value={<Message side="left" message={`${item.sell.toLocaleString()}`}>{gp(item.sell)}</Message>}
                                />
                                <Label2 
                                    name="Quantity" 
                                    value={<Message side="left" message={`${item.quantity.toLocaleString()}`}>{gp(item.quantity)}</Message>}
                                />
                                <Label2 
                                    name="Total" 
                                    value={<Message side="left" message={`${(item.quantity * item.sell).toLocaleString()}`}>{gp(item.quantity * item.sell)}</Message>}
                                />
                            </Flex>
                        }

                    </Container>
                    )
                        
                    }
                
            </Observer>
            }
    </Pagination>
  )
}

export default Transactions