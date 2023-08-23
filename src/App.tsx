import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import { Register } from './components/register'
import { Login } from './components/login'
import { AuthProvider, useAuth } from "./context/authContext";
import { ProtectedRoute } from './components/protectedRoute';
import { AdminView } from './pages/adminView';
import { Nav } from './components/nav';
import Cart  from './components/carrito';
import { UserProfile } from './pages/userProfile';
import { AddProducts } from './pages/addProducts';
import { ThemeProvider } from './context/themeContext';
import CartService from './services/cart.service';
import Footer from './components/footer';


function App(): JSX.Element {
  const cartService = new CartService()
  const authContext = useAuth();

  function isAllowed(permission: string, role?: string): boolean  {
    if(role) {
      return authContext !== null && authContext.user !== null 
              && authContext?.user?.permissions.includes(permission)
              && authContext?.user?.role.includes(role)
    }
    return authContext !== null && authContext.user !== null 
      && authContext?.user?.permissions.includes(permission)
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Nav children={undefined} />
        <Routes>
          <Route path='/' element={<Home /> } />
          <Route element={
              <ProtectedRoute 
                isAllowed={isAllowed('read')}
                redirectTo='/'
              />
            }
          >
            <Route path='/userProfile' element={<UserProfile /> } />
            <Route path='/carrito' element={<Cart cartService={cartService} /> } />
          </Route>
          
          <Route path='/add' element={
            <ProtectedRoute 
              isAllowed={isAllowed('write', 'admin')} 
              redirectTo='/userProfile'
            >
              <AdminView />
            </ProtectedRoute>
          }/>
          <Route path='/addproducts' element={
            <ProtectedRoute 
              isAllowed={isAllowed('write')}
              redirectTo='/userProfile'
            >
              <AddProducts />
            </ProtectedRoute>
          }/>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App