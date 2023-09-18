import styles from './List.module.scss';
import { IItems } from '@redux/types/items';
import { firstcaps } from '@utils/functions';
import { gemargin, getax, gp } from '@utils/osrs';
import { MdOutlineUnfoldMoreDouble } from 'react-icons/md';
import { useAppSelector } from '@redux/hooks/useRedux';

import SlideIn from '@components/slidein/Style1';
import Message from '@components/hover/Message';
import Line from '@components/line/Style1';

import useOpen from '@hooks/useOpen';
import useQuery from '@hooks/useQuery';

interface Props {
    items: IItems[],
    itemsFiltered: {
        id: number;
        icon: string,
        name: string,
        items: IItems[];
    }[],
};

const ListIndex = ({itemsFiltered}: Props) => {

    const {onOpenLocal: onOpenLocalSaved, openLocal: openLocalSaved} = useOpen({local: "ge-item-saved"});

    const {onOpenLocal, openLocal} = useOpen({local: "ge-item"});

    const {setQuery} = useQuery();

    const {latest} = useAppSelector(state => state.osrs);

    const calc_cost_basis = (index: number, array: IItems[]) => {
        let [pnl, nqty] = [0, 0];
        for(let x of array.slice(index)){
          if(x.side === "sell") {
            nqty -= x.quantity;
            pnl -= x.sold * x.quantity;
          };
          if(x.side === "buy") {
            nqty += x.quantity;
            pnl += x.price * x.quantity;
          };
        };
        return Number((pnl / nqty).toFixed(2));
    };

    const cost_basis_latest = (items: IItems[]) => {
        let cost = 0;
        for(let i in items){
            const index = Number(i) 
            if(index === 0){
                cost =  Math.floor(calc_cost_basis(index, items));
                break
            }
        }
        return cost
    };

    const onSelectItem = (item: Props["itemsFiltered"][0]) => {
        onOpenLocal(item.id.toString());
        setQuery("id", item.id.toString());
        const saved: string[] = openLocalSaved.split(",");
        const list = saved.length >= 4 ? `${item.id},${saved.slice(0, 3).join(",")}` : `${item.id},${saved.join(",")}`;
        onOpenLocalSaved(list);
    };

    const sortItemsFiltered = () => {
        const saved: string[] = openLocalSaved.split(",");
        const removed = itemsFiltered.filter(el => !saved.includes(el.id.toString()));
        const find = itemsFiltered.filter(el => saved.includes(el.id.toString()));
        const newest = [...find, ...removed];
        return newest;
    };

    const marginItems = () => {
        const items = [];
        for(let x of itemsFiltered){
            items.push({
                ...x,
                margin: gemargin(latest[x.id].high, latest[x.id].low)
            })
        };
        return items.sort((a,b) => b.margin - a.margin);
    };

    const margin = marginItems();

    const sortedItems = sortItemsFiltered();

    const estimated_net_worth = () => {
        let [profit_n_loss, tax] = [0, 0];
        for(let x of itemsFiltered){
            x.items.forEach(item => {
                if(item.side === "sell"){
                    const calc = getax(item.sold, item.quantity);
                    profit_n_loss += calc.total_after_tax;
                    tax += calc.total_tax
                } else {
                    const calc = getax(latest[item.id].high, item.quantity)
                    profit_n_loss += calc.total_after_tax;
                    tax += calc.total_tax
                };
            })
        };
        return {
            profit_n_loss,
            tax
        };
    };

    const netWorth = estimated_net_worth();

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
                    icon={<button className={styles.button}><MdOutlineUnfoldMoreDouble /></button>} 
                    iconOpen={<Message message={`Tax ${gp(netWorth.tax)}`}>{gp(netWorth.profit_n_loss)} [ {itemsFiltered.length} ]</Message>}
                >
                    <div className={styles.items}>
                    {margin.map(el => 
                        <button key={el.id} onClick={() => onSelectItem(el)}>

                            <div className={styles.image}>
                                <img src={`https://oldschool.runescape.wiki/images/${firstcaps(el.icon.replaceAll(" ", "_"))}`} alt="osrs"/>
                            </div>
                            <div className={styles.information}>
                                <b>{firstcaps(el.name)}</b>
                                <Line/>
                                <Message message="Cost, High, Low" side="right"> 
                                <div>
                                    <span className={styles.cost}>{`[ ${gp(cost_basis_latest(el.items))}, `}</span>
                                    <span className={styles.high}>{`${gp(latest[el.id].high)},`}</span>
                                    <span className={styles.low}>{` ${gp(latest[el.id].low)} ]`}</span>
                                </div>
                                </Message>
                                <Line/>
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