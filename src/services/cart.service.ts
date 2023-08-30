import { ICartEventDetail, IProduct, IProductSell } from "../type/interface";

export default class CartService {

  private readonly cart: Array<IProductSell>

  constructor() {
    this.cart = new Array<IProductSell>()
  }

  getCart(): Array<IProductSell> {
    return this.cart;
  }

  updateItem(id: string, qty: number): Array<IProductSell> {
    const productIndex = this.cart.findIndex(prod => prod.id === id)

    const product = this.cart[productIndex]

    console.log('first', product.quantity >= product.quantitySell)
    
    if(product.quantity > product.quantitySell || qty === -1){
      product.quantitySell += qty
      this.cart.splice(productIndex, 1)
      if(product.quantitySell > 0){
        this.cart.splice(productIndex, 0, product)
      }
    }
    this.dispatchEvent()
    return this.cart
  }

  removeItem(id: string): Array<IProductSell> {
    const productIndex = this.cart.findIndex(prod => prod.id === id)
    this.cart.splice(productIndex, 1)

    this.dispatchEvent()
    return this.cart
  }

  addItem(item: IProduct, id: string) {
    const thisOne = this.cart.find(item => item.id === id)
    if (!thisOne){
      this.cart.push({...item, id: id, quantitySell: 1});
    } else if(thisOne.quantity > thisOne.quantitySell) {
      this.cart.find(item => {
        if(item.id === id){
          item.quantitySell++
        }
      });
    }

    this.dispatchEvent();
  }

  private getQuantity(): number {
    const qty = this.cart.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.quantitySell
    }, 0)
    return qty
  } 

  private dispatchEvent() {
    const event = new CustomEvent<ICartEventDetail>('onCartChange', {detail: {totalQuantity: this.getQuantity()}});

    document.dispatchEvent(event);
  }
}