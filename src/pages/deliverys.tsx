import React, { useEffect, useState } from "react"
import { IOrderComplete, IProductSell, IServiceProps } from "../type/interface"
import DeliveryService from "../services/deliverys.service"


export default function Deliverys(props: IServiceProps) {
  
  const deliveryService = new DeliveryService(props.cartService);

  const getProductImage = (product: IProductSell) : string => {
    if(product !== null 
      && product.img !== null 
      && product.img !== undefined ) 
      return product.img as string;

    return "src/assets/imageNotFound.jpg";
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement> ,order: IOrderComplete) => {
    const isChecked: boolean = e.target.checked ?? false;

    deliveryService.updateOrderById(isChecked, order, order.id)
    .then(() => 
      getOrders()
      .catch((error: Error) => console.log(error))
    )
    .catch((error: Error) => console.log(error))
  }

  const [ordersList, setOrdersList] = useState<IOrderComplete[]>()

  const getOrders = async (): Promise<void> => {
    const order = await deliveryService.getOrders()
    if(order === null) {
      console.error('order not found')
      return
    }
    setOrdersList(order)
  }

  useEffect(() => {
    return void getOrders();
  }, [])

  return (
    <div className="bg-[url('src/assets/image7.jpg')] bg-cover bg-fixed py-10">
      <h2 className="text-4xl font-bold dark:text-white text-white bg-gradient-to-r from-black via-purple-600 to-black rounded-full w-3/4 text-center m-auto mb-6">Order List</h2>
      { ordersList?.map((order, index) => (
        <div key={index} className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 m-auto mb-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white ml-10 ">
              <div className="items-center text-base font-semibold text-gray-900 dark:text-white">
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  Customer:
                </p>
                <p className="text-xl font-medium text-gray-900 truncate dark:text-white">
                  {order.lastName}, {order.firstName}
                </p>
              </div>
            </h5>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked={order.delivered}
                onChange={(e) => handleCheckbox(e, order)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Delivered
              </span>
            </label>
          </div>

          { order.delivered === false &&

            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.products.map((prod, index) => (
                  <li key={index} className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img className="w-12 h-12 rounded-full" src={getProductImage(prod)} alt="Neil image" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                          {prod.title}
                        </p>
                        <p className="text-base text-gray-500 truncate dark:text-gray-400">
                          {prod.detail}
                        </p>
                      </div>
                      <div className="items-center text-base font-semibold text-gray-900 dark:text-white">
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {prod.quantitySell} Unit x {prod.price} €
                        </p>
                        <p className="text-end text-lg font-medium text-gray-900 truncate dark:text-white">
                          {prod.quantitySell * prod.price} €
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          }

          
          <div className="md:flex md:flex-row md:items-center items-start justify-between mt-6 ml-10 flex flex-col gap-3 ">
            <div className="items-center text-base font-semibold text-gray-900 dark:text-white">
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                Delivery Address:
              </p>
              <p className="text-lg font-medium text-gray-900 truncate dark:text-white">
                {order.streetAddress} {order.streetNumber},
              </p>
              <p className="text-lg font-medium text-gray-900 truncate dark:text-white">
                {order.city}, {order.province}
              </p>
            </div>
            
            <div className="items-center text-base font-semibold text-gray-900 dark:text-white">
              <p className="text-base text-gray-500 truncate dark:text-gray-400">
                Total: {order.products.reduce((previous, current) => previous + current.quantitySell, 0)} Unit
              </p>
              <p className="text-lg font-medium text-gray-900 truncate dark:text-white">
                Total: {order.products.reduce((previous, current) => previous + Number(current.price), 0)} €
              </p>
            </div>
          </div>
        </div>
      ))
      }
    </div>
  )
}