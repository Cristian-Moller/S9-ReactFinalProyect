import { Link } from "react-router-dom";
import { Logout } from "./logout";
import { useAuth } from "../context/authContext";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../context/themeContext";
import { ICartEventDetail } from "../type/interface";
import { ReactComponent as CartIcon } from "../assets/svgs/Cart.svg";
import { ReactComponent as MoonIcon } from "../assets/svgs/Moon.svg";
import { ReactComponent as SunIcon } from "../assets/svgs/Sun.svg";
import { ReactComponent as MenuIcon } from "../assets/svgs/Menu.svg";


export function Nav(){
  const authContext = useAuth();
  const { ToggleTheme } = useContext(ThemeContext)
  const [totalQuantity, setTotalQuantity] = useState<number>(0)

  const menuNavbar = useRef<HTMLDivElement | null>()

  const setQuantity = (event: Event) => {
    const quantity = (event as CustomEvent<ICartEventDetail>).detail.totalQuantity;
    setTotalQuantity(quantity)
  }

  const getUserImage = () : string | ArrayBuffer => {
    if(authContext !== null 
      && authContext.user !== null 
      && authContext.user.img !== null 
      && authContext.user.img !== undefined ) 
      return authContext.user.img;

    return "src/assets/userNotFound.png";
  }

  const changeMenuHidden = () => {
    menuNavbar?.current?.classList.toggle("overflow-hidden")
    menuNavbar?.current?.classList.toggle("h-0")
  }

  useEffect(() => {
    document.addEventListener("onCartChange", setQuantity);
  }, [])
  
  return (
    <nav className="mx-auto dark:bg-gray-700 dark:text-white sticky inset-0 z-10 block h-max w-full max-w-full rounded-none border border-white/80 bg-white bg-opacity-80 py-2 px-4 shadow-md backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4" >
      <div>
        <div className="container mx-auto justify-between flex items-center text-gray-900 dark:text-white" >
          <img src={('/src/assets/logo.png')} className="h-14 mr-3" alt="FlowBite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            <a href="#">
              <img src="https://fontmeme.com/permalink/230822/b9a55d4a57cbd16fa42d57324bb65c88.png" alt="fuente-stage-oriental" className="border-0" /></a>
          </span>
          <ul className="ml-auto mr-8 hidden items-center gap-1 xl:gap-4 lg:flex" >
            <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
              <Link className="flex items-center" to="/" >Products</Link>
            </li>

            { authContext?.user &&
              <>
                <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                  <Link className="flex items-center" to="/cart" >
                    <CartIcon className="w-6 h-6 align-middle fill-current overflow-hidden mr-2" />
                    <span className="text-fuchsia-600 font-bold text-lg">
                      {totalQuantity}
                    </span>
                  </Link>
                </li>
                <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                  <Link className="flex items-center" to="/orders/false" >Orders </Link>
                </li>
              </>
            }

            { (authContext?.user && 
              authContext?.user?.permissions.includes('write')) && 
              <>
                <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                  <Link className="flex items-center" to="/deliverys" >Deliverys </Link>
                </li>
                <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                  <Link className="flex items-center" to="/addproducts" >Add Products</Link>
                </li>
              </>
            }

            { (authContext?.user && 
              authContext?.user?.permissions.includes('write')
              && authContext?.user?.role.includes('admin')) &&

              <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                <Link className="flex items-center" to="/add" >Add User</Link>
              </li>
            }

            <li className="block p-1 font-sans text-lg font-normal leading-normal text-inherit antialiased gap-3 lg:flex items-center">
              {!authContext?.user ? 
                <>
                  <button className="middle none center hidden rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2 px-4 font-sans text-xs font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block"
                    type="button"
                    data-ripple-light="true"
                  >
                    <Link className="flex items-center" to="/login" >Login</Link> 
                  </button> 
                  
                  <button className="middle none center hidden rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2 px-4 font-sans text-xs font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block"
                    type="button"
                    data-ripple-light="true"
                  >
                    <Link className="flex items-center" to="/register" >Register</Link>
                  </button>
                </>
                :
                <>
                  {
                    !authContext.user.img ?
                    <>
                      <p className="text-base block p-1 font-sans font-normal leading-normal text-inherit antialiased">
                        <Link className="flex items-center" to="/userProfile" >
                          {authContext?.user.email}
                        </Link>
                      </p>
                      <Logout />
                    </>
                    :
                    <>
                      <p className="text-base block p-1 font-sans font-normal leading-normal text-inherit antialiased">
                        <Link className="flex items-center" to="/userProfile" >
                          <img className="tamaño imagen perfil: w-10 h-10 rounded-full mr-1"
                          src={getUserImage()} />
                          {authContext.user.firstName}
                        </Link>
                      </p>
                      <Logout />
                    </>
                  }
                </>
              }
            </li>
            <li className="block p-1 font-sans font-normal leading-normal text-inherit antialiased">
              <button onClick={ToggleTheme} >
                { document.documentElement.classList.value === 'dark' ? 
                  <MoonIcon className="w-6 h-6 text-violet-700" />
                  :
                  <SunIcon className="w-6 h-6 dark:text-violet-300" />
                }
              </button>
            </li>
          </ul>
          
          <button
            className="middle none relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] rounded-lg text-center font-sans text-xs font-medium uppercase text-blue-gray-500 transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden text-black dark:text-white"
            data-collapse-target="navbar"
            onClick={changeMenuHidden}
          >
            <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transform">
              <MenuIcon className="h-6 w-6" />
            </span>
          </button>
        </div>

        <div
          ref={menuNavbar}
          className="block h-0 w-full basis-full overflow-hidden transition-all duration-300 ease-in lg:hidden text-black dark:text-white"
          data-collapse="navbar"
        >
          <ul className="mt-2 mb-4 flex flex-col gap-2 pb-2" onClick={changeMenuHidden} >
            <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
              <Link className="flex items-center" to="/" >Products</Link>
            </li>
            { authContext?.user &&
              <>
                <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                  <Link className="flex items-center" to="/cart" >
                    <CartIcon className="w-6 h-6 align-middle fill-current overflow-hidden mr-2" />
                    <span className="text-fuchsia-600 font-bold text-lg">
                      {totalQuantity}
                    </span>
                  </Link>
                </li>
                <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                  <Link className="flex items-center" to="/orders/false" >Orders </Link>
                </li>
              </>
            }
            { (authContext?.user && 
              authContext?.user?.permissions.includes('write')) && 
              <>
                <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                  <Link className="flex items-center" to="/deliverys" >Deliverys </Link>
                </li>
                <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                  <Link className="flex items-center" to="/addproducts" >Add Products</Link>
                </li>
              </>
            }
            { (authContext?.user && 
              authContext?.user?.permissions.includes('write')
              && authContext?.user?.role.includes('admin')) &&
              <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                <Link className="flex items-center" to="/add" >Add User</Link>
              </li>
            }
            <li className="p-1 font-sans text-base font-normal leading-normal text-inherit antialiased gap-3 flex flex-col">
              {!authContext?.user ? 
                <>
                  <button className="mb-2 block w-full rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2 px-4 font-sans font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    data-ripple-light="true"
                  >
                    <Link className="flex items-center" to="/login" >Login</Link> 
                  </button> 
                  <button className="mb-2 block w-full rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2 px-4 font-sans font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    data-ripple-light="true"
                  >
                    <Link className="flex items-center" to="/register" >Register</Link>
                  </button>
                </>
                :
                <>
                  {
                    !authContext.user.img ?
                    <>
                      <p className="text-base block p-1 font-sans font-normal leading-normal text-inherit antialiased">
                        <Link className="flex items-center " to="/userProfile" >
                          {authContext?.user.email}
                        </Link>
                      </p>
                      <Logout />
                    </>
                    :
                    <>
                      <p className="text-lg block p-1 font-sans font-normal leading-normal text-inherit antialiased">
                        <Link className="flex items-center" to="/userProfile" >
                          <img className="tamaño imagen perfil: w-10 h-10 rounded-full mr-1"
                          src={authContext?.user.img} />
                          {authContext.user.firstName}
                        </Link>
                      </p>
                      <Logout />
                    </>
                  }
                </>
              }
            </li>
            <li className="block p-1 font-sans font-normal leading-normal text-inherit antialiased">
              <button onClick={ToggleTheme} >
                { document.documentElement.classList.value === 'dark' ? 
                  <MoonIcon className="w-6 h-6 text-violet-700" />
                  :
                  <SunIcon className="w-6 h-6 dark:text-violet-300" />
                }
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}