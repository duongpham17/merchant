"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_object_empty = exports.generateid = exports.second_till_zero = void 0;
const second_till_zero = (minute) => {
    const current_hours_in_milliseconds = Number(Date.now().toString().slice(-10));
    const mod = current_hours_in_milliseconds % (60000 * minute);
    const convert_to_seconds = mod / 1000;
    const convert_to_seconds_till_0 = (minute * 60) - Math.trunc(convert_to_seconds);
    return convert_to_seconds_till_0;
};
exports.second_till_zero = second_till_zero;
const randomid = () => {
    const id = Math.random().toString(36).substring(7);
    return id;
};
const generateid = (times = 2) => {
    const id = Array.from({ length: times }, () => randomid()).join("");
    return id;
};
exports.generateid = generateid;
const is_object_empty = (order) => {
    const is_empty = JSON.stringify(order) === '{}';
    return is_empty;
};
exports.is_object_empty = is_object_empty;
