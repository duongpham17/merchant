import { OSRS_GE_TIMESERIES } from '@redux/types/osrs';
import { UK } from '@utils/time';
import { gemargin, getax, gp } from '@utils/osrs';

import Label2 from '@components/labels/Style2';
import Flex from '@components/flex/Between';

import {Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';
import Message from '@components/hover/Message';

interface Props {
  timeseries: OSRS_GE_TIMESERIES[]
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

const Chart = ({timeseries}: Props) => {

  const prices = {
    highest: timeseries.slice(-1)[0]?.avgHighPrice || 0,
    lowest: timeseries.slice(-1)[0]?.avgLowPrice || 0,
    lowestV: timeseries.slice(-1)[0]?.lowPriceVolume || 0,
    highestV: timeseries.slice(-1)[0]?.highPriceVolume || 0
  }

  return (
    <>
      <Flex style={{padding: "1rem 0"}}>
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
              name="VHigh" 
              value={<Message side="left" message={`Volume ${prices.highestV.toLocaleString()}`}>{gp(prices.highestV)}</Message>} 
            />
            <Label2
              name="VLow" 
              value={<Message side="left" message={`Volume ${prices.lowestV.toLocaleString()}`}>{gp(prices.lowestV)}</Message>} 
            />
          </Flex>

          <Flex>
            <div></div>
            <Label2 
                name={`Margin`}
                value={
                    <Message side="left" message={`Tax ${gp(getax(prices.highest).tax_per_item)}`}>
                        <Label2 
                          name="" 
                          value={gemargin(prices.highest, prices.lowest).toLocaleString()} 
                          color={gemargin(prices.highest, prices.lowest) >= 0 ? "green" : "red"}
                        />
                    </Message>
                }
            /> 
          </Flex>
      </Flex>

      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={timeseries} margin={{top: 10, right: 0, left: -20, bottom: 10}}>
          <XAxis dataKey="timestamp" tickFormatter={(time: number) => UK(new Date(time*1000))} minTickGap={50} fontSize={12} padding={{right: 20}}/>
          <YAxis domain={["auto", "auto"]} fontSize={12} tickFormatter={(price: number) => gp(price) } />
          <Tooltip content={<CustomToolTips payload={timeseries}/>}/>
          <Line type="monotone" dataKey="avgHighPrice" stroke="#54d26f" dot={false} />
          <Line type="monotone" dataKey="avgLowPrice" stroke="#e16363" dot={false} />
        </LineChart>
      </ResponsiveContainer>  

    </>
  )
};

export default Chart