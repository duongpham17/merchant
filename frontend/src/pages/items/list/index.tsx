import styles from './List.module.scss';
import { IItems } from '@redux/types/items';
import { firstcaps } from '@utils/functions';
import { gemargin, gp } from '@utils/osrs';
import { MdOutlineUnfoldMoreDouble } from 'react-icons/md';
import { useAppSelector } from '@redux/hooks/useRedux';

import SlideIn from '@components/slidein/Style1';

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
    }

    const sortedItems = sortItemsFiltered();

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
                    iconOpen={`${itemsFiltered.length}`}
                >
                    <div className={styles.items}>
                    {itemsFiltered.map(el => 
                        <button key={el.id} onClick={() => onSelectItem(el)}>
                            <img src={`https://oldschool.runescape.wiki/images/${firstcaps(el.icon.replaceAll(" ", "_"))}`} alt="osrs"/>
                            <div>
                                <p className={gemargin(latest[el.id].high, latest[el.id].low) >= 0 ? styles.green : styles.red}>
                                    {gp(gemargin(latest[el.id].high, latest[el.id].low))}
                                </p>
                                <p>{firstcaps(el.name)}</p>
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