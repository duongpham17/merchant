import { Dispatch } from 'redux';
import { ACTIONS, OSRS_GE_TIMESERIES, TYPES } from '@redux/types/osrs';
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

const timeseriesId = async (id: string, timestep="1h") => {
  const url = `https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=${timestep}&id=${id}`;
  try {
    const res = await axios.get(url);
    const data: OSRS_GE_TIMESERIES[] = res.data.data
    return data
  } catch (error) {
    console.error('Error:', error);
    return []
  }
};

const Osrs = {
  latest,
  timeseries,
  timeseriesId
};

export default Osrs;