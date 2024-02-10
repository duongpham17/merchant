import Select from '@components/options/Style1';

interface Props {
    setTimeInterval: React.Dispatch<React.SetStateAction<string>>;
    timeInterval: string
}

const Time = ({setTimeInterval, timeInterval}: Props) => {
  return (
    <Select 
        items={["5m","1h", "6h", "24h"]}
        onClick={(time) => setTimeInterval(time.toString())}
        selected={`Time Interval ${timeInterval}`}
        color="plain"
    />
  )
}

export default Time