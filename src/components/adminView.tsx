import React, { useEffect, useState } from "react"
import { useAuth } from "../context/authContext";
import { IUser } from "../type/interface";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  /* deleteDoc, */
  getDoc,
  setDoc
} from "firebase/firestore";
import { db } from "../firebase";

export function AdminView(): JSX.Element {

  const initialValue = {
    email: '',
    password: '',
    permissions: [''],
    rol: ''
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
    
    if (name === 'rol') setSelected(value);
    setUser({...user, [name]: value})
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')

    if (subId === '' && user.rol == "client") {
      authContext?.signup(user.email, user.password)
      .then(() => addDoc(collection(db, 'users'), {
          email: user.email,
          permissions: ["read"],
          rol: user.rol  
      }))
      .catch(error => {
        if (error instanceof Error) setError(error.message)
        else setError('Something goes wrong!')
      })
    } else if(subId === '' && user.rol == "helper") {
      authContext?.signup(user.email, user.password)
      .then(() => addDoc(collection(db, 'users'), {
        email: user.email,
        permissions: ["read","write"],
        rol: user.rol
      }))
      .catch(error => {
        if (error instanceof Error) setError(error.message)
        else setError('Something goes wrong!')
      })
    } else if(subId != '' && user.rol == "helper") {
      await setDoc(doc(db, 'users', subId), {
        email: user.email,
        permissions: ["read","write"],
        rol: user.rol
      })
    } else if(subId != '' && user.rol == "client") {
      await setDoc(doc(db, 'users', subId), {
        email: user.email,
        permissions: ["read"],
        rol: user.rol
      })
    } 
    setUser({...initialValue})
    setSelected(initialValue.rol)
    setSubId('')
  }

  // traigo el usuario desde firebase
  const [userList, setUserList] = useState<Array<[]>>([])
  const [subId, setSubId] = useState<string>('')

  /* const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, 'users', id))
  } */

  type listProps = {
    id: string;
    rol:string;
    email:string;
    permissions: {
      [0]: string;
      [1]?: string;
    }
  }

  function helperList(): React.ReactElement[] {
    const users = userList.map((list: listProps[] , index: number) => (
      <div key={index} className="">
        { list.rol === 'helper' &&
          <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-1 dark:bg-gray-800 dark:border-gray-700">
            
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {list.email}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        Rol: {list.rol}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        Permissions: {list.permissions.join('-')}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {/* <button onClick={() => deleteUser(list.id)}>
                            Delete
                          </button> */}
                      <button onClick={() => setSubId(list.id)}>
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        }
      </div>
    ))
    return users
  }
  function clientList(): React.ReactElement[] {
    const users = userList.map((list: object[], index: number) => (
      <div key={index} className="">
        { (list.rol === 'client') &&
          <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-1 dark:bg-gray-800 dark:border-gray-700">
            
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {list.email}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        Rol: {list.rol}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        Permissions: {list.permissions.join('-')}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {/* <button onClick={() => deleteUser(list.id)}>
                            Delete
                          </button> */}
                      <button onClick={() => setSubId(list.id)}>
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        }
      </div>
    ))
    return users
  }

  const getOne = async (id: string) => {
    try {
      const docRef = doc(db, 'users', id)
      const docSnap = await getDoc(docRef)
      setUser(docSnap.data())
      setSelected(docSnap.data().rol)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(subId !== ''){
      void getOne(subId)
    }
  }, [subId])

  useEffect(() => {
    const getUserList = async(): Promise<void> =>{
      try {
        const querySnapshot = await getDocs(collection(db, 'users'))
        const docs: Array<[]> = []
        querySnapshot.forEach((doc) => {
          docs.push({...doc.data(), id:doc.id})
        })
        setUserList(docs)
      } catch (error) {
        console.error(error)
      }
    }
    void getUserList()
  }, [/* lista */])

  return (
    <div className="bg-[url('src/assets/image2.jpg')] bg-cover flex flex-row flex-wrap" >

      <section className="bg-transparent lg:w-2/5 w-full" >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-3xl xl:p-0 dark:bg-gray-800 dark:border-gray-700 lg:h-1/2" >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8" >
              {error && <p>{error} </p> }
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Add new user
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" >
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New email</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="email"
                    name="email"
                    placeholder="youremail@company.com"
                    onChange={handleChange}  
                    value={user.email} 
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Rol </label>
                  <select 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name='rol'
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
                    />
                  </div>
                }
                <button 
                  className="w-full middle none center rounded-lg bg-gradient-to-tr from-fuchsia-700 to-pink-400 py-2.5 px-5 font-sans text-xs font-bold uppercase text-white shadow-md shadow-fuchsia-900/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block focus:ring-2 focus:outline-none focus:ring-fuchsia-300"
                >
                  {subId === '' ? 'Add Helper or Client' : 'Edit User'}
                </button>

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
                    {clientList()}
                  </div>
                </div>
                <div className="md:w-1/2 p-1 pt-0 m-0 lg:h-96 w-full" >
                  <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white mb-1">
                    Helpers
                  </h1>
                  <div className="h-5/6 overflow-auto">
                    {helperList()}
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