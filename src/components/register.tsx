import React, { useState } from "react"
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { IUser } from "../type/interface";
import UserService from "../services/users.service";
import { UserCredential } from "firebase/auth";

export function Register(): JSX.Element {
  const userService = new UserService();

  const [ user, setUser ] = useState<IUser>({
    id: '',
    email: '',
    password: '',
    permissions: ['read'],
    role: 'client',
    img: '',
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    streetAddress: '',
    streetNumber: '',
    aptUnit: '',
    city: '',
    province: '',
    zip: '',
  })

  const authContext = useAuth()

  const navigate = useNavigate()
  const [ error, setError] = useState<string | null>()

  const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [name]: value})
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const signupError = await authContext?.signup(user.email, user.password)
      .then(() => null)
      .catch((error:Error) => {
        return error.message;
      })

    if(signupError !== null) {
      setError(signupError);
    } else {
      const addUserError = await userService.addNewUser(user)

      if(addUserError !== null) {
        setError(addUserError)
      }
    }
    navigate('/client')
  }

  const handleGoogleSignin = async () => { 
    const newUser: IUser = {...user};
    const googleUser: UserCredential | null | undefined = await authContext?.loginWithGoogle()
      .catch((error: Error) => {
        setError(error.message)
        return null
      })

    if(!googleUser) {
      setError("invalid user")
      return;
    }

    if(googleUser === null) {
      setError("invalid user")
      return;
    }

    if(googleUser.user.email === null) {
      setError("invalid user")
      return;
    }

    newUser.email = googleUser.user.email
    const addUserError = await userService.addNewUser(newUser)
       
    if(addUserError !== null) {
      setError(addUserError)
    }
    navigate('/client')
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
                className="w-full text-white bg-[#97b8ed] hover:bg-[#97b8ed]/90 focus:ring-2 focus:outline-none focus:ring-[#4285F4]/50 font-sans font-bold uppercase rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 lg:inline-block ">
                <svg className="w-4 h-4 mr-2 lg:inline-block" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="-0.5 0 48 49">
                  <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Color-" transform="translate(-401.000000, -860.000000)">
                      <g id="Google" transform="translate(401.000000, 860.000000)"> 
                        <path
                          d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                          id="Fill-1" fill="#FBBC05"> </path>
                        <path
                          d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                          id="Fill-2" fill="#EB4335"> </path>
                        <path
                          d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                          id="Fill-3" fill="#34A853"> </path>
                        <path
                          d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                          id="Fill-4" fill="#4285F4"> </path>
                      </g>
                    </g>
                  </g>
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