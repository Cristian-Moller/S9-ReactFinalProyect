import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export function Logout() {

  const authContext = useAuth();
  const navigate = useNavigate()

  const handleLogout = () => {
    authContext?.logout()
    .catch(error => console.log(error))
    navigate('/')
  }

  return (
    <>
      <button onClick={handleLogout} >
        Logout
      </button>
    </>
  )
}