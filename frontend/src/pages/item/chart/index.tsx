import { OSRS_GE_ITEM } from '@data/osrs-ge';
import { useEffect, useState } from 'react';
import { OSRS_GE_TIMESERIES } from '@redux/types/osrs';
import Osrs from '@redux/actions/osrs';

import Label2 from '@components/labels/Style2';

import Rsi from './Rsi';
import Strength from './Strength';
import Time from './Time';
import Prices from './Prices';

interface Props {
    item: OSRS_GE_ITEM,
};

const Chart = ({item}: Props) => {

    const [timeseries, setTimeseries] = useState<OSRS_GE_TIMESERIES[]>([]);

    const [timeInterval, setTimeInterval] = useState("5m");

    const [error, setError] = useState(false);

    useEffect(() => {
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
    }, [item.id, timeInterval]);

    return (
        <>

        { error
        ? 
            <Label2 name="Could not find any data" color="red" />
        :
            <>
                <Time timeInterval={timeInterval} setTimeInterval={setTimeInterval}/>

                <Prices timeseries={timeseries} />

                <Rsi timeseries={timeseries} />

                <Strength timeseries={timeseries} />
            </>
            }

        </>
    )
}

export default Chart