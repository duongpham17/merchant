import items, { OSRS_GE_ITEM } from '@data/osrs-ge';
import { useEffect, useState } from 'react';
import { OSRS_GE_TIMESERIES } from '@redux/types/osrs';
import Osrs from '@redux/actions/osrs';

import { UK } from '@utils/time';
import { gemargin, getax, gp } from '@utils/osrs';

import Label2 from '@components/labels/Style2';
import Select from '@components/options/Style1';
import Flex from '@components/flex/Between';
import Line1 from '@components/line/Style1';

import {Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';

import Rsi from './Rsi';
import Strength from './Strength';

import Message from '@components/hover/Message';

interface Props {
    item: OSRS_GE_ITEM,
};

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div>
          <p>{UK(new Date(data.timestamp*1000))}</p>
          <Label2 name="Margin" value={gp(data.avgHighPrice - data.avgLowPrice)} color={(data.avgHighPrice - data.avgLowPrice) >= 0 ? "green" : "red"} />
          <Label2 name="Avg High Price" value={gp(data.avgHighPrice)}  />
          <Label2 name="Avg Low Price" value={gp(data.avgLowPrice)} />
          <Label2 name="High Price Vol" value={gp(data.highPriceVolume)} />
          <Label2 name="Low Price Vol" value={gp(data.lowPriceVolume)} />
        </div>
      );
    }
    return null;
};

const Chart = ({item}: Props) => {

    const GeItem = items.find(el => el.id === item.id)

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

    const prices = {
        highest: timeseries.slice(-1)[0]?.avgHighPrice || 0,
        lowest: timeseries.slice(-1)[0]?.avgLowPrice || 0,
        lowestV: timeseries.slice(-1)[0]?.lowPriceVolume || 0,
        highestV: timeseries.slice(-1)[0]?.highPriceVolume || 0
    }

    return (
        <>

       { error
       ? 
        <Label2 name="Could not find any data" color="red" />
       :
        <>
            <Flex style={{gap: "1rem"}}>
                <Label2
                    name="High" 
                    value={<Message side="left" message={`${prices.highest.toLocaleString()}`}>{gp(prices.highest)}</Message>} 
                />
                <Label2
                    name="Low" 
                    value={<Message side="left" message={`${prices.lowest.toLocaleString()}`}>{gp(prices.lowest)}</Message>} 
                />
                <Label2 
                    name={`Margin`}
                    value={
                        <Message side="left" message={`Tax ${gp(getax(prices.highest).tax_per_item)}`}>
                            <Label2 
                                name="" 
                                value={(gemargin(prices.highest, prices.lowest).toLocaleString())} 
                                color={gemargin(prices.highest, prices.lowest) >= 0 ? "green" : "red"}
                            />
                        </Message>
                    }
                /> 
            </Flex>

            <Line1 />

            <Flex>
                <Label2
                    name="High Vol" 
                    value={<Message side="left" message={`${prices.highestV.toLocaleString()}`}>{gp(prices.highestV)}</Message>} 
                    />
                <Label2
                    name="Low Vol" 
                    value={<Message side="left" message={`${prices.lowestV.toLocaleString()}`}>{gp(prices.lowestV)}</Message>} 
                />
                <Label2
                    name="High Alch" 
                    value={GeItem?.highalch.toLocaleString() || 0}
                />
            </Flex>

            <Line1/>

            <Select 
                items={["5m","1h", "6h", "24h"]}
                onClick={(time) => setTimeInterval(time.toString())}
                selected={`Time Interval ${timeInterval}`}
                color="plain"
            />

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeseries} margin={{top: 30, right: 0, left: -10, bottom: 20}}>
                <XAxis dataKey="timestamp" tickFormatter={(time: number) => UK(new Date(time*1000))} minTickGap={50} fontSize={12} padding={{right: 20}}/>
                <YAxis domain={["auto", "auto"]} fontSize={12} tickFormatter={(price: number) => gp(price) } />
                <Tooltip content={<CustomToolTips payload={timeseries}/>}/>
                <Line type="monotone" dataKey="avgHighPrice" stroke="#54d26f" dot={false} />
                <Line type="monotone" dataKey="avgLowPrice" stroke="#e16363" dot={false} />
                </LineChart>
            </ResponsiveContainer>  

            <Rsi timeseries={timeseries} />

            <Strength timeseries={timeseries} />
        </>
        }

        </>
    )
}

export default Chart