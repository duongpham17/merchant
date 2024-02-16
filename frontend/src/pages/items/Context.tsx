import React, { createContext, useEffect } from 'react';
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
    openLocal: any,
    openLocalSaved: any,
    onSelectItem: (id: string) => void
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    items: null,
    latest: [],
    unique: null,
    openLocal: null,
    openLocalSaved: null,
    onSelectItem: () => "",
});

const UseContextItems = ({children}: {children: React.ReactNode}) => {

    const location = useLocation();

    const dispatch = useAppDispatch();

    const { items, unique } = useAppSelector(state => state.items);

    const { latest } = useAppSelector(state => state.osrs);

    const { onOpenLocal: onOpenLocalSaved, openLocal: openLocalSaved } = useOpen({local: "ge-item-saved"});

    const { onOpenLocal, openLocal } = useOpen({local: "ge-item"});

    const { setQuery } = useQuery();

    useEffect(() => {
        const id = location.search.slice(4);
        dispatch(Items.find(`id=${id}`));
        dispatch(Items.unique());
    }, [dispatch, location]);

    const onSelectItem = (id: string) => {
        onOpenLocal(id);
        setQuery("id", id);
        const saved: string[] = openLocalSaved.split(",");
        const list = saved.length >= 4 ? `${id},${saved.slice(0, 3).join(",")}` : `${id},${saved.join(",")}`;
        onOpenLocalSaved(list);
    };

    const value = {
        items, 
        latest,
        unique,
        openLocal,
        onSelectItem,
        openLocalSaved
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default UseContextItems