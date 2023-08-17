import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { IProduct } from "../type/interface"
  
export default class ProductDataService {

  async getProductList(): Promise<Array<IProduct>> {
    const products = new Array<IProduct>()
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      querySnapshot.forEach((doc) => {
        products.push({...doc.data(), id:doc.id})
      })
    } catch (error) {
      console.error(error)
    }
    return products
  }
}