import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import Favourites from '@redux/actions/favourites';
import OsrsGeItems, {OSRS_GE_ITEM} from '@data/osrs-ge';

import { firstcaps } from '@utils/functions';
import { gp, gemargin } from '@utils/osrs';

import { FaStar } from 'react-icons/fa';

import Spinner from '@components/loading/Spinner';
import Search from '@components/search/Search';
import Pagination from '@components/pagination/Style1';
import Label3 from '@components/labels/Style3'
import Flex from '@components/flex/Between';
import FlexSingle from '@components/flex/Single';
import Line from '@components/line/Style1';
import Observer from '@components/observer/Observer';
import Container from '@components/containers/Style1';
import Message from '@components/hover/Message';

interface ExtendedOsrsGeItems extends OSRS_GE_ITEM {
    margin: number;
};

const FavouritesIndex = () => {

    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    const {latest} = useAppSelector(state => state.osrs);

    const {favourites} = useAppSelector(state => state.favourites);

    const data = useMemo(() => {
        setLoading(true);
        if(!favourites) {
            setLoading(false);
            return []
        };
        const items = [];
        for(let x of OsrsGeItems){
            if(favourites.includes(x.id)) items.push(x);
        };
        setLoading(false);
        return items;
    }, [favourites]);

    const margins = useMemo(() => {
        const items: ExtendedOsrsGeItems[] = [];
        for(let x of data){
          const highest = latest[x.id]?.high || 0;
          const lowest = latest[x.id]?.low || 0;
          const margin = gemargin(highest, lowest);
          items.push({
            ...x, 
            margin: !margin ? 0 : margin,
            limit: OsrsGeItems.find(el => el.id === x.id)?.limit || 0
          })
        };
        return items.sort((a, b) => b.margin - a.margin)
    }, [latest, data]);

    return ( loading ? <Spinner size={20} center /> :
        <Search initialData={margins} dataKey={"name"}>
            {(data) => 
            <Pagination data={data} show={10} top>
                {(item) => 
                <Observer key={item.id}>
                    <Container background='dark' hover>
                        <Flex>
                            <FlexSingle>
                                <img 
                                    src={`https://oldschool.runescape.wiki/images/${firstcaps(item.icon.replaceAll(" ", "_"))}`} 
                                    alt="osrs"
                                />
                                <p>{item.name}</p>
                            </FlexSingle>
                            <button onClick={() => dispatch(Favourites.remove(item))}>
                                <FaStar color="yellow"/>
                            </button>
                        </Flex>
                        <Line/>
                        <Link to={`/item/${item.id}`}>
                            <Flex>
                                <Message message={`Highest`}>
                                    <Label3 
                                        name={`${gp(latest[item.id]?.high)}`}  
                                        color="light"
                                    />
                                </Message>
                                <Message message={`Lowest`}>
                                    <Label3 
                                        name={`${gp(latest[item.id]?.low)}`} 
                                        color="light"
                                    />
                                </Message>
                                <Message message={`Margin`}>
                                    <Label3 
                                        name={gp(item.margin)} 
                                        color={item.margin >= 0 ? "green" : "red" }
                                    />
                                </Message>
                            </Flex>
                        </Link>
                    </Container>
                </Observer>
                }
            </Pagination>
            }
        </Search>
    )
}

export default FavouritesIndex