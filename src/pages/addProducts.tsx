import {
  collection,
  addDoc,
  /* deleteDoc, */
} from "firebase/firestore";
import { db } from "../firebase";
import { IProduct } from "../type/interface";
import { useEffect, useState } from "react";
import ProductDataService from "../services/product.service";

export function AddProducts() {
  
  const initialValue = {
    title: '',
    detail: '',
    price: 0,
    quantity: 0,
    img: ['']
  }
  const [ product, setProduct ] = useState<IProduct>(initialValue)
  const [ listProducts, setListProducts ] = useState<Array<IProduct>>()

  const handleChangeProduct = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProduct({...product, [name]: value})
  }

  const saveProduct = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    
    try {
      void await addDoc(collection(db, 'products'), { 
        title: product.title,
        detail: product.detail,
        price: product.price,
        quantity: product.quantity,
        img: product.img
      })
    } catch (error) {
      console.error(error)
    }
    setProduct({...initialValue})
  }
  
 /*  const getProductsData = async (): Promise<void> => {
    const result: QuerySnapshot<DocumentData, DocumentData> = await getDocs(query(collection(db, 'products')))
    console.log(result.docs.map(doc => doc.data()))
    return setListProducts(result)
  } */
  
    /* create(Product: IProduct) {
      return db.add(tutorial);
    }
  
    update(id: string, value: any) {
      return db.doc(id).update(value);
    }
  
    delete(id: string) {
      return db.doc(id).delete();
    } */

  const getProductList = async () => {
    const products = await productDataService.getProductList();
    setListProducts(products);
  }
  
  const productDataService =  new ProductDataService();
  
  useEffect(() => {
    getProductList()
    .catch(() => setListProducts([]));
  }, [])

  return (
    <>
      <h2>Add Products</h2>
      <form onSubmit={saveProduct}>
        <label htmlFor="">Title</label>
        <input 
          type="title"
          name="title"
          placeholder="your Product"
          onChange={handleChangeProduct}  
          value={product.title}
        />
        <label htmlFor="">Detail</label>
        <input 
          type="detail"
          name="detail"
          placeholder="your Product"
          onChange={handleChangeProduct}  
          value={product.detail}
        /><label htmlFor="">Price</label>
        <input 
          type="price"
          name="price"
          placeholder="your Product"
          onChange={handleChangeProduct}  
          value={product.price}
        /><label htmlFor="">Quantity</label>
        <input 
          type="quantity"
          name="quantity"
          placeholder="your Product"
          onChange={handleChangeProduct}  
          value={product.quantity}
        /><label htmlFor="">Image/s</label>
        <input 
          type="img"
          name="img"
          placeholder="Insert image"
          onChange={handleChangeProduct}  
          value={product.img}
        />
        <button >Save</button>
      </form>

      <div className="border">
        { listProducts?.map(p => p.detail) }
      </div>
    </>
  )
}