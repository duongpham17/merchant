import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import Osrs from '@redux/actions/osrs';
import useOpen from '@hooks/useOpen';
import useQuery from '@hooks/useQuery';

import Chart from './Chart';
import Rsi from './Rsi';
import Time from './Time';

const ChartIndex = () => {

  const {timeseries} = useAppSelector(state => state.osrs);

  const dispatch = useAppDispatch();

  const {open, setOpen} = useOpen({local: "ge-item"});

  const {openLocal: openLocalGeItem} = useOpen({local: "ge-item"});

  const {openLocal: openLocalTimeseries, onOpenLocal: onOpenLocalTimeseries} = useOpen({local: "ge-item-timeseries"});

  const {getQueryValue, setQuery} = useQuery();

  const item_id = getQueryValue("id");

  useEffect(() => {
    dispatch(Osrs.timeseries(item_id || openLocalGeItem || "", openLocalTimeseries || "5m"));
  }, [dispatch, item_id, openLocalGeItem, openLocalTimeseries]);

  useEffect(() => {
    if(open) return;
    if(item_id) return;
    setQuery("id", openLocalGeItem);
    setOpen(true);
  }, [openLocalGeItem, setQuery, item_id, open, setOpen]);

  return (
    <>

      <Time
        openLocalTimeseries={openLocalTimeseries}
        onOpenLocalTimeseries={onOpenLocalTimeseries}
      />

      <Chart 
        timeseries={timeseries} 
      />

      <Rsi 
        timeseries={timeseries} 
      />

    </>
  )
}

export default ChartIndex