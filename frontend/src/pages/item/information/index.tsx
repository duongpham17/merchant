import styles from './Information.module.scss';
import React, {useContext, useMemo} from 'react';
import { Context } from '../Context';
import { useAppSelector } from '@redux/hooks/useRedux';
import { firstcaps } from '@utils/functions';
import { gp } from '@utils/osrs';
import { MdSell, MdStar } from "react-icons/md";
import { timeAgo, convertTimestampToUKTime } from '@utils/time';

import Message from '@components/hover/Message'

const Information = () => {

    const { item, timeseries } = useContext(Context);
    
    const { latest } = useAppSelector(state => state.osrs);

    const latest_data = latest[item.id];

    const roi = useMemo(() => {
        if(!timeseries.length) return {
            roi: 0,
            lowest: 0,
            highest: 0,
        };

        let [high, low, timeLow, timeHigh] = [0, timeseries[0].avgLowPrice, 0, 0];

        for (let x of timeseries) {
            if (high < x.avgHighPrice){ 
                high = x.avgHighPrice;
                timeHigh = x.timestamp
            };
            if (low > x.avgLowPrice) {
                low = x.avgLowPrice;
                timeLow = x.timestamp;
            };
        };
        return {
            roi: Math.round(((high - low) / low) * 100),
            lowest: low,
            highest: high,
            timeLow: timeLow || 0,
            timeHigh: timeHigh || 0
        };    
    }, [timeseries])
    
    return (
        <div className={styles.container}>
        
        <div className={styles.name}>
            <img src={`https://oldschool.runescape.wiki/images/${firstcaps(item.icon.replaceAll(" ", "_"))}`} width={30} alt="osrs" />
            <p>{item.name}</p>
        </div>

        <div className={styles.examine}>
            <p>{item.examine}</p>
        </div>

        <div className={styles.others}>
            <div><Message message="Buy limit every 4 hours" side="left">Buy Limit</Message><span>{item.limit || "?"}</span></div>
            <div><span>High Alch</span><span>{gp(item.highalch)}</span></div>
            <div><span>Low Alch</span><span>{gp(item.lowalch)}</span></div>
            <div><span>Members</span><span>{item.members ? <MdStar color="yellow" /> : <MdStar color='grey'/>}</span></div>
        </div>

        {latest_data &&
            <div className={styles.prices}>
                <div>
                    <p><MdSell className={styles.buy}/> <span>Buy Price: {gp(latest_data.high)}</span></p>
                    <small>Last traded: {timeAgo(latest_data.highTime)}</small>
                </div>
                <div>
                    <p><MdSell className={styles.sell}/> <span>Sell Price: {gp(latest_data.low)}</span></p>
                    <small>Last traded: {timeAgo(latest_data.lowTime)}</small>
                </div>
            </div>
        }

        <div className={styles.roi}>
            <div>
                <Message message="Return on investment" side="left"><p className={roi.roi > 0 ? styles.profit : styles.loss }>ROI {roi.roi} %</p></Message>
            </div>
            <p>
                <span>Highest Price: {gp(roi.highest)}</span>
                <small>{roi.timeHigh ? convertTimestampToUKTime(roi.timeHigh) : "Unknown"}</small>
            </p>
            <p>
                <span>Lowest Price: {gp(roi.lowest)} </span>
                <small>{roi.timeLow ? convertTimestampToUKTime(roi.timeLow) : "Unknown"}</small>
            </p>
        </div>

        </div>
    )
}

export default Information