import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@redux/hooks/useRedux';
import OsrsGeItems, {OSRS_GE_ITEM} from '@data/osrs-ge';

import { firstcaps } from '@utils/functions';
import { gp, gemargin } from '@utils/osrs';

import Search from '@components/search/Search';
import Pagination from '@components/pagination/Style1';
import Label3 from '@components/labels/Style3'
import Flex from '@components/flex/Between';
import Line from '@components/line/Style1';
import Observer from '@components/observer/Observer';
import Container from '@components/containers/Style1';
import Message from '@components/hover/Message';

interface ExtendedOsrsGeItems extends OSRS_GE_ITEM {
    margin: number;
  };

const Home = () => {

  const {latest} = useAppSelector(state => state.osrs);

  const margins = useMemo(() => {
      const items: ExtendedOsrsGeItems[] = [];
      for(let x of OsrsGeItems){
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
  }, [latest]);

  return (
    <Search initialData={margins} dataKey={"name"}>
        {(data) => 
        <Pagination data={data} show={10} top>
            {(item) => 
            <Observer key={item.id}>
                <Container background='dark' hover>
                    <Link to={`/item/${item.id}`}>
                        <Flex>
                            <img 
                                src={`https://oldschool.runescape.wiki/images/${firstcaps(item.icon.replaceAll(" ", "_"))}`} 
                                alt="osrs"
                            />
                            <p>{item.name}</p>
                        </Flex>
                        <Line/>
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

export default Home