
import { IProduct } from "../type/interface";
import React, { useEffect, useState } from "react";
import ProductDataService from "../services/product.service";

export function AddProducts() {
  
  let urlImageDesc: string | ArrayBuffer | null
  
  const initialValue = {
    id: '',
    title: '',
    detail: '',
    price: 0,
    quantity: 0,
    img: ''
  }
  const [ product, setProduct ] = useState<IProduct>(initialValue)
  const [ listProducts, setListProducts ] = useState<Array<IProduct>>()
  const [ error, setError] = useState<string | null>()
  const [productId, setProductId] = useState<string>('')

  const handleChangeProduct = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProduct({...product, [name]: value})
  }

  const fileHandle = (archives: string) => {

    Array.from(archives).forEach((archive: string): void => {
      const reader = new FileReader()
      reader.readAsDataURL(archive)
      reader.onload = function(this: FileReader) {

        const base64: string | ArrayBuffer | null = reader.result
        urlImageDesc = base64
        setProduct({...product, img: urlImageDesc})
      }
    })
  }

  const saveProduct = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')

    if(productId === '') {
      const addProductError = await productDataService.addProduct(product)
  
      if(addProductError !== null) {
        setError(addProductError)
      }
    } else {
      const addProductError = await productDataService.updateProductById(product, productId)
  
      if(addProductError !== null) {
        setError(addProductError)
      }
    }
    
    void getProductList()
    setProduct({...initialValue})
    setProductId('')
    e.target.imgId.value = ''
  }
  
  const DeleteProductId = async (id: string) => {
    await productDataService.deleteProductById(id)
    void getProductList()
  }
    /* 
  
    delete(id: string) {
      return db.doc(id).delete();
    } */

  const getProductList = async () => {
    const products = await productDataService.getProductList();
    setListProducts(products);
  }
  
  const productDataService =  new ProductDataService();

  const getProduct = async (id: string) => {
    const productID = await productDataService.getProduct(id)
    if(productID === null) {
      console.error('product not found')
      return
    }
    setProduct(productID)
  }

  const editImg = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProduct({...product, img: ''})
  }

  useEffect(() => {
    if(productId !== ''){
      void getProduct(productId)
    }
  }, [productId])
  
  useEffect(() => {
    getProductList()
    .catch(() => setListProducts([]));
  }, [])

  return (
    <div className="bg-[url('src/assets/image2.jpg')] bg-cover p-2">
      <section className="mb-6 ">
        <div className="w-full bg-violet-200 rounded-lg shadow dark:border md:m-auto sm:max-w-3xl p-1 dark:bg-gray-800 dark:border-gray-700 lg:h-1/2">
          <h2 className="text-4xl font-bold dark:text-white text-center m-6">Add Product</h2>
          {error && 
            <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </p> 
          }
          
          <form onSubmit={saveProduct} className="w-full max-w-3xl m-auto mb-6 ">
            <div className="w-full flex mb-6">
              <label htmlFor="" className="w-1/4 block mb-2 text-base font-medium text-gray-900 dark:text-white">Title</label>
              <input 
                className="w-3/4 block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="title"
                name="title"
                placeholder="your Product"
                onChange={handleChangeProduct}  
                value={product.title}
                required
              />
            </div>
            <div className=" mb-6">
              <label htmlFor="" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Detail</label>
              <textarea
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="detail"
                placeholder="your Product"
                onChange={handleChangeProduct}  
                value={product.detail}
                required
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label htmlFor="Price" className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Price €</label>
                <input
                  type="number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="price"
                  min={0}
                  placeholder="Price of the product"
                  onChange={handleChangeProduct}  
                  value={product.price}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-base font-base text-gray-900 dark:text-white">Qty</label>
                <input
                  type="number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="quantity"
                  min={0}
                  placeholder="Product stock"
                  onChange={handleChangeProduct}  
                  value={product.quantity}
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white" 
              htmlFor="large_size">Image</label>
              <div className="flex w-full text-center">
                { product.img !== '' ?
                  <div className="w-full flex justify-center">
                    <img className="w-1/3 h-auto" src={product.img} id="imgId" alt="" />
                    <button
                      type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 h-14"
                      onClick={(e) => editImg(e)}
                    >
                      {/* delete */}
                      <svg className="w-6 h-6 align-middle fill-current overflow-hidden" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" enable-background="new 0 0 256 256"><path d="M229.2,60.6h-23.6l-15.8,163c0,12.4-10.1,22.5-22.5,22.5H88.7c-12.4,0-22.5-10.1-22.5-22.5l-15.8-163H26.8c-3.1,0-5.6-2.5-5.6-5.6s2.5-5.6,5.6-5.6h22.5h11.2h16.9V32.5C77.4,20.1,87.5,10,99.9,10h56.2c12.4,0,22.5,10.1,22.5,22.5v16.9h16.9h11.2h22.5c3.1,0,5.6,2.5,5.6,5.6S232.3,60.6,229.2,60.6z M167.3,32.4c0-6.2-5-11.2-11.2-11.2H99.9c-6.2,0-11.2,5-11.2,11.2v16.9h78.7V32.4z M61.6,60.6l15.8,163c0,6.2,5,11.2,11.2,11.2h78.7c6.2,0,11.2-5,11.2-11.2l15.8-163H61.6z M156.1,212.3c-3.1,0-5.6-2.5-5.6-5.6l5.6-118c0-3.1,2.5-5.6,5.6-5.6c3.1,0,5.6,2.5,5.6,5.6l-5.6,118C161.7,209.8,159.2,212.3,156.1,212.3z M128,212.3c-3.1,0-5.6-2.5-5.6-5.6v-118c0-3.1,2.5-5.6,5.6-5.6s5.6,2.5,5.6,5.6v118C133.6,209.8,131.1,212.3,128,212.3z M99.9,212.3c-3.1,0-5.6-2.5-5.6-5.6l-5.6-118c0-3.1,2.5-5.6,5.6-5.6c3.1,0,5.6,2.5,5.6,5.6l5.6,118C105.5,209.8,103,212.3,99.9,212.3z"/></svg>
                    </button>
                  </div>
                  :
                  <input 
                    className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="large_size"
                    type="file" 
                    name="img"
                    onChange={(e) => fileHandle(e.target.files)}
                    required={!product.img}
                  />
                }
              </div>
            </div>
            <div className="w-full text-center">
              {productId === '' ?
                <button 
                  className="w-1/2 middle none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2.5 px-5 font-sans text-xs font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-fuchsia-300"
                >
                  Add New Product 
                </button>
                :
                <button
                  className="w-1/2 middle none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2.5 px-5 font-sans text-xs font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-fuchsia-300"
                >
                  Edit Product
                </button>
              }
            </div>
          </form>
        </div>
      </section>
    
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h2 className="text-4xl text-white font-bold dark:text-white text-center mb-6">List of Products</h2>
        <table className="w-full text-sm text-left text-transparent dark:text-gray-400 m-auto ">
          <thead className="text-base text-purple-300 uppercase bg-transparent dark:bg-gray-700 dark:text-gray-400 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Image</span>
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Qty
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Details
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            { listProducts?.map((product, index) => (
              <tr className="bg-violet-200 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-gray-600" key={index}>
                <td className="w-32 p-4">
                  <img src={product.img} alt="" />
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-lg">
                  {product.title}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      {product.quantity}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-lg">
                  {product.price}€
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {product.detail}
                </td>
                <td className="px-6 py-4">
                  <button 
                    type="button" className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-3.5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
                    onClick={() => setProductId(product.id) }
                  >
                    {/* edit */}
                    <svg className="w-6 h-6 align-middle fill-current overflow-hidden" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M834.3 705.7c0 82.2-66.8 149-149 149H325.9c-82.2 0-149-66.8-149-149V346.4c0-82.2 66.8-149 149-149h129.8v-42.7H325.9c-105.7 0-191.7 86-191.7 191.7v359.3c0 105.7 86 191.7 191.7 191.7h359.3c105.7 0 191.7-86 191.7-191.7V575.9h-42.7v129.8z"  /><path d="M889.7 163.4c-22.9-22.9-53-34.4-83.1-34.4s-60.1 11.5-83.1 34.4L312 574.9c-16.9 16.9-27.9 38.8-31.2 62.5l-19 132.8c-1.6 11.4 7.3 21.3 18.4 21.3 0.9 0 1.8-0.1 2.7-0.2l132.8-19c23.7-3.4 45.6-14.3 62.5-31.2l411.5-411.5c45.9-45.9 45.9-120.3 0-166.2zM362 585.3L710.3 237 816 342.8 467.8 691.1 362 585.3zM409.7 730l-101.1 14.4L323 643.3c1.4-9.5 4.8-18.7 9.9-26.7L436.3 720c-8 5.2-17.1 8.7-26.6 10z m449.8-430.7l-13.3 13.3-105.7-105.8 13.3-13.3c14.1-14.1 32.9-21.9 52.9-21.9s38.8 7.8 52.9 21.9c29.1 29.2 29.1 76.7-0.1 105.8z"  /></svg>
                  </button>
                  <button
                    type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => DeleteProductId(product.id)}
                  >
                    {/* delete */}
                    <svg className="w-6 h-6 align-middle fill-current overflow-hidden" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" enable-background="new 0 0 256 256"><path d="M229.2,60.6h-23.6l-15.8,163c0,12.4-10.1,22.5-22.5,22.5H88.7c-12.4,0-22.5-10.1-22.5-22.5l-15.8-163H26.8c-3.1,0-5.6-2.5-5.6-5.6s2.5-5.6,5.6-5.6h22.5h11.2h16.9V32.5C77.4,20.1,87.5,10,99.9,10h56.2c12.4,0,22.5,10.1,22.5,22.5v16.9h16.9h11.2h22.5c3.1,0,5.6,2.5,5.6,5.6S232.3,60.6,229.2,60.6z M167.3,32.4c0-6.2-5-11.2-11.2-11.2H99.9c-6.2,0-11.2,5-11.2,11.2v16.9h78.7V32.4z M61.6,60.6l15.8,163c0,6.2,5,11.2,11.2,11.2h78.7c6.2,0,11.2-5,11.2-11.2l15.8-163H61.6z M156.1,212.3c-3.1,0-5.6-2.5-5.6-5.6l5.6-118c0-3.1,2.5-5.6,5.6-5.6c3.1,0,5.6,2.5,5.6,5.6l-5.6,118C161.7,209.8,159.2,212.3,156.1,212.3z M128,212.3c-3.1,0-5.6-2.5-5.6-5.6v-118c0-3.1,2.5-5.6,5.6-5.6s5.6,2.5,5.6,5.6v118C133.6,209.8,131.1,212.3,128,212.3z M99.9,212.3c-3.1,0-5.6-2.5-5.6-5.6l-5.6-118c0-3.1,2.5-5.6,5.6-5.6c3.1,0,5.6,2.5,5.6,5.6l5.6,118C105.5,209.8,103,212.3,99.9,212.3z"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}