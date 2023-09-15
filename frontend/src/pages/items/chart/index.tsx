import { OSRS_GE_TIMESERIES } from '@redux/types/osrs';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import Osrs from '@redux/actions/osrs';
import useOpen from '@hooks/useOpen';
import useQuery from '@hooks/useQuery';
import { UK } from '@utils/time';
import { gp } from '@utils/osrs';

import Label from '@components/labels/Style2'
import Select from '@components/options/Style1';

import {Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';

interface Props {
  timeseries: OSRS_GE_TIMESERIES[]
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

const ChartChildren = ({timeseries}: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={timeseries} margin={{top: 30, right: 0, left: -25, bottom: 20}}>
        <XAxis dataKey="timestamp" tickFormatter={(time: number) => UK(new Date(time*1000))} minTickGap={50} fontSize={12} padding={{right: 20}}/>
        <YAxis domain={["auto", "auto"]} fontSize={12} tickFormatter={(price: number) => gp(price) } />
        <Tooltip content={<CustomToolTips payload={timeseries}/>}/>
        <Line type="monotone" dataKey="avgHighPrice" stroke="#54d26f" dot={false} />
        <Line type="monotone" dataKey="avgLowPrice" stroke="#e16363" dot={false} />
      </LineChart>
    </ResponsiveContainer>  
  )
};

const ChartIndex = () => {

  const {timeseries} = useAppSelector(state => state.osrs);

  const dispatch = useAppDispatch();

  const {openLocal: openLocalGeItem} = useOpen({local: "ge-item"});

  const {openLocal: openLocalTimeseries, onOpenLocal: onOpenLocalTimeseries} = useOpen({local: "ge-item-timeseries"});

  const {getQueryValue, setQuery} = useQuery();

  const item_id = getQueryValue("id");

  useEffect(() => {
    dispatch(Osrs.timeseries(item_id || openLocalGeItem || "", openLocalTimeseries || "5min"));
  }, [dispatch, item_id, openLocalGeItem, openLocalTimeseries]);

  useEffect(() => {
    if(item_id) return;
    setQuery("id", openLocalGeItem);
  }, [openLocalGeItem, setQuery, item_id]);

  return (
    <>
      <Select 
        items={["5m","1h", "6h", "24h"]}
        onClick={(time) => onOpenLocalTimeseries(time.toString())}
        selected={`Time Interval ${openLocalTimeseries || "5m"}`}
        color="plain"
      />

      <ChartChildren 
        timeseries={timeseries} 
      />
    </>
  )
}

export default ChartIndex