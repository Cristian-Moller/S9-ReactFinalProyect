import React, { useState } from "react"
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { IUser } from "../type/interface";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export function Register(): JSX.Element {

  const [ user, setUser ] = useState<IUser>({
    email: '',
    password: '',
    permissions: ['read'],
    rol: 'client'
  })

  const authContext = useAuth()

  const navigate = useNavigate()
  const [ error, setError] = useState<string | null>()

  const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [name]: value})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    authContext?.signup(user.email, user.password)
    .then(() => addDoc(collection(db, 'users'), {
      email: user.email,
      permissions: user.permissions,
      rol: user.rol
    }))
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

    <section className="bg-gray-50 dark:bg-gray-900 bg-[url('src/assets/image1.jpg')] bg-cover" >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700" >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8" >
            {error && <p>{error} </p> }

            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Welcome!
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" >
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="email"
                    name="email"
                    placeholder="youremail@company.com"
                    onChange={handleChange}  
                  />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Password </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    type="password"
                    name="password"
                    placeholder="********"
                    onChange={handleChange}
                  />
              </div>

              <button 
                className="w-full middle none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2.5 px-5 font-sans text-xs font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-fuchsia-300"
              >
                Register
              </button>

              <div className="flex mt-7 items-center text-center">
                <hr className="border-gray-300 border-1 w-full rounded-md" />
                <label className="block font-medium text-sm text-gray-600 w-full">
                  Or
                </label>
                <hr className="border-gray-300 border-1 w-full rounded-md" />
              </div>
              
              <button 
                type="button"
                onClick={handleGoogleSignin}
                className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-2 focus:outline-none focus:ring-[#4285F4]/50 font-sans font-bold uppercase rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 lg:inline-block ">
                <svg className="w-4 h-4 mr-2 lg:inline-block" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                  <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
                </svg>
                Register with Google
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  )
}