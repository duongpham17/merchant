import styles from './List.module.scss';
import { useContext, useMemo } from 'react';
import { Context } from '../Context';
import { firstcaps } from '@utils/functions';
import { gemargin, getax, gp, calc_cost_basis_latest } from '@utils/osrs';
import { MdOutlineUnfoldMore } from 'react-icons/md';
import { useAppSelector } from '@redux/hooks/useRedux';

import SlideIn from '@components/slidein/Style1';
import Message from '@components/hover/Message';
import Line from '@components/line/Style1';
import Label1 from '@components/labels/Style1';

import useOpen from '@hooks/useOpen';
import useQuery from '@hooks/useQuery';

const ListIndex = () => {

    const {filtered} = useContext(Context);

    const {onOpenLocal: onOpenLocalSaved, openLocal: openLocalSaved} = useOpen({local: "ge-item-saved"});

    const {onOpenLocal, openLocal} = useOpen({local: "ge-item"});

    const {setQuery} = useQuery();

    const {latest} = useAppSelector(state => state.osrs);

    const onSelectItem = (item: typeof filtered[0]) => {
        onOpenLocal(item.id.toString());
        setQuery("id", item.id.toString());
        const saved: string[] = openLocalSaved.split(",");
        const list = saved.length >= 4 ? `${item.id},${saved.slice(0, 3).join(",")}` : `${item.id},${saved.join(",")}`;
        onOpenLocalSaved(list);
    };

    const margin = useMemo(() => {
        const items = [];
        for(let x of filtered){
            items.push({
                ...x,
                margin: gemargin(latest[x.id].high, latest[x.id].low)
            });
        };
        return items.sort((a,b) => b.margin - a.margin);
    }, [filtered, latest]);

    const sortedItems = useMemo(() => {
        const saved: string[] = openLocalSaved.split(",");
        const removed = filtered.filter(el => !saved.includes(el.id.toString()));
        const find = filtered.filter(el => saved.includes(el.id.toString()));
        const newest = [...find, ...removed];
        return newest;
    }, [filtered, openLocalSaved]);

    const analytics = useMemo(() => {

        const itemsObject: {
            data: {
                [key: number]: {
                    nquantity: number,
                    buy_total: number;
                    sell_total: number,
                    profit_n_loss: number,
                    liquidation: number
                };
            };
        } = { data: {} };

        const total = {
            networth: 0,
            pnl: 0,
        };

        for (let x of filtered) {
            
            x.items.forEach(item => {
                const itemId = item.id;
                const highest_price = latest[item.id].high;
                if (!itemsObject.data[itemId]) {
                    itemsObject.data[itemId] = { 
                        nquantity: 0, 
                        buy_total: 0, 
                        sell_total: 0,
                        profit_n_loss: 0, 
                        liquidation: 0
                    };
                };
                if (item.side === "sell") {
                    // const ge = getax(item.sell, item.quantity);
                    itemsObject.data[itemId].nquantity -= item.quantity;
                    itemsObject.data[itemId].sell_total += item.sell * item.quantity;
                } else {
                    // const ge = getax(highest_price, item.quantity);
                    itemsObject.data[itemId].nquantity += item.quantity;
                    itemsObject.data[itemId].buy_total += item.buy * item.quantity;
                };
                itemsObject.data[item.id].liquidation = getax(highest_price, itemsObject.data[item.id].nquantity).total_after_tax;
                itemsObject.data[item.id].profit_n_loss = (itemsObject.data[item.id].sell_total + itemsObject.data[item.id].liquidation) - itemsObject.data[x.id].buy_total;
            });

            total.pnl += itemsObject.data[x.id].profit_n_loss;
            total.networth += getax(latest[x.id].high, itemsObject.data[x.id].nquantity).total_after_tax
        };

        return {
            items: itemsObject.data,
            total
        };
    }, [filtered, latest]);

    return (
        <div className={styles.container}>

            <div className={styles.ids}>
                {sortedItems.map(el => 
                    <button className={`${styles.button} ${el.id.toString() === openLocal ? styles.selected : ""}`} key={el.id} onClick={() => onSelectItem(el)}>
                        <img src={`https://oldschool.runescape.wiki/images/${firstcaps(el.icon.replaceAll(" ", "_"))}`} alt="osrs"/>
                    </button>
                )}
            </div>

            <div className={styles.slide}>
                <SlideIn
                    width={300} 
                    icon={<button className={styles.button}><MdOutlineUnfoldMore /></button>} 
                    iconOpen={<Message message={"Networth"}>{gp(analytics.total.networth)}</Message>}
                >
                    <div className={styles.items}>

                        <Line/>

                        <Label1 
                            name={<Message message={`Items`}>[ {filtered.length} ]</Message>}
                            value={<Message message={"Profit/Loss"}><Label1 name={gp(analytics.total.pnl)} color={analytics.total.pnl >= 0 ? "green" : "red"} /></Message>}
                        />

                        <Line/>

                        {margin.map(el => 
                            <button key={el.id} onClick={() => onSelectItem(el)}>

                                <div className={styles.image}>
                                    <p>{firstcaps(el.name)}</p>
                                    <img src={`https://oldschool.runescape.wiki/images/${firstcaps(el.icon.replaceAll(" ", "_"))}`} alt="osrs"/>
                                </div>

                                <Line/>

                                <div className={styles.information}>
                                    <Message message={`Buy_Total, N_Quantity`} side="left"> 
                                        <div className={styles.hover}>
                                            <span>{`${gp(analytics.items[el.id].buy_total)} [ ${gp(analytics.items[el.id].nquantity)} ]`}</span>
                                        </div>
                                    </Message>
                                    <Message message="PNL" side="right"> 
                                        <span className={`${analytics.items[el.id].profit_n_loss >= 0 ? styles.green : styles.red}`}>
                                            { gp(analytics.items[el.id].profit_n_loss) }
                                        </span>
                                    </Message>
                                </div>

                                <Line/>

                                <div className={styles.information}>
                                    <Message message="[ Cost, High, Low ]" side="left"> 
                                        <div className={styles.hover}>
                                            [
                                            <span className={`${styles.cost} ${calc_cost_basis_latest(el.items) <= latest[el.id].high ? styles.green : styles.red}`}>
                                                {` ${gp(calc_cost_basis_latest(el.items))} `}
                                            </span>,
                                            <span className={styles.high}>{` ${gp(latest[el.id].high)}`}</span>,
                                            <span className={styles.low}>{` ${gp(latest[el.id].low)} `}</span>
                                            ]
                                        </div>
                                    </Message>
                                    <Message message="Margin" side="right"> 
                                        <p className={el.margin >= 0 ? styles.green : styles.red}>{gp(el.margin)}</p>
                                    </Message>
                                </div>
                                
                            </button>
                        )}
                        </div>
                    </SlideIn>
            </div>

        </div>
    )
}

export default ListIndex