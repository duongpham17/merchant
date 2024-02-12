import styles from './Search.module.scss';
import react, {useContext} from 'react';
import { Link } from 'react-router-dom';

import { Context } from '../Context';

import { firstcaps } from '@utils/functions';
import { gp } from '@utils/osrs';

import Search from '@components/search/Search';
import Spinner from '@components/loading/Spinner';

const SearchIndex = () => {

    const {sorted, latest, page} = useContext(Context);

    return (!sorted.length ? <Spinner size={20} center /> :
        
    <Search initialData={sorted} dataKey={"name"}>
        {(data) => 
            <table className={styles.container}>
                <thead>
                    <tr>
                    <th>Item</th>
                    <th></th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Margin</th>
                    </tr>
                </thead>
                <tbody>
                    {data.slice(page*100, (page+1)*100).map((item) => (
                    <tr key={item.id}>
                        <td className={styles.image}>
                        <Link to={`/item/${item.id}`} target="_blank" rel="noopener noreferrer">
                            <img src={`https://oldschool.runescape.wiki/images/${firstcaps(item.icon.replaceAll(" ", "_"))}`} alt="osrs"/>
                        </Link>
                        </td>
                        <td className={styles.name}>
                        <Link to={`/item/${item.id}`} target="_blank" rel="noopener noreferrer">
                            {`${firstcaps(item.name)} [ ${item.limit} ]`}
                        </Link>
                        </td>
                        <td>{gp(latest[item.id]?.high)}</td>
                        <td>{gp(latest[item.id]?.low)}</td>
                        <td className={item.margin > 0 ? styles.profit : styles.loss}>{gp(item.margin)}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        }
    </Search>
  )
}

export default SearchIndex