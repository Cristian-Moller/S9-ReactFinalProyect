import CartService from "../services/cart.service";

export interface IUser {
  id: string,
  email: string,
  password: string,
  permissions: string[],
  role: string,
  img?: string | ArrayBuffer | null,
  firstName?: string,
  lastName?: string,
  dni?: string,
  phone?: string,
  streetAddress?: string,
  streetNumber?: string,
  aptUnit?: string,
  city?: string,
  province?: string,
  zip?: string,
}

export interface IProduct {
  id: string,
  title: string,
  detail: string,
  price: number,
  quantity: number,
  img: string | ArrayBuffer | null,
}

export interface IProductSell {
  id: string,
  title: string,
  detail: string,
  price: number,
  quantity: number,
  quantitySell: number,
  img: string | ArrayBuffer | null,
}

export interface IServiceProps{
  cartService: CartService,
}

export interface ILogoutProps{
  setTotal: (amount: number) => void,
}

export interface IModalProps {
  isOpen: boolean,
  title: string,
  text: string,
  buttonOk: string,
  buttonCancel: string,
  onOk: () => void,
  onCancel: () => void,
}

export interface ICartEventDetail {
  totalQuantity: number
}

export interface IOrder {
  id: string,
  idUser: string,
  userEmail: string,
  firstName: string,
  lastName: string,
  phone: string,
  streetAddress: string,
  streetNumber: string,
  aptUnit: string,
  city: string,
  province: string,
  zip: string,
  delivered: boolean,
  products: IOrderLine[],
}

export interface IOrderLine {
  idProduct: string,
  quantitySell: number,
}

export interface IOrderComplete {
  id: string,
  idUser: string,
  userEmail: string,
  firstName: string,
  lastName: string,
  phone: string,
  streetAddress: string,
  streetNumber: string,
  aptUnit: string,
  city: string,
  province: string,
  zip: string,
  delivered: boolean,
  products: IProductSell[],
}
