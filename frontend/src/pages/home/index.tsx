import styles from './index.module.scss';
import { useMemo } from 'react';
import { useAppSelector } from '@redux/hooks/useRedux';
import OsrsGeItems, {OSRS_GE_ITEM} from '@data/osrs-ge';

import { firstcaps } from '@utils/functions';
import { gp, gemargin } from '@utils/osrs';

import Search from '@components/search/Search';
import Pagination from '@components/pagination/Style1';
import Label3 from '@components/labels/Style3'
import Label2 from '@components/labels/Style2'
import Flex from '@components/flex/Style1';
import Line from '@components/line/Style1';
import Input from '@components/inputs/Input';
import Button from '@components/buttons/Button';
import Spinner from '@components/loading/Spinner';

import useForm from '@hooks/useForm';
import Summary from '@components/summary/Style1';

interface ExtendedOsrsGeItems extends OSRS_GE_ITEM {
  margin: number;
};

const Home = () => {

  const {latest} = useAppSelector(state => state.osrs);

  const getLocalMargins = localStorage.getItem("ge-item-sort-margin");

  const localMarginValues = getLocalMargins ? getLocalMargins.split(",") : [0, 0];

  const initial_margin_values = {
    lowest: Number(localMarginValues[0]),
    highest: Number(localMarginValues[1])
  };

  const {values, onChange, onSubmit, edited} = useForm(initial_margin_values, callback);

  function callback(){
    localStorage.setItem("ge-item-sort-margin", `${values.lowest},${values.highest}`);
  };

  const margins = useMemo(() => {
    const calc_margins = () => {
      const items: ExtendedOsrsGeItems[] = [];
      for(let x of OsrsGeItems){
        const highest = latest[x.id]?.high || 0;
        const lowest = latest[x.id]?.low || 0;
        const margin = gemargin(highest, lowest);
        items.push({...x, margin: !margin ? 0 : margin})
      };
      return items;
    };
    return calc_margins();
  }, [latest]);

  const sorted = useMemo(() => {
    const calc_sort = (items: ExtendedOsrsGeItems[], lowest: number, highest: number ) => {
      const filtered = items.filter(item => item.margin <= highest && item.margin >= lowest);
      const high_to_low = filtered.sort((a, b) => b.margin - a.margin);
      return high_to_low
    };
    return calc_sort(margins, values.lowest, values.highest);
  }, [values, margins]);

  return (
    <div className={styles.container}>

      <Summary title="Margin" background='dark'>
        <form onSubmit={onSubmit}>
          <Flex>
            <Input 
              label1="Lowest"
              label2={`${gp(values.lowest)}`}
              type="number"
              name="lowest" 
              placeholder='...'
              value={values.lowest || ""} 
              onChange={onChange} 
            />
            <Input 
              label1="Highest"
              label2={`${gp(values.highest)}`}
              type="number"
              name="highest" 
              placeholder='...'
              value={values.highest || ""} 
              onChange={onChange} 
            />
          </Flex>
        {edited && 
          <Button 
            label1="save"
            type="submit"
            color="blue"
          />
          }
        </form>
      </Summary>

      {sorted.length 
        ?
        <Search initialData={sorted} dataKey={"name"}>
          {(data) => 
            <Pagination data={data} show={100} top>
              {(item, index) => 
                <div className={styles.element} key={item.id}>
                  <div className={styles.image}>
                    <img src={`https://oldschool.runescape.wiki/images/${firstcaps(item.icon.replaceAll(" ", "_"))}`} alt="osrs"/>
                    <Label3 name={`${index+1}. ${item.name}`} value={<button></button>} />
                  </div>
                  <Line/>
                  <Flex>
                    <Label2 name="Price" value={gp((latest[item.id]?.high + latest[item.id]?.low) / 2) || 0} />
                    <Label2 name="Highest" value={`${gp(latest[item.id]?.high)}`} color="green" />
                    <Label2 name="Lowest" value={`${gp(latest[item.id]?.low)}`} color="red" />
                    <Label2 name="Margin" value={gp(item.margin)} color={item.margin >= 0 ? "green" : "red" }/>
                  </Flex>
                </div>
              }
            </Pagination>
          }
        </Search>
        :
        <Spinner size={20} center />
      }

    </div>
  )
}

export default Home