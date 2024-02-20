import React, { createContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OSRS_GE_TIMESERIES } from '@redux/types/osrs';
import { OSRS_GE_ITEM } from '@data/osrs-ge';
import Osrs from '@redux/actions/osrs';
import GEOsrs from '@data/osrs-ge';

export interface PropsTypes {
    item: OSRS_GE_ITEM,
    error: boolean,
    timeseries:  OSRS_GE_TIMESERIES[] | [],
    timeInterval: string,
    setTimeInterval: React.Dispatch<React.SetStateAction<string>>,
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    error: false,
    timeseries: [],
    timeInterval: "",
    item: {highalch: 0,
        members: false,
        name: "",
        examine: "",
        id: 0,
        limit: 0,
        value: 0,
        icon: "",
        lowalch: 0},
    setTimeInterval: () => "",
});

const UseContextItems = ({children}: {children: React.ReactNode}) => {

    const [params] = [useParams()];

    const [timeseries, setTimeseries] = useState<OSRS_GE_TIMESERIES[]>([]);

    const [timeInterval, setTimeInterval] = useState("5m");

    const [item, setItem] = useState<OSRS_GE_ITEM>({
        highalch: 0,
        members: false,
        name: "",
        examine: "",
        id: 0,
        limit: 0,
        value: 0,
        icon: "",
        lowalch: 0
    });

    const [error, setError] = useState(false);

    useEffect(() => {

        const id: string = params.id || "";

        const item = GEOsrs.find(el => el.id.toString() === id);

        if(!item) return;

        setItem(item);

        try{
            (async () => {
                const timeseries = await Osrs.timeseriesId(item.id.toString(), timeInterval);
                const updated_timeseries = [];
                for(let x of timeseries){
                    if(x.avgHighPrice && x.avgLowPrice) updated_timeseries.push({...x})
                };
                setTimeseries(updated_timeseries);
                setError(false);
            })();
        } catch(err){
            setError(true);
            console.log("timeseries doesnt exist")
        }
    }, [timeInterval, params]);

    const value = {
        error,
        timeseries,
        timeInterval,
        setTimeInterval,
        item
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default UseContextItems