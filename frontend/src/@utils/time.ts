export const UK = (time: Date) => {
    return new Date(time).toLocaleString('en-US', {timeZone: "Europe/London"})
};

export const date = (iso: string | Date, length=0): string => {
    return iso.toLocaleString().split("T").join(" ").slice(length, 19);
};

export const timerLess24 = (future_time: number) => {
    return new Date(future_time - Date.now()).toISOString().slice(11,19);
};

export const timeExpired = (future: Date) => {
    const isExpired = Date.now() >= new Date(future).getTime() + (60 * 60 * 1000) 
    return isExpired
};

export const timeDifference = (future: Date, past: Date): string => {
    const duration = new Date(future).getTime() - new Date(past).getTime();
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const hours1 = (hours < 10) ? "0" + hours : hours;
    const minutes1 = (minutes < 10) ? "0" + minutes : minutes;
    const seconds1 = (seconds < 10) ? "0" + seconds : seconds;
    return hours1 + ":" + minutes1 + ":" + seconds1
};

export const secondTillZero = (minute: number) => {
    const current_hours_in_milliseconds : number = Number(Date.now().toString().slice(-10));
    const mod = current_hours_in_milliseconds % (60000 * minute);
    const convert_to_seconds = mod / 1000;
    const second_to_zero = (minute * 60) - Math.trunc(convert_to_seconds);
    return second_to_zero
};

export const timeExpire = (future: Date, minute=0) => {
    const time = (new Date(future).getTime()+(minute*60*1000)) - Date.now();
    const calc_minutes = Math.round(time / 60 / 1000);
    return calc_minutes
};

export const minuteToString = (minutes: number) => {
    const time = (minutes === 0 || !minutes) ? "1 minute" :  
        60 >= minutes ? `${minutes} minute` :
        minutes >= 60 && minutes < (60 * 24) ? `${minutes / 60} hour` :
        minutes >= (60 * 24) && minutes < (60 * 24 * 7) ? `${minutes / 60 / 24} day` :
        `${minutes / 60 / 24 / 7} week` 
    return time;
};

export const timeAgo = (timestamp: number): string => {
    const date: Date = new Date(timestamp * 1000);
    const currentDate: Date = new Date();
    const differenceInMillis: number = currentDate.getTime() - date.getTime();
    const differenceInSeconds: number = Math.floor(differenceInMillis / 1000);

    if (differenceInSeconds < 60) {
        return `${differenceInSeconds} seconds ago`;
    } else if (differenceInSeconds < 3600) {
        const minutes: number = Math.floor(differenceInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 86400) {
        const hours: number = Math.floor(differenceInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days: number = Math.floor(differenceInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
};

export const convertTimestampToUKTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    // Format the date as "day month year"
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const ukDate = new Intl.DateTimeFormat('en-GB', options).format(date);
    return ukDate;
}
