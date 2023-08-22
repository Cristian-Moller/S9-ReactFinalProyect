import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { IUser } from "../type/interface";
import { db } from "../firebase";

export default class UserService {
  async updateUser(user : IUser, subId: string) : Promise<string | null> {
    /* if (subId === '' && user.role == "client") {
      addDoc(collection(db, 'users'), {
        email: user.email,
        permissions: ["read"],
        role: user.role  
      })
      .catch((error: Error) => {
        return error.message
      })
    } else if(subId === '' && user.role == "helper") {
      addDoc(collection(db, 'users'), {
        email: user.email,
        permissions: ["read","write"],
        role: user.role
      })
      .catch((error: Error) => {
        return error.message
      })
    } else */ 
    if(subId != '' && user.role == "helper") {
      await setDoc(doc(db, 'users', subId), {
        email: user.email,
        permissions: ["read","write"],
        role: user.role
      })
    } else if(subId != '' && user.role == "client") {
      await setDoc(doc(db, 'users', subId), {
        email: user.email,
        permissions: ["read"],
        role: user.role
      })
    } 
    return null;
  }

  async getUser(id: string) : Promise<IUser | null>{
    try {
      const docRef = doc(db, 'users', id)
      const docSnap = await getDoc(docRef)
      const data = docSnap.data()

      if(!data){
        return null
      }
      return data as IUser
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getUserByEmail(email: string) : Promise<IUser | null>{
    try {
      const getUserByEmail = query(collection(db, 'users'), where("email", "==", email))

      const querySnapshot = await getDocs(getUserByEmail)
      if(querySnapshot.empty) {
        return null
      }
      return querySnapshot.docs[0].data() as IUser;

    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getUserList(): Promise<Array<IUser>> {
    const userList = new Array<IUser>()
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      querySnapshot.forEach((doc) => {
        userList.push({...doc.data() as IUser, id:doc.id})
      })
      return userList
    } catch (error) {
      console.error(error)
      return new Array<IUser>()
    }
  }

  async addNewUser(user: IUser) : Promise<string | null> {

    const getUserByEmail = query(collection(db, 'users'), where("email", "==", user.email))
    const querySnapshot = await getDocs(getUserByEmail)
    
    if(querySnapshot.empty) {
      addDoc(collection(db, 'users'), {
        email: user.email,
        permissions: user.permissions,
        role: user.role
      })
      .catch((error: Error) => {
        return error.message
      })
     return null;
    } 
    return "user already exist";
  }

}