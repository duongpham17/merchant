import { useContext } from 'react';
import { Context } from '../Context';

import Label2 from '@components/labels/Style2';

import Rsi from './Rsi';
import Strength from './Strength';
import Time from './Time';
import Prices from './Prices';

const Chart = () => {

    const { timeInterval, setTimeInterval, timeseries, error } = useContext(Context);

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