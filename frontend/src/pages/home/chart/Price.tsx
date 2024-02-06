import { OSRS_GE_ITEM } from '@data/osrs-ge';
import { OSRS_GE_TIMESERIES } from '@redux/types/osrs';
import { UK } from '@utils/time';
import { gp, gemargin } from '@utils/osrs';

import Label from '@components/labels/Style2';

import {Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';

interface Props {
    item: OSRS_GE_ITEM,
    timeseries: OSRS_GE_TIMESERIES[]
};

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div>
          <p>{UK(new Date(data.timestamp*1000))}</p>
          <Label name="Margin" value={gp(gemargin(data.avgHighPrice, data.avgLowPrice))} color={(data.avgHighPrice - data.avgLowPrice) >= 0 ? "green" : "red"} />
          <Label name="Avg High Price" value={gp(data.avgHighPrice)}  />
          <Label name="Avg Low Price" value={gp(data.avgLowPrice)} />
          <Label name="High Price Vol" value={gp(data.highPriceVolume)} />
          <Label name="Low Price Vol" value={gp(data.lowPriceVolume)} />
        </div>
      );
    }
    return null;
};

const Price = ({timeseries}: Props) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timeseries} margin={{top: 30, right: 0, left: -10, bottom: 20}}>
        <XAxis dataKey="timestamp" tickFormatter={(time: number) => UK(new Date(time*1000))} minTickGap={50} fontSize={12} padding={{right: 20}}/>
        <YAxis domain={["auto", "auto"]} fontSize={12} tickFormatter={(price: number) => gp(price) } />
        <Tooltip content={<CustomToolTips payload={timeseries}/>}/>
        <Line type="monotone" dataKey="avgHighPrice" stroke="#54d26f" dot={false} />
        <Line type="monotone" dataKey="avgLowPrice" stroke="#e16363" dot={false} />
        </LineChart>
    </ResponsiveContainer>  
  )
}

export default Price