import { useEffect, useState } from "react";
import ProductDataService from "../services/product.service";
import { IProduct, IServiceProps } from "../type/interface";
import { ReactComponent as StarIcon } from "../assets/svgs/Star.svg";
import Helper from "../helpers/image.helper";

const helper = new Helper();

export function Products(props: IServiceProps) {

  const productDataService =  new ProductDataService();
  const [ listProducts, setListProducts ] = useState<Array<IProduct>>()
  
  const addProduct = (id: string) => {
    productDataService.getProduct(id)
      .then((productID) => {
        if(productID === null) {
          console.error('product not found')
          return
        }
        props.cartService.addItem(productID, id)
      })
      .catch((error: Error) => console.log(error))
  }

  const getProductList = async () => {
    const products = await productDataService.getProductList();
    setListProducts(products);
  }

  useEffect(() => {
    getProductList()
    .catch(() => setListProducts([]));
  }, [])
  
  return (
    <div className="flex flex-row flex-wrap gap-4 bg-[url('/image3.jpg')] bg-cover bg-fixed p-2">
      { listProducts?.map((product, index) => (
        <div className="w-80 h-96 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-auto" key={index}>
          <img className="p-2 rounded-t-lg h-48 w-44 m-auto" src={helper.getImageOrDefault(product.img, "../assets/imageNotFound.jpg")} alt="product image" />
          <div className="px-5 pb-5">
            <a href="#">
              <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {product.title}
              </h5>
            </a>
            <a href="#">
              <h5 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
                {product.detail}
              </h5>
            </a>
            <div className="flex items-center mt-2.5 mb-5">
              <StarIcon className="w-4 h-4 text-yellow-300 mr-1" />
              <StarIcon className="w-4 h-4 text-yellow-300 mr-1" />
              <StarIcon className="w-4 h-4 text-yellow-300 mr-1" />
              <StarIcon className="w-4 h-4 text-yellow-300 mr-1" />
              <StarIcon className="w-4 h-4 text-gray-200 dark:text-gray-600" />
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
            </div> 
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.price}€
              </span>
              {
                  <button
                    className= { `text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${product.quantity == 0 ? "bg-gray-500 hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-500 dark:focus:ring-gray-500": " bg-blue-700 hover:bg-blue-800  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"}` }
                    onClick={() => addProduct(product.id)} disabled={product.quantity == 0}
                  >
                    { product.quantity == 0 ? 'Not Available': 'Add to cart' }
                  </button>
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}