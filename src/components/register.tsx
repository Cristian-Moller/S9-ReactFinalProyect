import React, { useState } from "react"
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { IUser } from "../type/interface";
import { addDoc, collection } from "firebase/firestore";
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
    navigate('/')
  }

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
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="********"
          onChange={handleChange}
        />

        <button>Register</button>

      </form>
    </div>
  )
}