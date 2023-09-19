import { useAppDispatch } from '@redux/hooks/useRedux';
import Item from '@redux/actions/items';
import { Filtered } from '../Context';
import { getax, gp, calc_cost_basis, calc_n_quantity, calc_profit_n_loss } from '@utils/osrs';
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

    console.log(data);

    return (
        <Pagination data={data.items} show={25}>
            {(item, index, array) => 
                <Observer key={item._id}>

                    <Container background="dark">
                        
                        <Flex>
                            <Label1
                                color='light'
                                name={
                                    <Flex>
                                        <span>{index+1}.</span>
                                        <Message side="center" message={`Cost Basis ${calc_cost_basis(index, array).toLocaleString()}`}>[{gp(calc_cost_basis(index, array))}]</Message>
                                        <Message side="center" message={`N Quantity ${calc_n_quantity(index, array).toLocaleString()}`}>[{gp(calc_n_quantity(index, array))}]</Message>
                                    </Flex>
                                }
                            />
                            <SlideIn 
                                width={350} 
                                icon={
                                    <Flex>
                                        <Label1 color="light" size="0.8rem" name={`${UK(new Date(Number(item.timestamp)))}`} style={{"width": "150px"}} />
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

                        <Flex>
                            <Label3 
                                color={item.side === "buy" ? "green" : "red"} 
                                name="" 
                                value={item.side.toUpperCase()} 
                            />
                            {item.side === "sell" && 
                                <Message message={(calc_profit_n_loss(item, item.sell).pnl_with_tax).toLocaleString()}>
                                    <Label3 
                                        color={calc_profit_n_loss(item, item.sell).pnl_with_tax <= 0 ? "red" : "green"} 
                                        name={item.sell ? gp(calc_profit_n_loss(item, item.sell).pnl_with_tax) : "....."}
                                    />
                                </Message>
                            }
                            {item.side === "buy" && 
                                <Message message={(calc_profit_n_loss(item, prices.highest).pnl_with_tax).toLocaleString()}>
                                    <Label3 
                                        color={calc_profit_n_loss(item, prices.highest).pnl_with_tax <= 0 ? "red" : "green"} 
                                        name={gp(calc_profit_n_loss(item, prices.highest).pnl_with_tax)}
                                    />
                                </Message>
                            }
                        </Flex>

                        <Line />

                        <Flex>
                            <Label2 
                                name="Buy Price" 
                                value={<Message side="left" message={`${item.buy.toLocaleString()}`}>{gp(item.buy)}</Message>}
                            />
                            <Label2 
                                name="Quantity" 
                                value={<Message side="left" message={`${item.quantity.toLocaleString()}`}>{gp(item.quantity)}</Message>}
                            />
                            <Label2 
                                name="Buy Valuation" 
                                value={<Message side="left" message={`${(item.quantity * item.buy).toLocaleString()}`}>{gp(item.quantity * item.buy)}</Message>}
                            />
                            </Flex>


                            { item.side === "sell" &&
                            <>
                                <Line />
                                <Flex>
                                    <Label2 
                                        name="Sell Price" 
                                        value={<Message side="left" message={`${item.sell.toLocaleString()}`}>{gp(item.sell)}</Message>}
                                    />
                                    <Label2 
                                        name="Tax" 
                                        value={<Message side="left" message={`${getax(item.sell, item.quantity).total_tax_amount.toLocaleString()}`}>{gp(getax(item.sell, item.quantity).total_tax_amount)}</Message>}
                                    />
                                    <Label2 
                                        name="Sell Valuation" 
                                        value={<Message side="left" message={`${(item.quantity * item.sell).toLocaleString()}`}>{gp(item.quantity * item.sell)}</Message>}
                                    />
                                </Flex>
                            </>
                        }

                    </Container>
            </Observer>
        }
    </Pagination>
  )
}

export default Transactions