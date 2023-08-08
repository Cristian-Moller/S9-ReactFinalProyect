import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
interface Props {
  children?: React.ReactNode;
  isAllowed?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<Props> = ({ isAllowed, children, redirectTo='/'}) => {
  const authContext = useAuth();
  
  if(authContext?.loading) return <h3>Loading...</h3>

  if(!isAllowed) return <Navigate to={redirectTo} />
  

  return (
    <>
      { children  ?  children  : <Outlet /> }
    </>
  )
}