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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  const [lista, setLista] = useState<Array<[]>>([])
  const [subId, setSubId] = useState<string>('')

  /* const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, 'users', id))
  } */

  const getOne = async (id: string) => {
    try {
      const docRef = doc(db, 'users', id)
      const docSnap = await getDoc(docRef)
      setUser(docSnap.data())
      setSelected(docSnap.data().rol)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(subId !== ''){
      void getOne(subId)
    }
  }, [subId])

  useEffect(() => {
    const getLista = async(): Promise<void> =>{
      try {
        const querySnapshot = await getDocs(collection(db, 'users'))
        const docs: Array<[]> = []
        querySnapshot.forEach((doc) => {
          docs.push({...doc.data(), id:doc.id})
        })
        setLista(docs)
      } catch (error) {
        console.log(error)
      }
    }
    void getLista()
  }, [/* lista */])

  return (
    <div>
      {error && <p>{error} </p> }
      <form onSubmit={handleSubmit} >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="youremail@company.com"
          onChange={handleChange}
          value={user.email} 
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="********"
          onChange={handleChange}
          value={user.password}
        />

        <label htmlFor="rol"> Rol
          <select name='rol' value={selected} onChange={handleChange} required>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </label>

        <button>
          {subId === '' ? 'Add Helper or Client' : 'Edit User'}
        </button>

      </form>
      
      <h1>User {authContext?.user?.email}</h1>
      <div>
        {
          lista.map((list: object[], index: number) => (
            <div key={index}>
              <p>Email: {list.email} </p>
              <p>Rol: {list.rol} </p>
              <p>Permissions: {list.permissions.join('-')} </p>
              {/* <button onClick={() => deleteUser(list.id)}>
                Delete
              </button> */}
              <button onClick={() => setSubId(list.id)}>
                Edit
              </button>
            </div>
          ))
        }
      </div>

    </div>
  )
}