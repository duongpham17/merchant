import ge from './osrs-ge-items.json';

export interface OSRS_GE_ITEM {
    highalch: number,
    members: boolean,
    name: string,
    examine: string,
    id: number,
    limit?: number,
    value: number,
    icon: string,
    lowalch: number
}

const items: OSRS_GE_ITEM[] = ge as OSRS_GE_ITEM[];

export default items;