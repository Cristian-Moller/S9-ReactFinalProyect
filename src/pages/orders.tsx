import { useEffect, useState } from "react"
import { Params, useParams } from "react-router-dom"
import { IOrder, IOrderComplete, IProductSell, IServiceProps } from "../type/interface"
import { useAuth } from "../context/authContext"
import UserService from "../services/users.service"
import Helper from "../helpers/image.helper"
import DeliveryService from "../services/deliverys.service"
import ProductDataService from "../services/product.service"
const helper = new Helper()


export default function Orders(props: IServiceProps) {
  const { params }: Params<string> = useParams()
  const [visibleForm, setVisibleForm] = useState<string | undefined>(params)
  
  const userService = new UserService();
  const deliveryService = new DeliveryService(props.cartService);
  const productDataService =  new ProductDataService();

  const authContext = useAuth()

  const valueUserDelivery = {
    id: '',
    idUser: authContext?.user?.id ?? '',
    userEmail:  authContext?.user?.email ?? '',
    firstName: authContext?.user?.firstName ?? '',
    lastName: authContext?.user?.lastName ?? '',
    phone: authContext?.user?.phone ?? '',
    streetAddress: authContext?.user?.streetAddress ?? '',
    streetNumber: authContext?.user?.streetNumber ?? '',
    aptUnit: authContext?.user?.aptUnit ?? '',
    city: authContext?.user?.city ?? '',
    province: authContext?.user?.province ?? '',
    zip: authContext?.user?.zip ?? '',
    delivered: false,
    products: [],
  }

  const [cartProducts, setCartProducts] = useState<IProductSell[]>()
  const [subTotal, setSubTotal] = useState<number>(0)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [inputActive, setInputActive] = useState<boolean>(false)
  const [userOrder, setUserOrder] = useState<IOrder>(valueUserDelivery)
  const [ordersList, setOrdersList] = useState<IOrderComplete[]>()
  
  const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
    setUserOrder({...userOrder, [name]: value})
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()  
    setInputActive(!inputActive)
    if(inputActive === true) {
      deliveryService.saveOrder(userOrder)
      updateQuantityByOrder()

      setVisibleForm('false');
      /* delete cart */
      props.cartService.deleteCart()
    }
    getMyOrders(userOrder.userEmail)
    .catch((error: Error) => console.log(error))
  }

  const updateQuantityByOrder = () => {
    userOrder.products.map( async (prod) => {
      await productDataService.updateQuantity(prod.idProduct, prod.quantitySell)
    })
  }

  const cartSubTotal = () => {
    let prodSubtotal = 0
    let totalQty = 0
    cartProducts?.forEach((prod) => {
      prodSubtotal += prod.quantitySell * prod.price
      totalQty += prod.quantitySell
    })
    setSubTotal(prodSubtotal)
    setTotalItems(totalQty)
  }

  const getProfile = async (email: string): Promise<void> => {
    const user = await userService.getUserByEmail(email)
    if(user === null) {
      console.error('user not found')
      return
    }
    const delivery: IOrder = {
      id: '',
      idUser: user.id,
      userEmail: user.email,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: user.phone ?? '',
      streetAddress: user.streetAddress ?? '',
      streetNumber: user.streetNumber ?? '',
      aptUnit: user.aptUnit ?? '',
      city: user.city ?? '',
      province: user.province ?? '',
      zip: user.zip ?? '',
      delivered: false,
      products: []
    }

    setUserOrder(delivery)
  }

  const getMyOrders = async (userEmail: string): Promise<void> => {
    const order = await deliveryService.getOrdersByEmail(userEmail)
    if(order === null) {
      console.error('order not found')
      return
    }
    setOrdersList(order)
  }

  const getProductImage = (product: IProductSell) : string => {
    if(product !== null 
      && product.img !== null 
      && product.img !== undefined ) 
      return product.img as string;

    return "/imageNotFound.jpg";
  }

  useEffect(() => {
    return void getMyOrders(userOrder.userEmail);
  }, [])

  useEffect(() => { 
    setCartProducts([...props.cartService.getCart()])
    
  }, [props.cartService])

  useEffect(() => {
    cartSubTotal()
  }, [cartProducts])

  useEffect(() => {
    if(userOrder){
      return void getProfile(userOrder.userEmail)
    }
  }, [])

  return (
    <div className="bg-[url('/image5.jpg')] bg-cover bg-fixed py-10">
      { (visibleForm === 'true') &&
        <section className="bg-[url('/image6.jpg')] bg-cover py-10">
          <form 
            className="w-full max-w-4xl m-auto p-4 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
            onSubmit={handleSubmit}>
            <h3 className="text-3xl text-center font-bold mb-2" >Confirm Your Orders</h3>

            {/* User Profile */}
            <div className="flex flex-wrap -mx-3 ">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-first-name">
                  First Name
                </label>
                <input 
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  id="grid-first-name" type="text" placeholder="Jane" required
                  name="firstName"
                  onChange={handleChange} 
                  value={userOrder.firstName}
                  readOnly={!inputActive}
                />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-last-name">
                  Last Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="grid-last-name" type="text" placeholder="Doe" required
                  name="lastName"
                  onChange={handleChange} 
                  value={userOrder.lastName}
                  readOnly={!inputActive}
                />
              </div>
              
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-phone">
                  Phone
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="grid-phone" type="tel" placeholder="123-123456" required
                  pattern="[0-9]{9}"
                  name="phone"
                  onChange={handleChange} 
                  value={userOrder.phone}
                  readOnly={!inputActive}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-street-address">
                  Street Address
                </label>
                <input 
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="grid-street-address" type="text" placeholder="Carrer de Roc Boronat" required
                  name="streetAddress"
                  onChange={handleChange} 
                  value={userOrder.streetAddress}
                  readOnly={!inputActive}
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-street-number">
                  Number
                </label>
                <input 
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="grid-street-number" type="text" placeholder="117" required
                  name="streetNumber"
                  onChange={handleChange} 
                  value={userOrder.streetNumber}
                  readOnly={!inputActive}
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-apt-unit">
                  Apt/Unit
                </label>
                <input 
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="grid-apt-unit" type="text" placeholder="Primero" required
                  name="aptUnit"
                  onChange={handleChange} 
                  value={userOrder.aptUnit}
                  readOnly={!inputActive}
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-city">
                  City
                </label>
                <input 
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="grid-city" type="text" placeholder="Barcelona" required
                  name="city"
                  onChange={handleChange} 
                  value={userOrder.city}
                  readOnly={!inputActive}
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-zip">
                  Province
                </label>
                <input 
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="grid-province" type="text" placeholder="Barcelona" required
                  name="province"
                  onChange={handleChange} 
                  value={userOrder.province}
                  readOnly={!inputActive}
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-zip">
                  Zip
                </label>
                <input 
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="grid-zip" type="text" placeholder="08018" required
                  name="zip"
                  onChange={handleChange} 
                  value={userOrder.zip}
                  readOnly={!inputActive}
                />
              </div>
            </div>

            {/* Product List */}
            { cartProducts?.map((product, index) => (
              <div className="justify-between mb-1 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start dark:bg-gray-800 dark:border-gray-700" key={index}>
                <img src={helper.getImageOrDefault(product.img, "../assets/imageNotFound.jpg")} alt="product-image" className="w-full rounded-lg sm:w-14" />

                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                  <div className="mt-5 sm:mt-0">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {product.title}
                    </h2>
                    <p className="mt-1 text-base text-gray-700 dark:text-slate-300">
                      {product.detail}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-end">
                        <p className="text-base dark:text-white">
                          {product.price}€ x {product.quantitySell}unit
                        </p>
                        <p>
                          <span className="text-xl font-bold dark:text-white" >
                            {product.price*product.quantitySell}€ 
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* total */}
            <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 dark:bg-gray-800 dark:border-gray-700 dark:text-white mb-6">

              <div className="flex flex-wrap -mx-3">
                <div className="w-full md:w-1/5 px-3">
                  <p className="text-gray-700 dark:text-white text-xl">Total Items</p>
                  <p className="text-gray-700 font-bold dark:text-white text-2xl">{totalItems} Unit</p>
                </div>
                <div className="w-full md:w-1/5 px-3">
                  <p className="text-gray-700 dark:text-white text-xl">Subtotal</p>
                  <p className="text-gray-700 dark:text-white text-xl">{(subTotal*.79).toFixed(2)} €</p>
                </div>
                <div className="w-full md:w-1/5 px-3">
                  <p className="text-gray-700 dark:text-white text-xl">IVA 21%</p>
                  <p className="text-gray-700 dark:text-white text-xl">{(subTotal*.21).toFixed(2)} €</p>
                </div>
                <div className="w-full md:w-1/5 px-3">
                  <p className="text-gray-700 dark:text-white text-xl">Shipping</p>
                  <p className="text-gray-700 dark:text-white text-xl font-bold">Free</p>
                </div>
                <div className="w-full md:w-1/5 px-3">
                  <p className="text-xl font-bold">Total</p>
                  <p className="mb-1 text-2xl font-bold">{(subTotal).toFixed(2)} €</p>
                </div>
              </div>
            </div>

            {/* Edit and Save */}
            <div className="w-full text-center">
              { inputActive === false ?
                <button 
                  className="w-1/2 middle none center rounded-lg bg-gradient-to-t from-cyan-500 to-fuchsia-700 py-2.5 px-5 font-sans text-base font-bold uppercase text-white shadow-md shadow-cyan-900/30 transition-all hover:shadow-lg hover:shadow-cyan-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-violet-300"
                >
                  Edit Order
                </button>
                :
                <button
                  className="w-1/2 middle none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2.5 px-5 font-sans text-base font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-fuchsia-300"
                >
                  Save Order
                </button>
              }
            </div>
          </form>
        </section>
      }

      <h2 className="text-4xl font-bold dark:text-white text-slate-300 text-center m-6">Order List</h2>
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
          </div>

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