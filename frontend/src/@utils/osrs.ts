export const gp = (total: number) => {
    const t = (Number(total));
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
  const [ tax_rate, max_tax_applied, max_item_price ] = [ 0.01, 5_000_000, 500_000_000 ]; // [5 million, 500 million];
  const tax_amount = Math.trunc(item_price * tax_rate);
  const tax_filter = item_price >= max_item_price ? max_tax_applied : item_price - tax_amount;
  return {
    total_no_tax: item_price * quantity,
    total_after_tax: tax_filter * quantity,
    tax_per_item: tax_amount,
    tax_per_item_value: item_price - tax_amount,
    total_tax_amount: tax_amount * quantity,
  }
}

export const gemargin = (highest: number, lowest: number) => {
  return (highest - lowest) - getax(highest).tax_per_item;
};

export interface Items {
  [key: string]: any, 
  side: string, 
  quantity: number, 
  sell: number, 
  buy: number
};

export const calc_cost_basis = (index: number, items: Items[]) => {
  let [pnl, nqty] = [0, 0];
  for(let x of items.slice(index)){
    if(x.side === "sell") {
      nqty -= x.quantity;
      pnl -= x.sell * x.quantity;
    };
    if(x.side === "buy") {
      nqty += x.quantity;
      pnl += x.buy * x.quantity;
    };
  };
  return (pnl / nqty);
};

export const calc_cost_basis_latest = (items: Items[]) => {
  let latest_cb = 0;
  for(let i in items){
    const index = Number(i) 
    if(index === 0){
      latest_cb = Math.floor(calc_cost_basis(index, items));
      break
    }
  }
  return latest_cb
};

export const calc_n_quantity = (index: number, items: Items[]) => {
  return items
    .slice(index)
    .map(el => el.side === "buy" ? el.quantity : -el.quantity)
    .reduce((acc,cur) => acc+cur);
};

export const calc_n_quantity_latest = (items: Items[]) => {
  return items
    .map(el => el.side === "buy" ? el.quantity : -el.quantity)
    .reduce((acc,cur) => acc+cur);
};

export const calc_profit_n_loss = (item: Items, current_price: number) => {
  if(item.side === "sell"){
    const ge = getax(item.sell, item.quantity);
    const buy_total = item.buy * item.quantity;
    const sell_total = item.quantity * item.sell;
    return {
      pnl_with_tax: ge.total_after_tax - buy_total,
      pnl_no_tax: sell_total - buy_total,
      total_tax_amount: ge.tax_per_item * item.quantity
    };
  } else {
    const ge = getax(current_price, item.quantity);
    const buy_total = item.buy * item.quantity;
    const current_total = item.quantity * current_price;
    return {
      pnl_with_tax: ge.total_after_tax - buy_total,
      pnl_no_tax: current_total - buy_total,
      total_tax_amount: 0
    }
  }
};