export default class CartService {

  private readonly cart: Array<string>

  constructor() {
    this.cart = new Array<string>()
  }
  getCart(): Array<string> {
    return this.cart;
  }

  addItem(item:string) {
    this.cart.push(item);
  }
}