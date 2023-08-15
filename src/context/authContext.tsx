import { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential
 } from "firebase/auth";

import { auth, db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
interface Props {
  children: React.ReactNode
}

export type AuthContext = {
  signup: (email: string, password: string) => Promise<void>, 
  login: (email: string, password: string) => Promise<void>,
  user: User | null, 
  logout: () => Promise<void>, 
  loading: boolean, 
  loginWithGoogle: () => Promise<UserCredential>,
}

export const authContext = createContext<AuthContext | null>(null)

export const useAuth = (): AuthContext | null => {
  const context = useContext(authContext)
  return context
}

export const AuthProvider : React.FC<Props> = ({ children}) =>  {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const signup = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () : Promise<void> => {
    await signOut(auth)
  }

  const loginWithGoogle = (): Promise<UserCredential> => {
    const googleProvider = new GoogleAuthProvider()
    return signInWithPopup(auth, googleProvider)
  }

  useEffect(() => {
    
      onAuthStateChanged(auth, (currentUser: User | null) => {
        
        const q = query(collection(db, "users"), where("email", "==", currentUser?.email || ''));
        onSnapshot(q, (snapshot) => {
          const getUser: User[] = snapshot.docs.map((doc) => doc.data() as User );
          setUser(getUser[0])
        });
        setLoading(false)
      })
    
  },[])
  
  return (
    <authContext.Provider 
      value={{ 
        signup,
        login,
        user,
        logout,
        loading,
        loginWithGoogle
      }}
    >
      {children}
    </authContext.Provider>
  )
}