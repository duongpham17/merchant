import React, { createContext, useMemo, useState } from 'react';
import { useAppSelector } from '@redux/hooks/useRedux';
import { OSRS_GE_LATEST } from '@redux/types/osrs';
import OsrsGeItems, {OSRS_GE_ITEM} from '@data/osrs-ge';
import useForm from '@hooks/useForm';
import { gemargin } from '@utils/osrs';

export interface ExtendedOsrsGeItems extends OSRS_GE_ITEM {
  margin: number;
};  

export interface PropsTypes {
  latest: OSRS_GE_LATEST[] | [],
  sorted: ExtendedOsrsGeItems[] | [],
  values: { lowest: number; highest: number },
  edited:boolean,
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  onChange: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
  onSubmit: (event: React.SyntheticEvent<Element, Event>) => Promise<void>
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
  latest: [],
  sorted: [],
  values: { lowest: 0, highest: 0 },
  edited: false,
  page: 0,
  setPage: () => "",
  onChange: () => "",
  onSubmit: async () => {},
});

const UseContextItems = ({children}: {children: React.ReactNode}) => {

    const [page, setPage] = useState(0);

    const {latest} = useAppSelector(state => state.osrs);

    const getLocalMargins = localStorage.getItem("ge-item-sort-margin");
  
    const localMarginValues = getLocalMargins ? getLocalMargins.split(",") : [0, 100000];
  
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
          items.push({
            ...x, 
            margin: !margin ? 0 : margin,
            limit: OsrsGeItems.find(el => el.id === x.id)?.limit || 0
          })
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

    const value = {
      sorted,
      values,
      onChange,
      onSubmit,
      edited,
      latest,
      page, 
      setPage,
    };

    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    )
}

export default UseContextItems