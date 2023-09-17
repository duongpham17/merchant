export const gp = (total: number) => {
    const t = Math.abs(Number(total));
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

export const getax = (item_price: number, quantity=0) => {
  const tax_rate = 0.01;
  const tax_amount = Math.trunc(item_price * tax_rate);
  const max_tax_applied = 5_000_000; // 5 million
  const max_limit_of_item_price = 500_000_000; // 500 million;
  const tax_filter = item_price >= max_limit_of_item_price ? max_tax_applied : item_price - tax_amount;
  return {
    total_after_tax: (item_price * quantity) - (tax_amount * quantity),
    after_tax_price:tax_filter,
    tax: tax_amount,
    total_tax: tax_amount * quantity
  }
}

export const gemargin = (highest: number, lowest: number) => {
  return (highest - lowest) - getax(highest).tax;
}