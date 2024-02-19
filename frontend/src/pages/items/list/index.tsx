import styles from './List.module.scss';
import { useContext } from 'react';
import { Context } from '../Context';
import { firstcaps } from '@utils/functions';
import { MdOutlineUnfoldMore } from 'react-icons/md';

import SlideIn from '@components/slidein/Style1';

import Anaylsis from './Anaylsis';

const ListIndex = () => {

    const {openLocal, onSelectItem, quickList} = useContext(Context);

    return (
        <div className={styles.container}>

            <div className={styles.ids}>
                {quickList.slice(0, 15).map(el => 
                    <button className={`${styles.button} ${el.id.toString() === openLocal.toString() ? styles.selected : ""}`} key={el.id} onClick={() => onSelectItem(el.id, el.icon)}>
                        <img src={`https://oldschool.runescape.wiki/images/${firstcaps(el.icon.replaceAll(" ", "_"))}`} alt="osrs"/>
                    </button>
                )}
            </div>

            <div className={styles.slide}>
                <SlideIn
                    width={300} 
                    icon={<button className={styles.button}><MdOutlineUnfoldMore /></button>} 
                    iconOpen={""}
                >
                    <Anaylsis />
                </SlideIn>
            </div>

        </div>
    )
}

export default ListIndex