import Select from '@components/options/Style1';

interface Props {
    onOpenLocalTimeseries: (value: string, clear?: boolean) => void,
    openLocalTimeseries: any
}

const ChartIndex = ({onOpenLocalTimeseries, openLocalTimeseries} : Props) => {

  return (
    <Select 
        items={["5m","1h", "6h", "24h"]}
        onClick={(time) => onOpenLocalTimeseries(time.toString())}
        selected={`Time Interval ${openLocalTimeseries || "5m"}`}
        color="plain"
    />
  )
}

export default ChartIndex