import { useEffect, useState } from "react";
import { IProductSell, IServiceProps } from "../type/interface";
import Modal from "../components/modal";
import { Link, useNavigate } from "react-router-dom";
import Helper from "../helpers/image.helper";
import {ReactComponent as MarketIcon} from "../assets/svgs/Market.svg";
import {ReactComponent as DeleteIcon} from "../assets/svgs/Delete.svg";
const helper = new Helper()

const Cart = (props: IServiceProps) => {

  const [cartProducts, setCartProducts] = useState<IProductSell[]>()
  const [open, setOpen] = useState<boolean>(false)
  const [openDeleteItem, setOpenDeleteItem] = useState<boolean>(false)
  const [subTotal, setSubTotal] = useState<number>(0)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [productToUpdate, setProductToUpdate] = useState<IProductSell>()
  const [productToDelete, setProductToDelete] = useState<IProductSell>()
  const navigate = useNavigate()
  
  const handleDelete = () => {
    if(productToUpdate){
      const cart = props.cartService.updateItem(productToUpdate.id, -1);
      setCartProducts([...cart])
    }
    setOpen(false)
  }

  function handleDeleteItem() {
    if(productToDelete){
      props.cartService.removeItem(productToDelete.id)
      setCartProducts([...props.cartService.getCart()])
    }
    setOpenDeleteItem(false)
  }

  const handleCancel = () => {
    setOpen(false)
    setOpenDeleteItem(false)
  }
  
  const changeQty = (id: string, qty: number) => {
    const product = cartProducts?.find(prod => prod.id === id)
    setProductToUpdate(product);

    if(product !== undefined && (qty*-1) === 1 && product.quantitySell === 1){
      setOpen(true)
    }
    else {
      const cart = props.cartService.updateItem(id, qty);
      setCartProducts([...cart])
    }
  }

  const deleteItem = (id: string) => {
    const product = cartProducts?.find(prod => prod.id === id)
    setProductToDelete(product);

    if(product !== undefined){
      setOpenDeleteItem(true)
    }
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

  useEffect(() => { 
    cartSubTotal()
  }, [cartProducts])

  useEffect(() => { 
    setCartProducts([...props.cartService.getCart()])
    
  }, [props.cartService])

  return (
    <div className="bg-gradient-to-t from-blue-950 via-blue-500 to-blue-950" >
      {props.cartService.getCart().length === 0  ?

        <section className="container bg-[url('/image4.jpg')] bg-cover bg-no-repeat h-screen
          m-auto flex flex-col items-center justify-center w-screen" >
          <p className="w-fit mb-6 text-white text-4xl md:text-6xl">Your cart is empty</p>
          
          <button 
            className="none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2.5 px-5 font-sans uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none focus:ring-2 focus:outline-none focus:ring-fuchsia-300 bg-gray-300 hover:bg-gray-400 font-bold inline-flex items-center text-2xl md:text-4xl">
            <Link className="flex items-center" to="/" >
              <MarketIcon />
              <span>Start Shopping</span>
            </Link>
          </button>
        </section>
        :
        <>
          <Modal onOk={handleDelete} onCancel={handleCancel} isOpen={open} title="Delete product" text="Are you sure you wont to remove the product from the cart?" buttonCancel="Cancel" buttonOk="Delete" />
          <Modal onOk={handleDeleteItem} onCancel={handleCancel} isOpen={openDeleteItem} title="Delete product" text="Are you sure you wont to remove the product from the cart?" buttonCancel="Cancel" buttonOk="Delete" />
          <section className="h-screen bg-gray-100 pt-20 container bg-[url('/image4.jpg')] bg-cover bg-no-repeat m-auto sm:h-auto sm:pb-6">
            <h1 className="mb-10 text-center text-2xl font-bold text-white">Cart Items</h1>
            <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 h-fit">
              <div className="rounded-lg md:w-2/3 overflow-auto" style={{height: "48rem"}} >
                { cartProducts?.map((product, index) => (

                  <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start dark:bg-gray-800 dark:border-gray-700" key={index}>
                    <img src={helper.getImageOrDefault(product.img, "../assets/imageNotFound.jpg")} alt="product-image" className="w-full rounded-lg sm:w-40" />
                    <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                      <div className="mt-5 sm:mt-0">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{product.title} </h2>
                        <p className="mt-1 text-base text-gray-700 dark:text-slate-300">{product.detail} </p>
                      </div>
                      <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                        <div className="flex items-center justify-end border-gray-100">
                          <span className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50 text-base dark:hover:bg-blue-500 dark:bg-gray-500 dark:border-gray-700 dark:text-white"
                          onClick={() => changeQty(product.id, -1)}> - </span>
                          <input className="h-8 w-8 border bg-white text-center text-base outline-none [&::-webkit-inner-spin-button]:appearance-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" readOnly type="number" min="1" max={product.quantity} value={product.quantitySell} />
                          <span className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50 text-base dark:hover:bg-blue-500 dark:bg-gray-500 dark:border-gray-700 dark:text-white"
                          onClick={() => changeQty(product.id, 1)}> + </span>
                        </div>
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
                          <button onClick={() => deleteItem(product.id)}
                            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-1 py-1.5 text-center  dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                          >
                           <DeleteIcon className="w-5 h-5 align-middle fill-current overflow-hidden"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

                {/* total */}
              <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <div className="mb-2 flex justify-between">
                  <p className="text-gray-700 dark:text-white text-xl">Total Items</p>
                  <p className="text-gray-700 font-bold dark:text-white text-xl">{totalItems} Unit</p>
                </div>
                <div className="mb-2 flex justify-between">
                  <p className="text-gray-700 dark:text-white text-xl">Subtotal</p>
                  <p className="text-gray-700 dark:text-white text-xl">{(subTotal*.79).toFixed(2)} €</p>
                </div>
                <div className="mb-2 flex justify-between">
                  <p className="text-gray-700 dark:text-white text-xl">IVA 21%</p>
                  <p className="text-gray-700 dark:text-white text-xl">{(subTotal*.21).toFixed(2)} €</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-700 dark:text-white text-xl">Shipping</p>
                  <p className="text-gray-700 dark:text-white text-xl">Free</p>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between">
                  <p className="text-lg font-bold">Total</p>
                  <div className="">
                    <p className="mb-1 text-lg font-bold">{(subTotal).toFixed(2)} €</p>
                    <p className="text-gray-700 dark:text-white text-base">including VAT</p>
                  </div>
                </div>
                <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
                  onClick={() => navigate("/orders/true") }
                >Check out
                </button>
              </div>
            </div>
          </section>
        </>
      }
    </div>
  )
}

export default Cart