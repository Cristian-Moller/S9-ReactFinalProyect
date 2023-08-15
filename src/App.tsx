import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import { Register } from './components/register'
import { Login } from './components/login'
import { AuthProvider, useAuth } from "./context/authContext";
import { ProtectedRoute } from './components/protectedRoute';
import { AdminView } from './components/adminView';
import { Nav } from './components/nav';
import { Carrito } from './components/carrito';
import { Client } from './components/client';
import { AddProducts } from './components/addProducts';
import { ThemeProvider } from './context/themeContext';

function App(): JSX.Element {

  const authContext = useAuth();

  return (
    <ThemeProvider>
      <AuthProvider>
        <Nav children={undefined} />
        <Routes>
          <Route path='/' element={<Home /> } />
          <Route element={
              <ProtectedRoute 
                isAllowed={!!authContext?.user}
                redirectTo='/'
              />
            }
          >
            <Route path='/client' element={<Client /> } />
            <Route path='/carrito' element={<Carrito /> } />
          </Route>
          
          <Route path='/add' element={
            <ProtectedRoute 
              isAllowed={!!authContext?.user 
                && authContext?.user?.permissions.includes('write')
                && authContext?.user?.rol.includes('admin')
              }
              redirectTo='/client'
            >
              <AdminView />
            </ProtectedRoute>
          }/>
          <Route path='/addproducts' element={
            <ProtectedRoute 
              isAllowed={!!authContext?.user
                && authContext?.user?.permissions.includes('write')
              }
              redirectTo='/client'
            >
              <AddProducts />
            </ProtectedRoute>
          }/>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App