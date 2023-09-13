export type TradingStrategy = 
    "counter" | "counter long only" | "counter short only" | 
    "trend" | "trend long only" | "trend short only" |
    "rsi counter" | "rsi counter long only" | "rsi counter short only" | 
    "rsi trend" | "rsi trend long only" | "rsi trend short only" |
    "strength trend" | "strength counter" |
    "velocity trend" | "velocity counter" | 
    "trend trend" | "trend counter";

export type Side = 
    "buy" | "sell" | "both";

interface Strategies {
    name: TradingStrategy,
    description: string,
    side: Side
};

export const strategies: Strategies[] = [
    {
        name: "counter",
        side: "both",
        description: `
            Short market pumps and long market dumps
        `,
    },
    {
        name: "counter long only",
        side: "buy",
        description: `
            Only long when market dumps
        `,
    },
    {
        name: "counter short only",
        side: "sell",
        description: `
            Only short market pumps
        `
    },
    {
        name: "trend",
        side: "both",
        description: `
            Short market dumps and long market pumps
        `
    },
    {
        name: "trend long only",
        side: "buy",
        description: `
            Only long when the market pumps
        `
    },
    {
        name: "trend short only",
        side: "sell",
        description: `
            Only short when the market dumps
        `
    },
    {
        name: "rsi trend",
        side: "both",
        description: `
            Relative strength index, when over bought long, when over sold short
        `
    },
    {
        name: "rsi trend long only",
        side: "buy",
        description: `
            Relative strength index, when over bought long, no shorting
        `
    },
    {
        name: "rsi trend short only",
        side: "sell",
        description: `
            Relative strength index, when over sold short, no longing
        `
    },
    {
        name: "rsi counter",
        side: "both",
        description: `
            Relative strength index, when over bought short, when over sold long
        `
    },
    {
        name: "rsi counter long only",
        side: "buy",
        description: `
            Relative strength index, when over sold long only, no shorting
        `
    },
    {
        name: "rsi counter short only",
        side: "sell",
        description: `
            Relative strength index, when over bought short only, no longing
        `
    },
    {
        name: "strength counter",
        side: "both",
        description: `
            Measures price trend movements, high short, low long
        `
    },
    {
        name: "strength trend",
        side: "both",
        description: `
            Measures price trend movements, high long, low short
        `
    },
    {
        name: "velocity counter",
        side: "both",
        description: `
            Measures the price change in speed, when it pumps short, when it dumps long
        `
    },
    {
        name: "velocity trend",
        side: "both",
        description: `
            Measures the price change in speed, when it pumps long, when it dumps short
        `
    },
    {
        name: "trend trend",
        side: "both",
        description: `
            Measures the trend in price close, when trend is down short, when trend is up long
        `
    },
    {
        name: "trend counter",
        side: "both",
        description: `
         Measures the trend in price close, when trend is down long, when trend is up short
        `
    }
];

export const side = (name: string): Side => {
    if(name === undefined) return "both";
    const s = strategies.find(el => el.name === name);
    if(!s) return "both"
    return s.side
};

export const description = (name: string): string => {
    const s = strategies.find(el => el.name === name);
    if(!s) return "";
    return s.description;
};

export default strategies