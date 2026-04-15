export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CheckoutState {
  selectedAddress: string;
  paymentMethod: string;
}