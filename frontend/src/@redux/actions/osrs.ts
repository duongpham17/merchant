import { Dispatch } from 'redux';
import { ACTIONS, TYPES } from '@redux/types/osrs';
import axios from 'axios';

const latest = () => async (dispatch: Dispatch<ACTIONS>) => {
  const url = "https://prices.runescape.wiki/api/v1/osrs/latest";
  try {
    const res = await axios.get(url);
    dispatch({
      type: TYPES.OSRS_GE_LATEST,
      payload: res.data.data
  });
  } catch (error) {
    console.error('Error:', error);
  }
};

const timeseries = (id: string, timestep="1h") => async (dispatch: Dispatch<ACTIONS>) => {
  const url = `https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=${timestep}&id=${id}`;
  try {
    const res = await axios.get(url);
    dispatch({
      type: TYPES.OSRS_GE_TIMESERIES,
      payload: res.data.data
  });
  } catch (error) {
    console.error('Error:', error);
  }
};

const Osrs = {
  latest,
  timeseries
};

export default Osrs;