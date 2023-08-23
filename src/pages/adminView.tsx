import React, { useEffect, useState } from "react"
import { useAuth } from "../context/authContext";
import { IUser } from "../type/interface";
import UserService from "../services/users.service";

export function AdminView(): JSX.Element {
  const userService = new UserService();

  const initialValue = {
    id: '',
    email: '',
    password: '',
    permissions: [''],
    role: '',
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
  }
  const [ user, setUser ] = useState<IUser>(initialValue)
  
  const options = [
    {value: '', text: '--Choose an option--'},
    {value: 'helper', text: 'Helper'},
    {value: 'client', text: 'Client'},
  ];
  const [selected, setSelected] = useState(options[0].value);

  const authContext = useAuth()

  const [ error, setError] = useState<string | null>()

  const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    
    if (name === 'role') setSelected(value);
    setUser({...user, [name]: value})
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if(subId === '') {
      const error = await userService.addNewUser(user);

      if(error !== null) {
        setError(error)
      }
    } else {
      const error = await userService.updateUser(user, subId);

      if(error !== null) {
        setError(error)
      }
    }

    setUser({...initialValue})
    setSelected(initialValue.role)
    setSubId('')
    await getUserList()
  }

  // traigo el usuario desde firebase
  const [userList, setUserList] = useState<Array<IUser>>([])
  const [subId, setSubId] = useState<string>('')

  /* const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, 'users', id))
  } */

  function mapUserList(role: string): React.ReactElement[] {
    const users = userList.filter(user => user.role === role).map((user: IUser, index: number) => (
      <div key={index} className="">
          <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-1 dark:bg-gray-800 dark:border-gray-700">
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {user.email}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        Role: {user.role}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        Permissions: {user.permissions.join('-')}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {/* <button onClick={() => deleteUser(list.id)}>
                            Delete
                          </button> */}
                      <button 
                        type="button" className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-3.5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
                        onClick={() => setSubId(user.id)}
                      >
                        {/* edit */}
                        <svg className="w-6 h-6 align-middle fill-current overflow-hidden" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M834.3 705.7c0 82.2-66.8 149-149 149H325.9c-82.2 0-149-66.8-149-149V346.4c0-82.2 66.8-149 149-149h129.8v-42.7H325.9c-105.7 0-191.7 86-191.7 191.7v359.3c0 105.7 86 191.7 191.7 191.7h359.3c105.7 0 191.7-86 191.7-191.7V575.9h-42.7v129.8z"  /><path d="M889.7 163.4c-22.9-22.9-53-34.4-83.1-34.4s-60.1 11.5-83.1 34.4L312 574.9c-16.9 16.9-27.9 38.8-31.2 62.5l-19 132.8c-1.6 11.4 7.3 21.3 18.4 21.3 0.9 0 1.8-0.1 2.7-0.2l132.8-19c23.7-3.4 45.6-14.3 62.5-31.2l411.5-411.5c45.9-45.9 45.9-120.3 0-166.2zM362 585.3L710.3 237 816 342.8 467.8 691.1 362 585.3zM409.7 730l-101.1 14.4L323 643.3c1.4-9.5 4.8-18.7 9.9-26.7L436.3 720c-8 5.2-17.1 8.7-26.6 10z m449.8-430.7l-13.3 13.3-105.7-105.8 13.3-13.3c14.1-14.1 32.9-21.9 52.9-21.9s38.8 7.8 52.9 21.9c29.1 29.2 29.1 76.7-0.1 105.8z"  /></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
      </div>
    ))
    return users
  }

  const getOne = async (id: string) => {
    const user = await userService.getUser(id)
    if(user === null) {
      console.error('user not found')
      return
    }

    setUser(user)
    setSelected(user.role)
  }

  const getUserList = async(): Promise<void> =>{
   const users = await userService.getUserList()
   setUserList(users)
  }

  useEffect(() => {
    if(subId !== ''){
      void getOne(subId)
    }
  }, [subId])

  useEffect(() => {
    void getUserList()
  }, [])

  return (
    <div className="bg-[url('src/assets/image2.jpg')] bg-cover flex flex-row flex-wrap" >

      <section className="bg-transparent lg:w-2/5 w-full" >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-3xl xl:p-0 dark:bg-gray-800 dark:border-gray-700 lg:h-1/2" >
            <div className="p-4 space-y-4 sm:p-6" >
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Add new user
              </h1>
              {error && 
                <p className="bg-red-100 border border-red-400 text-red-700 px-1 py-1 mt-0 rounded relative">
                  {error}
                </p> 
              }

              <form onSubmit={handleSubmit} className="space-y-4" >
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New email</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="email"
                    name="email"
                    placeholder="youremail@company.com"
                    onChange={handleChange}  
                    value={user.email} 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Rol </label>
                  <select 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name='role'
                    value={selected}
                    onChange={handleChange}
                    required>
                    {options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                </div>
                { !subId &&
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Password </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      type="password"
                      name="password"
                      placeholder="********"
                      onChange={handleChange}
                      value={user.password}
                      required
                    />
                  </div>
                }
                {subId === '' ?
                  <button 
                    className="w-full middle none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2.5 px-5 font-sans text-xs font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-fuchsia-300"
                  >
                    Add Helper or Client 
                  </button>
                  :
                  <button
                    className="w-full middle none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2.5 px-5 font-sans text-xs font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-fuchsia-300"
                  >
                    Edit User
                  </button>
                }
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-transparent lg:w-3/5 w-full" >
        <div className="flex w-auto items-center justify-center px-6 py-8 mx-auto lg:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-3xl xl:p-0 dark:bg-gray-800 dark:border-gray-700 lg:h-1/2" >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 flex flex-col max-h-full" >
              <div className="p-2 space-y-4 md:space-y-6 sm:p-0 flex flex-row flex-wrap" >
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white flex justify-center align-middle">
                  User List
                </h1>
              </div>
              <div className="p-2 sm:p-0 flex flex-row flex-wrap lg:h-max w-full" >
                <div className="md:w-1/2 p-1 pt-0 m-0 lg:h-96 w-full" >
                  <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white mb-1">
                    Clients
                  </h1>
                  <div className="h-5/6 overflow-auto">
                    {mapUserList('client')}
                  </div>
                </div>
                <div className="md:w-1/2 p-1 pt-0 m-0 lg:h-96 w-full" >
                  <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white mb-1">
                    Helpers
                  </h1>
                  <div className="h-5/6 overflow-auto">
                    {mapUserList('helper')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}