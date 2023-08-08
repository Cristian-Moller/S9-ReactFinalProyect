import { useState } from "react"
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { IUser } from "../type/interface";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export function Login(): JSX.Element {

  const [ user, setUser ] = useState<IUser>({
    email: '',
    password: '',
    permissions: ['read'],
    rol: 'client'
  })
 
  const authContext = useAuth();

  const navigate = useNavigate()
  const [ error, setError] = useState<string | null>()

  const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [name]: value})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    authContext?.login(user.email, user.password)
    .then(() => navigate('/client'))
    .catch(error => {
      if (error instanceof Error) setError(error.message)
      else setError('Something goes wrong!')
    })
  }

  const handleGoogleSignin = () => {
    authContext?.loginWithGoogle()
    .then(async (result) => {
      const getUserByEmail = query(collection(db, 'users'), where("email", "==", result.user.email))
      
      const querySnapshot = await getDocs(getUserByEmail)
      if(querySnapshot.docs.length == 0) {
        addDoc(collection(db, 'users'), {
          email: result.user.email,
          permissions: user.permissions,
          rol: user.rol
        })
        .catch(error => {
          if (error instanceof Error) setError(error.message)
          else setError('Something goes wrong!')
        })
        navigate('/client')
      } else {
        navigate('/client')
      }
    })

    .catch(error => {
      if (error instanceof Error) setError(error.message)
      else setError('Something goes wrong!')
    })
    
  }

  return (
    <div className="">
        {error && <p>{error} </p> }
      <form onSubmit={handleSubmit} className="" >
        <>Welcome Back!</>
        <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="youremail@company.com"
            onChange={handleChange}  
          />
        

        <label htmlFor="password" >Password </label>
          <input
            type="password"
            name="password"
            placeholder="********"
            onChange={handleChange}
          />
        
        <button className="" >
          Login
        </button>
        
        <>or Login with</>

        <button onClick={handleGoogleSignin} className="" > 
          Google
        </button>

      </form>
    </div>
  )
}