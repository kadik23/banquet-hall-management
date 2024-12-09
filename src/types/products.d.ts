interface Product {
  id?: number,
  name: string,
  unique_price: number,
  quantity: number,
  total_amount: number,
  status: 'paid' | 'not-paid',
  date: string
};
