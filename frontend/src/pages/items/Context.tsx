import React, { createContext, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import Items from '@redux/actions/items';
import { IItems, UniqueItem } from '@redux/types/items';
import { OSRS_GE_LATEST } from '@redux/types/osrs';
import { useLocation } from 'react-router-dom';
import useOpen from '@hooks/useOpen';
import useQuery from '@hooks/useQuery';

export interface PropsTypes {
    items: IItems[] | null,
    unique: UniqueItem[] | null,
    latest: OSRS_GE_LATEST[] | [],
    quickList: {id: number, icon: string}[] | [],
    openLocal: string,
    onSelectItem: (id: number, icon: string) => void
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    items: null,
    latest: [],
    unique: null,
    openLocal: "",
    quickList: [],
    onSelectItem: (id, icon) => "",
});

const UseContextItems = ({children}: {children: React.ReactNode}) => {

    const location = useLocation();

    const dispatch = useAppDispatch();

    const { items, unique } = useAppSelector(state => state.items);

    const { latest } = useAppSelector(state => state.osrs);

    const { onOpenLocal, openLocal } = useOpen({local: "ge-item"});

    const { setQuery } = useQuery();

    const savedDataString = localStorage.getItem("ge-item-saved");
    const initialQuickList = savedDataString ? JSON.parse(savedDataString) : [];
    const [quickList, setQuickList] = useState(initialQuickList);

    useEffect(() => {
        const id = location.search.slice(4);
        dispatch(Items.find(`id=${id}`));
        dispatch(Items.unique());
    }, [dispatch, location]);

    const onSelectItem = (id: number, icon: string) => {
        const already_selected = id === quickList[0].id;
        if(already_selected) return;

        const selected = {id, icon};
        setQuery("id", id);
        onOpenLocal(id);
        if(!quickList){
            setQuickList([{id, icon}]);
            return localStorage.setItem("ge-item-saved", JSON.stringify([selected]))
        };

        const saved: {id: number, icon: string}[] = !quickList ? unique : quickList;
        const is_saved = saved.map(el => el.id).includes(id);
        const new_saved = is_saved ? [selected, ...saved.filter(el => el.id !== id)] : [selected];
        setQuickList(new_saved);
        return localStorage.setItem("ge-item-saved", JSON.stringify(new_saved));
    };

    const value = {
        items, 
        latest,
        unique,
        quickList,
        openLocal,
        onSelectItem,
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default UseContextItems