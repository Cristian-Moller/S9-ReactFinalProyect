import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where 
} from "firebase/firestore";
import { db } from "../firebase"
import { IProduct } from "../type/interface"
  
export default class ProductDataService {
  async getProductList(): Promise<Array<IProduct>> {
    const products = new Array<IProduct>()
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      querySnapshot.forEach((doc) => {
        products.push({ ...doc.data() as IProduct, id: doc.id });
      })
    } catch (error) {
      console.error(error)
    }
    return products
  }

  async addProduct(product: IProduct) : Promise<string | null> {

    const getProductByTitle = query(collection(db, 'products'), where("id", "==", product.id))
    const querySnapshot = await getDocs(getProductByTitle)
    
    if(querySnapshot.empty) {
      addDoc(collection(db, 'products'), { 
        title: product.title,
        detail: product.detail,
        price: product.price,
        quantity: product.quantity,
        img: product.img
      })
      .catch((error: Error) => {
        return error.message
      })
     return null;
    } 
    return "Product already exist";
  }

  async getProduct(id: string) : Promise<IProduct | null>{
    try {
      const docRef = doc(db, 'products', id)
      const docSnap = await getDoc(docRef)
      const data = docSnap.data()

      if(!data){
        return null
      }
      return data as IProduct
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async updateProductById(product : IProduct, productId: string) : Promise<string | null> {
    await setDoc(doc(db, 'products', productId), {
      title: product.title,
      detail: product.detail,
      price: product.price,
      quantity: product.quantity,
      img: product.img
    })
    .catch((error: Error) => {
      return error.message
    })
    return null;
  }

  async updateQuantity(id: string, quantitySell: number) {
    const product: IProduct | null = await this.getProduct(id)
    if(product === null) {
      console.error('product not found')
      return
    }
    await setDoc(doc(db, 'products', id), {
      title: product.title,
      detail: product.detail,
      price: product.price,
      quantity: (Number(product.quantity) - quantitySell),
      img: product.img
    })
    .catch((error: Error) => {
      return error.message
    })
    return null;
  }

  deleteProductById = async (id: string) => {
    await deleteDoc(doc(db, 'products', id))
  }
}