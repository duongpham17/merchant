import styles from './List.module.scss';
import { useContext, useMemo } from 'react';
import { Context } from '../Context';
import { firstcaps } from '@utils/functions';
import { gemargin, getax, gp, calc_cost_basis_latest, calc_profit_n_loss } from '@utils/osrs';
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

    const totalUnrealisedPnl = useMemo(() => {
        let total = 0;
        for(let item of filtered){
            const latest_price = latest[item.id].high;
            for(let x of item.items){
                total += calc_profit_n_loss(x, latest_price).pnl_with_tax;
            };
        };
        return total;
    }, [filtered, latest]);

    const analytics = useMemo(() => {

        const itemsObject: {
            data: {
                [key: number]: {
                    nquantity: number,
                    networth: number;
                    taxes: number;
                    spend: number;
                    unrealised_pnl: number,
                };
            };
        } = { data: {} };

        const total = {
            networth: 0,
            taxes: 0
        };

        for (let x of filtered) {
            x.items.forEach(item => {
                const itemId = item.id;
                if (!itemsObject.data[itemId]) {
                    itemsObject.data[itemId] = { networth: 0, taxes: 0, nquantity: 0, spend: 0, unrealised_pnl: 0 };
                };
                if (item.side === "sell") {
                    const ge = getax(item.sell, item.quantity);
                    itemsObject.data[itemId].networth -= ge.total_after_tax;
                    itemsObject.data[itemId].taxes += ge.total_tax_amount;
                    itemsObject.data[itemId].nquantity -= item.quantity;
                    itemsObject.data[itemId].spend += ge.total_no_tax;
                    total.networth += ge.total_after_tax;
                    total.taxes += ge.total_tax_amount;
                } else {
                    const ge = getax(latest[itemId].high, item.quantity);
                    itemsObject.data[itemId].networth += (item.quantity * latest[item.id].high);
                    itemsObject.data[itemId].nquantity += item.quantity;
                    itemsObject.data[itemId].spend += ge.total_after_tax;
                    itemsObject.data[itemId].unrealised_pnl += ge.total_after_tax - (item.buy * item.quantity);
                    total.networth += ge.total_after_tax;
                    total.taxes += ge.total_tax_amount;
                };
            });
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
                    iconOpen={<Message message={`Tax ${gp(analytics.total.taxes)}`}>{gp(analytics.total.networth)} [ {filtered.length} ]</Message>}
                >
                    <div className={styles.items}>

                        <Line/>

                        <Label1 
                            weight={200}
                                                        size="0.9rem"
                            name={"Unrealised PNL"}
                            value={<Message message={totalUnrealisedPnl.toLocaleString() || "0"}>{gp(totalUnrealisedPnl)}</Message>}
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
                                    <Message message={`Net Worth, N Quantity`} side="left"> 
                                        <div className={styles.hover}>
                                            <span>{`${gp(analytics.items[el.id].networth)} [ ${gp(analytics.items[el.id].nquantity)} ]`}</span>
                                        </div>
                                    </Message>
                                    <Message message="Unrealised PNL" side="right"> 
                                        <span className={`${analytics.items[el.id].unrealised_pnl >= 0 ? styles.green : styles.red}`}>{gp(analytics.items[el.id].unrealised_pnl)}</span>
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