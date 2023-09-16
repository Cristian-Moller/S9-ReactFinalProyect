import { IOrder, IOrderComplete, IOrderLine, IProductSell } from "../type/interface";
import CartService from "./cart.service";
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import ProductDataService from "./product.service";

export default class DeliveryService {
  private readonly cartService : CartService
  private readonly productService: ProductDataService

  constructor(cartService: CartService){
    this.cartService = cartService
    this.productService = new ProductDataService()
  }

  saveOrder(userDelivery: IOrder) {
    const cart = this.cartService.getCart()

    const lines : IOrderLine[] = cart.map(product => {
      const line : IOrderLine = {
        idProduct: product.id,
        quantitySell: product.quantitySell
      }

      return line
    });

    userDelivery.products = lines

    addDoc(collection(db, 'orders'), userDelivery)
      .catch((error: Error) => {
        return error.message
      });
  }

  async getOrdersByEmail(userEmail: string) : Promise<Array<IOrderComplete>>{
    const orderList = new Array<IOrder>()
    try {
      const getOrderByEmail = query(collection(db, 'orders'), where("userEmail", "==", userEmail))

      const querySnapshot = await getDocs(getOrderByEmail)
      if(querySnapshot.empty) {
        return []
      }
      querySnapshot.forEach((doc) => {
        orderList.push({ ...doc.data() as IOrder})
      })

    } catch (error) {
      console.error(error)
      return []
    }

    return await this.mapToCompleteOrder(orderList);
  }

  async getOrders() : Promise<Array<IOrderComplete>>{
    const orderList = new Array<IOrder>()
    try {
      const getOrderByEmail = query(collection(db, 'orders'))

      const querySnapshot = await getDocs(getOrderByEmail)
      if(querySnapshot.empty) {
        return []
      }
      querySnapshot.forEach((doc) => {
        orderList.push({ ...doc.data() as IOrder, id: doc.id})
      })

    } catch (error) {
      console.error(error)
      return []
    }

    return await this.mapToCompleteOrder(orderList);
  }

  async mapToCompleteOrder(orderList: IOrder[]): Promise<IOrderComplete[]> {
    const completeOrderList: IOrderComplete[] = [];

    for(const order of orderList){
      const completeOrder: IOrderComplete = {...order, products: []}

      for(const product of order.products){

        const currentProduct = await this.productService.getProduct(product.idProduct);

        if(currentProduct !== null) {
          const productCell: IProductSell = {
            id: product.idProduct,
            detail: currentProduct.detail,
            img: currentProduct?.img,
            price: currentProduct?.price,
            quantitySell: product.quantitySell,
            title: currentProduct?.title,
            quantity: 0
          }
  
          completeOrder.products.push(productCell);
        }
      }
      completeOrderList.push(completeOrder);
    }
    return completeOrderList;
  }

  async updateOrderById(checked : boolean, order: IOrderComplete, id:string) : Promise<string | null> {

    await setDoc(doc(db, 'orders', id), {
      idUser: order.idUser,
      userEmail: order.userEmail,
      firstName: order.firstName,
      lastName: order.lastName,
      phone: order.phone,
      streetAddress: order.streetAddress,
      streetNumber: order.streetNumber,
      aptUnit: order.aptUnit,
      city: order.city,
      province: order.province,
      zip: order.zip,
      delivered: checked,
      products: order.products.map(x => { 
        const orderLine: IOrderLine = {
          idProduct: x.id,
          quantitySell: x.quantitySell
        };
        return orderLine
      }),
    })
    .catch((error: Error) => {
      console.log('error', error)
      return error.message
    })
    return null;
  }

}