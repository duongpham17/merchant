import React, { createContext, useMemo } from 'react';
import { useAppSelector } from '@redux/hooks/useRedux';
import { IItems } from '@redux/types/items';
import { OSRS_GE_LATEST } from '@redux/types/osrs';

export interface Filtered {
    id: number;
    icon: string,
    name: string,
    items: IItems[];
};

export interface PropsTypes {
    items: IItems[] | null,
    latest: OSRS_GE_LATEST[] | [],
    filtered: Filtered[] | []
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    items: null,
    latest: [],
    filtered: []
});

const UseContextItems = ({children}: {children: React.ReactNode}) => {

    const { items } = useAppSelector(state => state.items);

    const { latest } = useAppSelector(state => state.osrs);

    const filtered = useMemo(() => {
        const data: {
            id: number;
            icon: string,
            name: string,
            items: IItems[];
        }[] = [];
        if(items) {
            for(let x of items){
                const itemIndex = data.findIndex(el => el.id === x.id);
                if(itemIndex === -1){
                    data.push({
                        id: x.id, 
                        name: x.name, 
                        icon: x.icon, 
                        items: [x]
                    });
                } else {
                    data[itemIndex].items.push(x);
                };
            };
            return data;
        } else {
            return [];
        };
    }, [items]);

    const value = {
        items, 
        latest,
        filtered
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default UseContextItems