import { useContext, useMemo } from 'react';
import { Context } from 'themes';
import { OSRS_GE_TIMESERIES } from '@redux/types/osrs';
import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts';
import { UK } from '@utils/time';
import Label3 from '@components/labels/Style3';

interface Props {
  timeseries: OSRS_GE_TIMESERIES[]
};

const calculateSTRENGTH = (timeseries: OSRS_GE_TIMESERIES[]) => {
    const wins = [{time: 0, strength: 0}];
    for(const i in timeseries){
      const index = Number(i);
      if(timeseries.length === index+1 ) break;
      const [itemCurrent, itemFuture] = [timeseries[index], timeseries[index+1]]; 
      const [current, future] = [itemCurrent.avgHighPrice, itemFuture.avgHighPrice];
      if(current === future){
        wins.push({
          time: itemCurrent.timestamp,
          strength: wins[index].strength
        })
      } else if(current < future) {
        wins.push({
          time: itemCurrent.timestamp,
          strength: wins[index].strength+1
        })
      } else {
        wins.push({
          time: itemCurrent.timestamp,
          strength: wins[index].strength-1
        })
      };
    }
    return wins;
  };
  
const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div>
          <p>{UK(new Date(data.time*1000))}</p>
          <p>Strength {data.strength}</p>
          {data.strength >= 10 ? <Label3 name={data.strength >= 7 ? "Greed" : ""} color="green" /> : ""}
          {data.strength <= -10 ? <Label3 name={data.strength <= -7 ? "Fear" : ""} color="red" /> : ""}
        </div>
      );
    }
    return null;
};

const Strength = ({timeseries}: Props) => {

    const {selected} = useContext(Context);

    const data = useMemo(() => calculateSTRENGTH(timeseries), [timeseries]); 

    const latest = data.length ? data.slice(-8).map(el => el.strength) : [];

    return (
        <div>
          <Label3 color="light" name="Strength" value={`[ ${latest.join(", ")} ]`}   style={{paddingBottom: "0.5rem"}}/>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={data} margin={{top: 10, right: 0, left: -30, bottom: 10}}>
              <XAxis dataKey="time" tickFormatter={(time) => UK(new Date(time*1000))} minTickGap={50} fontSize={12} padding={{right: 20}}/>
              <YAxis dataKey="strength" tickFormatter={(el) => el.toFixed(0)} domain={["auto", "auto"]} fontSize={12}/>
              <Area dataKey="strength" opacity={0.5} stroke={selected[0]} fill={selected[1]} />
              <Tooltip content={<CustomToolTips payload={data}/>}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
    )
};

export default Strength