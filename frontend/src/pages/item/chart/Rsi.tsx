import { useContext } from 'react';
import { Context } from 'themes';
import { OSRS_GE_TIMESERIES } from '@redux/types/osrs';
import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { UK } from '@utils/time';
import Label3 from '@components/labels/Style3';
import { gp } from '@utils/osrs';

interface Props {
  timeseries: OSRS_GE_TIMESERIES[]
};
  
const calculateRSI = (prices: [number, number][], period: number) => {

    let avg_gains = 0;
    let avg_losses = 0
  
    // Calculate the initial average gain and average loss over the period
    for(let i in prices){
      const index = Number(i);
  
      if(index === 0) continue;
      if(index >= period) break;
      
      const price_change = prices[index][1] - prices[index-1][1];
  
      if(price_change > 0){
        avg_gains += price_change
      } else {
        avg_losses += Math.abs(price_change)
      };
    }
  
    avg_gains /= period;
    avg_losses /= period;
  
    const RSI = []
  
    // Calculate RSI for the remaining data
    for (let i = period; i < prices.length; i++) {
      const priceChange = prices[i][1] - prices[i - 1][1];
      let gain = 0;
      let loss = 0;
  
      if (priceChange > 0) {
        gain = priceChange;
      } else {
        loss = -priceChange;
      }
  
      avg_gains = (avg_gains * (period - 1) + gain) / period;
      avg_losses = (avg_losses * (period - 1) + loss) / period;
  
      const relativeStrength = avg_gains / avg_losses;
      const rsi = 100 - (100 / (1 + relativeStrength));
  
      RSI.push({
        price: prices[i][1],
        time: prices[i][0],
        rsi: Number(rsi.toPrecision(2))
      });
    }
  
    return RSI;
};
  
const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div>
          <p>{UK(new Date(data.time*1000))}</p>
          <p>RSI {data.rsi.toFixed(2)}</p>
          <p>Price {gp(data.price.toFixed(2))}</p>
          {data.rsi >= 70 ? <Label3 name={data.rsi >= 70 ? "Over Bought" : ""} color="green" /> : ""}
          {data.rsi <= 30 ? <Label3 name={data.rsi <= 30 ? "Over Sold" : ""} color="red" /> : ""}
        </div>
      );
    }
    return null;
};

const Rsi = ({timeseries}: Props) => {

    const {selected} = useContext(Context)

    const prices: [number, number][] = timeseries.map(el => [el.timestamp,  Math.floor((el.avgHighPrice + el.avgLowPrice) / 2)]);

    const rsi = calculateRSI(prices, 14);

    const latest = rsi.length ? rsi.slice(-8).map(el => el.rsi) : [];

    return (
        <div>
          <Label3 color="light" name="RSI" value={`[ ${latest.join(", ")} ]`}  style={{paddingBottom: "0.5rem"}}/>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={rsi} margin={{top: 10, right: 0, left: -30, bottom: 10}}>
              <XAxis dataKey="time" tickFormatter={(time) => UK(new Date(time*1000))} minTickGap={50} fontSize={12} padding={{right: 20}}/>
              <YAxis dataKey="rsi" tickFormatter={(el) => el.toFixed(0)} domain={[0, 100]} fontSize={12}/>
              <Area dataKey="rsi" opacity={0.5} stroke={selected[0]} fill={selected[1]} />
              <Tooltip content={<CustomToolTips payload={rsi}/>}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
    )
};

export default Rsi