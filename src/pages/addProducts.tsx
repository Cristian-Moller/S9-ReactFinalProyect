
import { IProduct } from "../type/interface";
import React, { useEffect, useState } from "react";
import ProductDataService from "../services/product.service";
import { ReactComponent as DeleteIcon } from "../assets/svgs/Delete.svg";
import { ReactComponent as EditIcon } from "../assets/svgs/Edit.svg";

export default function AddProducts() {
  const productDataService =  new ProductDataService()
  
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

  const fileHandle = (event: React.ChangeEvent<HTMLInputElement>) => {

    const archives: FileList | null = event.target.files;
    
    if(archives === null) return;

    Array.from(archives).forEach((archive: File): void => {
      const reader = new FileReader()
      reader.readAsDataURL(archive as Blob)
      reader.onload = function(this: FileReader) {

        const base64: string | ArrayBuffer | null = reader.result
        urlImageDesc = base64
        setProduct({...product, img: urlImageDesc})
      }
    })
  }

  const saveProduct = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if(productId === '') {
      productDataService.addProduct(product)
        .then((result: string | null) => {
          if(result !== null) {
            setError(result)
          }
        })
        .catch((error: Error) => console.log(error))
    } else {
      productDataService.updateProductById(product, productId)
        .then((result: string | null) => {
          if(result !== null) {
            setError(result)
          }
        })
        .catch((error: Error) => console.log(error))
    }
    
    getProductList()
      .catch((error:Error) => console.log(error))

    setProduct({...initialValue})
    setProductId('')
  }
  
  const DeleteProductId = (id: string) => {
    productDataService.deleteProductById(id)
      .catch((error: Error) => console.log(error))
    getProductList()
      .catch((error: Error) => console.log(error))
  }

  /* 
  delete(id: string) {
    return db.doc(id).delete();
  } */

  const getProductList = async () => {
    const products = await productDataService.getProductList();
    setListProducts(products);
  }

  const getProduct = async (id: string) => {
    const productID = await productDataService.getProduct(id)
    if(productID === null) {
      console.error('product not found')
      return
    }
    setProduct(productID)
  }

  const editImg = (e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setProduct({...product, img: ''})
  }

  const getProductImage = (product: IProduct) : string => {
    if(product !== null 
      && product.img !== null 
      && product.img !== undefined ) 
      return product.img as string;

    return "src/assets/imageNotFound.jpg";
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
                    <img className="w-1/3 h-auto" src={getProductImage(product)} id="imgId" alt="" />
                    <button
                      type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 h-14"
                      onClick={(e) => editImg(e)}
                    >
                      <DeleteIcon className="w-6 h-6 align-middle fill-current overflow-hidden" />
                    </button>
                  </div>
                  :
                  <input 
                    className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="large_size"
                    type="file" 
                    name="img"
                    onChange={(e) => fileHandle(e)}
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
                  <img src={getProductImage(product)} alt="" />
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
                    <EditIcon className="w-6 h-6 align-middle fill-current overflow-hidden" />
                  </button>
                  <button
                    type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => DeleteProductId(product.id)}
                  >
                    <DeleteIcon className="w-6 h-6 align-middle fill-current overflow-hidden" />
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