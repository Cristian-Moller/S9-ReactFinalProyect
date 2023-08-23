import { useEffect, useState } from "react";
import UserService from "../services/users.service";
import { IUser } from "../type/interface";
import { useAuth } from "../context/authContext";

export function UserProfile() {

  const authContext = useAuth()
  const initialValue = {
    ...authContext?.user,
  }
  const userService = new UserService();
  const [ user, setUser ] = useState<IUser>(initialValue)
  const [id, setId] = useState<string>('')
  const [ error, setError] = useState<string | null>()
  const [ inputActive, setInputActive ] = useState<boolean>(false)
  let urlImageDesc: string | ArrayBuffer | null

  const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [name]: value})
  }

  const fileHandle = (archives: string) => {

    Array.from(archives).forEach((archive: string): void => {
     const reader = new FileReader()
     reader.readAsDataURL(archive)
     reader.onload = function(this: FileReader) {

       const base64: string | ArrayBuffer | null = reader.result
       urlImageDesc = base64
       setUser({...user, img: urlImageDesc})
     }
   }) 
  }

  const editImg = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUser({...user, img: ''})
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()  
    setInputActive(!inputActive)

    if(inputActive === true) {
      const error = await userService.updateProfileUser(user);

      if(error !== null) {
        setError(error)
      }
    }
  }
  
  const getProfile = async (email: string): Promise<void> => {
    const user = await userService.getUserByEmail(email)
    if(user === null) {
      console.error('user not found')
      return
    }
    setUser(user)
  }

  useEffect(() => {
    return void getProfile(user?.email);
  }, [])

  return (
    <form className="w-full max-w-4xl m-auto py-4" onSubmit={handleSubmit}>
      {/* tamaño imagen perfil: w-10 h-10 rounded-full */}
      {error && 
        <p className="bg-red-100 border border-red-400 text-red-700 px-1 py-1 mt-0 rounded relative">
          {error}
        </p> 
      }

      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/2 px-3 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-6" htmlFor="grid-email">
            {user.email}
          </label>
        </div>
        <div className="w-full md:w-1/2 px-3 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-6" htmlFor="grid-role">
            {user.role}
          </label>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
            First Name
          </label>
          <input 
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
            id="grid-first-name" type="text" placeholder="Jane" required
            name="firstName"
            onChange={handleChange} 
            value={user.firstName}
            readOnly={!inputActive}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
            Last Name
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" required
            name="lastName"
            onChange={handleChange} 
            value={user.lastName}
            readOnly={!inputActive}
          />
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-dni">
            DNI / NIE
          </label>
          <input 
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
            id="grid-dni" type="text" placeholder="1234567-A" required
            name="dni"
            onChange={handleChange} 
            value={user.dni}
            readOnly={!inputActive}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-phone">
            Phone
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-phone" type="tel" placeholder="123-12-12-12" required
            pattern="[0-9]{9}"
            name="phone"
            onChange={handleChange} 
            value={user.phone}
            readOnly={!inputActive}
          />
        </div>
      </div>

      <div className="flex w-full ">
        <div className="w-full mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white" 
            htmlFor="large_size">Image</label>
          { (user.img === undefined || user.img === '') ?
            <input 
              className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="large_size"
              type="file" 
              name="img"
              onChange={(e) => fileHandle(e.target.files)}
              disabled={!inputActive}
            />
            :
            <div className="w-full flex justify-center">
              <img className="w-32 h-32 rounded-full" src={user.img} id="imgId" alt="" />
              <button
                type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 h-14"
                onClick={(e) => editImg(e)}
                disabled={!inputActive}
              >
                {/* delete */}
                <svg className="w-6 h-6 align-middle fill-current overflow-hidden" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" enable-background="new 0 0 256 256"><path d="M229.2,60.6h-23.6l-15.8,163c0,12.4-10.1,22.5-22.5,22.5H88.7c-12.4,0-22.5-10.1-22.5-22.5l-15.8-163H26.8c-3.1,0-5.6-2.5-5.6-5.6s2.5-5.6,5.6-5.6h22.5h11.2h16.9V32.5C77.4,20.1,87.5,10,99.9,10h56.2c12.4,0,22.5,10.1,22.5,22.5v16.9h16.9h11.2h22.5c3.1,0,5.6,2.5,5.6,5.6S232.3,60.6,229.2,60.6z M167.3,32.4c0-6.2-5-11.2-11.2-11.2H99.9c-6.2,0-11.2,5-11.2,11.2v16.9h78.7V32.4z M61.6,60.6l15.8,163c0,6.2,5,11.2,11.2,11.2h78.7c6.2,0,11.2-5,11.2-11.2l15.8-163H61.6z M156.1,212.3c-3.1,0-5.6-2.5-5.6-5.6l5.6-118c0-3.1,2.5-5.6,5.6-5.6c3.1,0,5.6,2.5,5.6,5.6l-5.6,118C161.7,209.8,159.2,212.3,156.1,212.3z M128,212.3c-3.1,0-5.6-2.5-5.6-5.6v-118c0-3.1,2.5-5.6,5.6-5.6s5.6,2.5,5.6,5.6v118C133.6,209.8,131.1,212.3,128,212.3z M99.9,212.3c-3.1,0-5.6-2.5-5.6-5.6l-5.6-118c0-3.1,2.5-5.6,5.6-5.6c3.1,0,5.6,2.5,5.6,5.6l5.6,118C105.5,209.8,103,212.3,99.9,212.3z"/></svg>
              </button>
            </div>
          }
        </div>
      </div>

      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-street-address">
            Street Address
          </label>
          <input 
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-street-address" type="text" placeholder="Carrer de Roc Boronat"
            name="streetAddress"
            onChange={handleChange} 
            value={user.streetAddress}
            readOnly={!inputActive}
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-street-number">
            Number
          </label>
          <input 
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-street-number" type="text" placeholder="117"
            name="streetNumber"
            onChange={handleChange} 
            value={user.streetNumber}
            readOnly={!inputActive}
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-apt-unit">
            Apt/Unit
          </label>
          <input 
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-apt-unit" type="text" placeholder="Primero"
            name="aptUnit"
            onChange={handleChange} 
            value={user.aptUnit}
            readOnly={!inputActive}
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
            City
          </label>
          <input 
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-city" type="text" placeholder="Barcelona"
            name="city"
            onChange={handleChange} 
            value={user.city}
            readOnly={!inputActive}
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
            Province
          </label>
          <input 
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-province" type="text" placeholder="Barcelona"
            name="province"
            onChange={handleChange} 
            value={user.province}
            readOnly={!inputActive}
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
            Zip
          </label>
          <input 
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="08018"
            name="zip"
            onChange={handleChange} 
            value={user.zip}
            readOnly={!inputActive}
          />
        </div>
      </div>
      <div className="w-full text-center">
        {inputActive === false ?
          <button 
            className="w-1/2 middle none center rounded-lg bg-gradient-to-t from-cyan-500 to-fuchsia-700 py-2.5 px-5 font-sans text-base font-bold uppercase text-white shadow-md shadow-cyan-900/30 transition-all hover:shadow-lg hover:shadow-cyan-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-violet-300"
            onClick={() => setId(user.id)}
          >
            Edit User
          </button>
          :
          <button
            className="w-1/2 middle none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2.5 px-5 font-sans text-base font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-fuchsia-300"
          >
            Save Profile
          </button>
        }
      </div>
    </form>
  )
}