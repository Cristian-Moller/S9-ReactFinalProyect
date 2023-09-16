import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ILogoutProps } from "../type/interface";

export function Logout(props: ILogoutProps) {

  const authContext = useAuth();
  const navigate = useNavigate()

  const handleLogout = () => {
    authContext?.logout()
    .catch(error => console.log(error))
    props.setTotal(0)
    navigate('/')
  }

  return (
    <>
      <button 
        onClick={handleLogout} 
        className="middle none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2 px-4 font-sans font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block max-w-fit"
        type="button"
        data-ripple-light="true"
      >
        Logout
      </button>
    </>
  )
}