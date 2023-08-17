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
import { IUser } from "../type/interface";
import UserService from "../services/users.service";
interface Props {
  children: React.ReactNode
}

const userService = new UserService();
export type AuthContext = {
  signup: (email: string, password: string) => Promise<void>, 
  login: (email: string, password: string) => Promise<void>,
  user: IUser | null, 
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
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const signup = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const login = async (email: string, password: string): Promise<void> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    if(userCredential){
      if(userCredential.user !== null && userCredential.user.email !== null) {
        const loggedUser = await userService.getUserByEmail(userCredential.user.email)

        if(loggedUser !== null) {
          setUser(loggedUser)
        }
      }
    }
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
          const getUser: IUser[] = snapshot.docs.map((doc) => doc.data() as IUser );
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