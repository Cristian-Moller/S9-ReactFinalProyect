import { useState } from "react"
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { IUser } from "../type/interface";
import UserService from "../services/users.service";
import { UserCredential } from "firebase/auth";
import { ReactComponent as GoogleIcon } from "../assets/svgs/Google.svg";

export function Login(): JSX.Element {
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
    .then(() => {
      navigate("/addproducts")
    })
    .catch(error => {
      if (error instanceof Error) setError(error.message)
      else setError('Something goes wrong!')
    })
  }

  const handleGoogleSignin = () => { 
    const newUser: IUser = {...user};
    authContext?.loginWithGoogle()
      .then(async (googleUser: UserCredential | null | undefined) => {
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
        navigate('/addproducts')
      })
      .catch((error: Error) => {
        setError(error.message)
        return null
      })
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 bg-[url('src/assets/image.jpg')] bg-cover" >
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700" >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8" >

            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Welcome Back!
            </h1>
            {error && 
              <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </p> 
            }

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
                type="submit"
                className="w-full middle none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2.5 px-5 font-sans text-xs font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-fuchsia-300"
              >
                Login
              </button>

              <div className="flex mt-7 items-center text-center">
                <hr className="border-gray-300 border-1 w-full rounded-md" />
                <label className="block font-medium text-sm text-gray-600 w-full">
                  Or
                </label>
                <hr className="border-gray-300 border-1 w-full rounded-md" />
              </div>
              
              <button 
                type="submit"
                onClick={handleGoogleSignin}
                className="w-full text-white bg-[#97b8ed] hover:bg-[#97b8ed]/90 focus:ring-2 focus:outline-none focus:ring-[#4285F4]/50 font-sans font-bold uppercase rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 lg:inline-block ">
                <GoogleIcon className="w-4 h-4 mr-2 lg:inline-block" />
                Sign in with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}