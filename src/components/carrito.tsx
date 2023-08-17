import CartService from "../services/cart.service"

interface ServiceProps{
  cartService: CartService
}
const Cart: React.FC<ServiceProps> = (props) => {

  const addProduct = () => {
    props.cartService.addItem('producto 1');

    console.log(props.cartService.getCart());
  }

  return (
    <>
      <button onClick={addProduct}>ADD item</button>
    </>
  )
}

export default Cart