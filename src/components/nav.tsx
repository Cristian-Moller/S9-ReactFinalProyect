import { Link } from "react-router-dom";
import { Logout } from "./logout";
import { useAuth } from "../context/authContext";


export function Nav(){
  const authContext = useAuth();

  return (
    <nav>
      <li>
        <Link to="/" >Home</Link>
      </li>
      <li>
        <Link to="/client" >Client</Link>
      </li>
      <li>
        <Link to="/carrito" >Carrito</Link>
      </li>
      <li>
        <Link to="/add" >Add User</Link>
      </li>
      <li>
        <Link to="/addproducts" >Add Products</Link>
      </li>

      <li>
        {!authContext?.user ? 
          <>
            <button>
              <Link to="/login" >Login</Link> 
            </button> 
            | 
            <button>
              <Link to="/register" >Register</Link>
            </button>
          </>
          :
          <>
            {authContext?.user.email}
            <Logout />
          </>
        }
      </li>
    </nav>
  )
}