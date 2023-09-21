import { OSRS_GE_ITEM } from '@data/osrs-ge';
import { useEffect, useState } from 'react';
import { OSRS_GE_TIMESERIES } from '@redux/types/osrs';
import Osrs from '@redux/actions/osrs';

import { UK } from '@utils/time';
import { gp } from '@utils/osrs';

import Label from '@components/labels/Style2';
import Select from '@components/options/Style1';

import {Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';

import Rsi from './Rsi';

interface Props {
    item: OSRS_GE_ITEM,
};

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div>
          <p>{UK(new Date(data.timestamp*1000))}</p>
          <Label name="Margin" value={gp(data.avgHighPrice - data.avgLowPrice)} color={(data.avgHighPrice - data.avgLowPrice) >= 0 ? "green" : "red"} />
          <Label name="Avg High Price" value={gp(data.avgHighPrice)}  />
          <Label name="Avg Low Price" value={gp(data.avgLowPrice)} />
          <Label name="High Price Vol" value={gp(data.highPriceVolume)} />
          <Label name="Low Price Vol" value={gp(data.lowPriceVolume)} />
        </div>
      );
    }
    return null;
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
        <Label name="Could not find any data" color="red" />
       :
        <>
            <Select 
                items={["5m","1h", "6h", "24h"]}
                onClick={(time) => setTimeInterval(time.toString())}
                selected={`Time Interval ${timeInterval}`}
                color="plain"
            />

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeseries} margin={{top: 30, right: 0, left: -10, bottom: 20}}>
                <XAxis dataKey="timestamp" tickFormatter={(time: number) => UK(new Date(time*1000))} minTickGap={50} fontSize={12} padding={{right: 20}}/>
                <YAxis domain={["auto", "auto"]} fontSize={12} tickFormatter={(price: number) => gp(price) } />
                <Tooltip content={<CustomToolTips payload={timeseries}/>}/>
                <Line type="monotone" dataKey="avgHighPrice" stroke="#54d26f" dot={false} />
                <Line type="monotone" dataKey="avgLowPrice" stroke="#e16363" dot={false} />
                </LineChart>
            </ResponsiveContainer>  

            <Rsi 
                timeseries={timeseries}
            />
        </>
        }

        </>
    )
}

export default Chart