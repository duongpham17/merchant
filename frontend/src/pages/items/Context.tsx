import React, { createContext, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import Items from '@redux/actions/items';
import { IItems } from '@redux/types/items';
import { OSRS_GE_LATEST } from '@redux/types/osrs';
import { useLocation } from 'react-router-dom';
import useOpen from '@hooks/useOpen';
import useQuery from '@hooks/useQuery';

export interface PropsTypes {
    items: IItems[] | null,
    latest: OSRS_GE_LATEST[] | [],
    quickList: {id: number, icon: string}[] | [],
    openLocal: string,
    onSelectItem: (id: number, icon: string) => void
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    items: null,
    latest: [],
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

    const [ quickList, setQuickList ] = useState(unique || []);

    useEffect(() => {
        const savedDataString = localStorage.getItem("ge-item-quick-saved-list");
        const initialQuickList: {id: number, icon: string}[] = savedDataString ? JSON.parse(savedDataString) : unique;
        setQuickList(initialQuickList);
    }, [unique]);

    useEffect(() => {
        const id = location.search.slice(4);
        dispatch(Items.find(`id=${id}`));
        dispatch(Items.unique());
    }, [dispatch, location]);

    const onSelectItem = (id: number, icon: string) => {
        if(!quickList) return;

        const already_selected = id === openLocal;
        if(already_selected) return;

        const selected = {id, icon};
        setQuery("id", id);
        onOpenLocal(id);
        if(!quickList){
            setQuickList([{id, icon}]);
            return localStorage.setItem("ge-item-quick-saved-list", JSON.stringify([selected]))
        };

        const is_saved = quickList.map(el => el.id).includes(id);
        const new_saved = is_saved ? [selected, ...quickList.filter(el => el.id !== id)] : [selected];
        setQuickList(new_saved);
        return localStorage.setItem("ge-item-quick-saved-list", JSON.stringify(new_saved));
    };

    const value = {
        items, 
        latest,
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