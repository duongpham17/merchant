export const second_till_zero = (minute: number) => {
    const current_hours_in_milliseconds : number = Number(Date.now().toString().slice(-10));

    const mod = current_hours_in_milliseconds % (60000 * minute);

    const convert_to_seconds = mod / 1000;

    const convert_to_seconds_till_0 = (minute * 60) - Math.trunc(convert_to_seconds);

    return convert_to_seconds_till_0
}

const randomid = (): string => {
    const id = Math.random().toString(36).substring(7);
    return id;
};

export const generateid = (times: number = 2): string => {
    const id = Array.from({length: times}, () => randomid()).join("");
    return id
};

export const is_object_empty = (order: Object) => {
    const is_empty = JSON.stringify(order) === '{}'
    return is_empty
}