export const gp = (total: number) => {
    const t = Number(total);
    let format = "";
    if(t < 1_000_000){
      format = `${t.toLocaleString()}`
    } else if(t >= 1_000_000 && t < 1_000_000_000){
      format = `${(t / 1_000_000).toFixed(2)}M`
    } else if(t >= 1_000_000_000){
      format = `${(t / 1_000_000_000).toFixed(2)}B`
    }
    return format;
};

export const getax = (value: number) => {

}