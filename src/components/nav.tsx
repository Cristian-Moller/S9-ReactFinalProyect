import { Link } from "react-router-dom";
import { Logout } from "./logout";
import { useAuth } from "../context/authContext";
import { useContext, useRef } from "react";
import { ThemeContext } from "../context/themeContext";

type Props = {
  children: React.ReactNode;
}

export function Nav({ children }: Props){
  const authContext = useAuth();
  const {theme, ToggleTheme} = useContext(ThemeContext)

  const menuNavbar = useRef<HTMLDivElement | null>()
  

  const changeMenuHidden = () => {
    menuNavbar?.current?.classList.toggle("overflow-hidden")
    menuNavbar?.current?.classList.toggle("h-0")
    console.log('click', menuNavbar?.current?.classList)
  }

  return (
    <nav className="mx-auto dark:bg-gray-700 dark:text-white sticky inset-0 z-10 block h-max w-full max-w-full rounded-none border border-white/80 bg-white bg-opacity-80 py-2 px-4 text-white shadow-md backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4" >
      <div>
        <div className="container mx-auto justify-between flex items-center text-gray-900 dark:text-white" >
          <img src={('/src/assets/logo.png')} className="h-14 mr-3" alt="FlowBite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            <a href="#">
              <img src="https://fontmeme.com/permalink/230822/b9a55d4a57cbd16fa42d57324bb65c88.png" alt="fuente-stage-oriental" className="border-0" /></a>
          </span>
          <ul className="ml-auto mr-8 hidden items-center gap-6 lg:flex" >
            <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
              <Link className="flex items-center" to="/" >Home</Link>
            </li>

            { authContext?.user &&
              <>
                {/* <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                  <Link className="flex items-center" to="/userProfile" >userProfile</Link>
                </li> */}
                <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                  <Link className="flex items-center" to="/carrito" >Carrito</Link>
                </li>
              </>
            }

            { (authContext?.user && 
              authContext?.user?.permissions.includes('write')) && 
            
              <li className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                <Link className="flex items-center" to="/addproducts" >Add Products</Link>
              </li>
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
                  <p className="block p-1 font-sans text-base font-normal leading-normal text-inherit antialiased">
                    <Link className="flex items-center" to="/userProfile" >
                      {authContext?.user.email}
                    </Link>
                  </p>
                  
                  <Logout />
                </>
              }
            </li>
            <li className="block p-1 font-sans font-normal leading-normal text-inherit antialiased">
              <button onClick={ToggleTheme} >
                { document.documentElement.classList.value === 'dark' ? 

                  /* moon */
                  <svg className="w-6 h-6 text-violet-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                    <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"/>
                  </svg>
                  :
                  /* sun */
                  <svg className="w-6 h-6 dark:text-violet-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"/>
                  </svg>
                }
              </button>
            </li>
          </ul>
          
          <button
            className="middle none relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] rounded-lg text-center font-sans text-xs font-medium uppercase text-blue-gray-500 transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden text-gray-500 dark:text-gray-400"
            data-collapse-target="navbar"
            onClick={changeMenuHidden}
          >
            <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </span>
          </button>
        </div>

        <div
          ref={menuNavbar}
          className="block h-0 w-full basis-full overflow-hidden transition-all duration-300 ease-in lg:hidden text-gray-500 dark:text-gray-400"
          data-collapse="navbar"
        >
          <ul className="mt-2 mb-4 flex flex-col gap-2 pb-2">
            <li className="block p-1 font-sans text-sm font-normal leading-normal text-inherit antialiased">
              <Link className="flex items-center" to="/" >Home</Link>
            </li>
           {/*  <li className="block p-1 font-sans text-sm font-normal leading-normal text-inherit antialiased">
              <Link className="flex items-center" to="/userProfile" >userProfile</Link>
            </li> */}
            <li className="block p-1 font-sans text-sm font-normal leading-normal text-inherit antialiased">
              <Link className="flex items-center" to="/carrito" >Carrito</Link>
            </li>
            <li className="block p-1 font-sans text-sm font-normal leading-normal text-inherit antialiased">
              <Link className="flex items-center" to="/add" >Add User</Link>
            </li>
            <li className="block p-1 font-sans text-sm font-normal leading-normal text-inherit antialiased">
              <Link className="flex items-center" to="/addproducts" >Add Products</Link>
            </li>
            <li className="p-1 font-sans text-sm font-normal leading-normal text-inherit antialiased gap-3 flex flex-col">
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
                  <p className="text-base block p-1 font-sans font-normal leading-normal text-inherit antialiased">
                    <Link className="flex items-center" to="/userProfile" >
                      {authContext?.user.email}
                    </Link>
                  </p>
                  <Logout />
                </>
              }
            </li>
            <li className="block p-1 font-sans font-normal leading-normal text-inherit antialiased">
              <button onClick={ToggleTheme} >
                { document.documentElement.classList.value === 'dark' ? 

                  /* moon */
                  <svg className="w-6 h-6 text-violet-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                    <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"/>
                  </svg>
                  :
                  /* sun */
                  <svg className="w-6 h-6 dark:text-violet-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"/>
                  </svg>
                }
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}