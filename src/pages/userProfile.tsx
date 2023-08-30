import { useEffect, useState } from "react";
import UserService from "../services/users.service";
import { IUser } from "../type/interface";
import { useAuth } from "../context/authContext";
import { ReactComponent as DeleteIcon } from "../assets/svgs/Delete.svg";
import Helper from "../helpers/image.helper";

const helper = new Helper();
export function UserProfile() {

  const authContext = useAuth()
  const initialValue = {
    ...authContext?.user as IUser,
  }
  const userService = new UserService();
  const [ user, setUser ] = useState<IUser>(initialValue)
  const [ error, setError] = useState<string | null>()
  const [ inputActive, setInputActive ] = useState<boolean>(false)
  let urlImageDesc: string | ArrayBuffer | null

  const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [name]: value})
  }

  const fileHandle = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(e.target == null) return;

    const archives: FileList | null = e.currentTarget.files;
    
    if(archives == null) return;

    for (let i = 0; i < archives.length; i++) {
      const archive = archives.item(i)

      if(archive == null) continue

      const reader = new FileReader()
      reader.readAsDataURL(archive)
      reader.onload = function(this: FileReader) {

        const base64: string | ArrayBuffer | null = reader.result
        urlImageDesc = base64
        setUser({...user, img: urlImageDesc})
      }
    }
  }

  const editImg = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setUser({...user, img: ''})
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()  
    setInputActive(!inputActive)

    if(inputActive === true) {
      userService.updateProfileUser(user)
        .then((error: string | null) => {
          if(error !== null) {
            setError(error)
          }
        })
        .catch((error : Error) => setError(error.message));
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
    <section className="bg-[url('src/assets/corkBoard.jpg')] bg-cover py-20">
      <form className="w-full max-w-4xl m-auto p-4 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700" onSubmit={handleSubmit}>
        {error && 
          <p className="bg-red-100 border border-red-400 text-red-700 px-1 py-1 mt-0 rounded relative">
            {error}
          </p> 
        }

        <div className="flex flex-wrap -mx-3 ">
          <div className="w-full md:w-1/2 px-3 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-6 dark:text-white" htmlFor="grid-email">
              {user.email}
            </label>
          </div>
          <div className="w-full md:w-1/2 px-3 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-6 dark:text-white" htmlFor="grid-role">
              {user.role}
            </label>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-first-name">
              First Name
            </label>
            <input 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              id="grid-first-name" type="text" placeholder="Jane" required
              name="firstName"
              onChange={handleChange} 
              value={user.firstName}
              readOnly={!inputActive}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-last-name">
              Last Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="grid-last-name" type="text" placeholder="Doe" required
              name="lastName"
              onChange={handleChange} 
              value={user.lastName}
              readOnly={!inputActive}
            />
          </div>

          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-dni">
              DNI / NIE
            </label>
            <input 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              id="grid-dni" type="text" placeholder="1234567-A" required
              name="dni"
              onChange={handleChange} 
              value={user.dni}
              readOnly={!inputActive}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-phone">
              Phone
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="grid-phone" type="tel" placeholder="123-12-12-12" required
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
                className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="large_size"
                type="file" 
                name="img"
                onChange={fileHandle}
                disabled={!inputActive}
              />
              :
              <div className="w-full flex justify-center">
                <img className="w-32 h-32 rounded-full" src={helper.getImageOrDefault(user.img, "src/assets/userNotFound.png")} id="imgId" alt="" />
                <button
                  type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 h-12"
                  onClick={editImg}
                  disabled={!inputActive}
                >
                  <DeleteIcon className="w-6 h-6 align-middle fill-current overflow-hidden"/>
                </button>
              </div>
            }
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-street-address">
              Street Address
            </label>
            <input 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="grid-street-address" type="text" placeholder="Carrer de Roc Boronat"
              name="streetAddress"
              onChange={handleChange} 
              value={user.streetAddress}
              readOnly={!inputActive}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-street-number">
              Number
            </label>
            <input 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="grid-street-number" type="text" placeholder="117"
              name="streetNumber"
              onChange={handleChange} 
              value={user.streetNumber}
              readOnly={!inputActive}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-apt-unit">
              Apt/Unit
            </label>
            <input 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="grid-apt-unit" type="text" placeholder="Primero"
              name="aptUnit"
              onChange={handleChange} 
              value={user.aptUnit}
              readOnly={!inputActive}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-city">
              City
            </label>
            <input 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="grid-city" type="text" placeholder="Barcelona"
              name="city"
              onChange={handleChange} 
              value={user.city}
              readOnly={!inputActive}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-zip">
              Province
            </label>
            <input 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="grid-province" type="text" placeholder="Barcelona"
              name="province"
              onChange={handleChange} 
              value={user.province}
              readOnly={!inputActive}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" htmlFor="grid-zip">
              Zip
            </label>
            <input 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="grid-zip" type="text" placeholder="08018"
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
    </section>
  )
}